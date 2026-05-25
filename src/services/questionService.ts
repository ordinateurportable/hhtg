import { db } from "../storage/db";
import { SeedQuestion, seedQuestions } from "../questions";

type DbQuestion = {
  id: number;
  topic: string;
  question_text: string;
  options_json: string;
  option_explanations_json: string | null;
  correct_index: number;
  explanation: string;
};

export type Question = {
  id: number;
  topic: string;
  text: string;
  options: string[];
  optionExplanations: string[];
  correctIndex: number;
  explanation: string;
};

export function seedQuestionsIfEmpty(): void {
  const exists = db.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
  if (exists.count > 0) {
    syncSeedQuestionContent();
    syncQuestionOptionExplanations();
    insertMissingQuestions();
    return;
  }

  insertQuestions(seedQuestions);
}

function insertQuestions(items: SeedQuestion[]): void {
  const stmt = db.prepare(`
    INSERT INTO questions (topic, question_text, options_json, option_explanations_json, correct_index, explanation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((questions: SeedQuestion[]) => {
    for (const q of questions) {
      stmt.run(q.topic, q.text, JSON.stringify(q.options), JSON.stringify(q.optionExplanations), q.correctIndex, q.explanation);
    }
  });

  tx(items);
}

function insertMissingQuestions(): void {
  const exists = db.prepare("SELECT id FROM questions WHERE question_text = ? LIMIT 1");
  const missing = seedQuestions.filter((q) => !exists.get(q.text));

  if (missing.length > 0) {
    insertQuestions(missing);
  }
}

function syncSeedQuestionContent(): void {
  const findByText = db.prepare("SELECT id FROM questions WHERE question_text = ? LIMIT 1");
  const topicCount = db.prepare("SELECT COUNT(*) as count FROM questions WHERE topic = ?");
  const updateByTopic = db.prepare(`
    UPDATE questions
    SET question_text = ?,
        options_json = ?,
        option_explanations_json = ?,
        correct_index = ?,
        explanation = ?
    WHERE topic = ?
  `);

  const tx = db.transaction((items: SeedQuestion[]) => {
    for (const q of items) {
      if (findByText.get(q.text)) continue;

      const row = topicCount.get(q.topic) as { count: number };
      if (row.count === 1) {
        updateByTopic.run(
          q.text,
          JSON.stringify(q.options),
          JSON.stringify(q.optionExplanations),
          q.correctIndex,
          q.explanation,
          q.topic
        );
      }
    }
  });

  tx(seedQuestions);
}

function syncQuestionOptionExplanations(): void {
  const stmt = db.prepare(`
    UPDATE questions
    SET option_explanations_json = ?
    WHERE question_text = ? AND (option_explanations_json IS NULL OR option_explanations_json = '')
  `);

  const tx = db.transaction((items: SeedQuestion[]) => {
    for (const q of items) {
      stmt.run(JSON.stringify(q.optionExplanations), q.text);
    }
  });

  tx(seedQuestions);
}

function toQuestion(row: DbQuestion): Question {
  const seed = seedQuestions.find((q) => q.text === row.question_text);

  return {
    id: row.id,
    topic: row.topic,
    text: row.question_text,
    options: JSON.parse(row.options_json),
    optionExplanations: row.option_explanations_json
      ? JSON.parse(row.option_explanations_json)
      : seed?.optionExplanations ?? [],
    correctIndex: row.correct_index,
    explanation: row.explanation
  };
}

export function setUserState(userId: number, mode: string, currentQuestionId?: number | null, currentMode?: string | null): void {
  db.prepare(`
    INSERT INTO user_state (user_id, mode, current_question_id, current_mode, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id)
    DO UPDATE SET mode=excluded.mode, current_question_id=excluded.current_question_id, current_mode=excluded.current_mode, updated_at=datetime('now')
  `).run(userId, mode, currentQuestionId ?? null, currentMode ?? null);
}

export function getUserState(userId: number): { mode: string; current_question_id: number | null; current_mode: string | null } | null {
  return db.prepare("SELECT mode, current_question_id, current_mode FROM user_state WHERE user_id = ?").get(userId) as any;
}

function weightedTopicPick(userId: number): string | null {
  const rows = db.prepare("SELECT topic, weight FROM topic_weights WHERE user_id = ? AND weight > 0").all(userId) as Array<{ topic: string; weight: number }>;
  if (rows.length === 0) return null;

  const weighted: string[] = [];
  for (const row of rows) {
    const capped = Math.min(8, row.weight);
    for (let i = 0; i < capped; i += 1) weighted.push(row.topic);
  }

  const idx = Math.floor(Math.random() * weighted.length);
  return weighted[idx] ?? null;
}

export function getNextQuestion(userId: number, mode: "regular" | "mistakes"): Question | null {
  if (mode === "mistakes") {
    const row = db.prepare(`
      SELECT q.*
      FROM mistakes m
      JOIN questions q ON q.id = m.question_id
      WHERE m.user_id = ? AND m.unresolved = 1
      ORDER BY m.created_at ASC
      LIMIT 1
    `).get(userId) as DbQuestion | undefined;

    return row ? toQuestion(row) : null;
  }

  const preferredTopic = weightedTopicPick(userId);
  let row: DbQuestion | undefined;

  if (preferredTopic) {
    row = db.prepare("SELECT * FROM questions WHERE topic = ? ORDER BY RANDOM() LIMIT 1").get(preferredTopic) as DbQuestion | undefined;
  }

  if (!row) {
    row = db.prepare("SELECT * FROM questions ORDER BY RANDOM() LIMIT 1").get() as DbQuestion | undefined;
  }

  return row ? toQuestion(row) : null;
}

export function saveAnswer(userId: number, question: Question, selectedIndex: number): boolean {
  const isCorrect = selectedIndex === question.correctIndex;

  db.prepare(`
    INSERT INTO answers (user_id, question_id, selected_index, is_correct)
    VALUES (?, ?, ?, ?)
  `).run(userId, question.id, selectedIndex, isCorrect ? 1 : 0);

  if (isCorrect) {
    db.prepare("UPDATE mistakes SET unresolved = 0, resolved_at = datetime('now') WHERE user_id = ? AND question_id = ?")
      .run(userId, question.id);
  } else {
    db.prepare(`
      INSERT INTO mistakes (user_id, question_id, unresolved, created_at, resolved_at)
      VALUES (?, ?, 1, datetime('now'), NULL)
      ON CONFLICT(user_id, question_id)
      DO UPDATE SET unresolved = 1, created_at = datetime('now'), resolved_at = NULL
    `).run(userId, question.id);
  }

  return isCorrect;
}

export function getQuestionById(questionId: number): Question | null {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(questionId) as DbQuestion | undefined;
  return row ? toQuestion(row) : null;
}

export function getMistakesCount(userId: number): number {
  const row = db.prepare("SELECT COUNT(*) as count FROM mistakes WHERE user_id = ? AND unresolved = 1").get(userId) as { count: number };
  return row.count;
}
