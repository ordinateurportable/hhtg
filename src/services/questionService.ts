import { db } from "../storage/db";
import { SeedQuestion, seedQuestions } from "../questions";

type DbQuestion = {
  id: number;
  topic: string;
  question_text: string;
  options_json: string;
  option_explanations_json: string | null;
  difficulty: number;
  sort_order: number;
  correct_index: number;
  explanation: string;
};

export type Question = {
  id: number;
  topic: string;
  text: string;
  options: string[];
  optionExplanations: string[];
  difficulty: number;
  sortOrder: number;
  correctIndex: number;
  explanation: string;
};

export type QuizMode = "regular" | "mistakes" | "interview" | "topic_html" | "topic_css" | "topic_js";

export function seedQuestionsIfEmpty(): void {
  const exists = db.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
  if (exists.count > 0) {
    syncSeedQuestionContent();
    syncQuestionOptionExplanations();
    insertMissingQuestions();
    syncQuestionOrder();
    return;
  }

  insertQuestions(seedQuestions);
}

function insertQuestions(items: SeedQuestion[]): void {
  const stmt = db.prepare(`
    INSERT INTO questions (topic, question_text, options_json, option_explanations_json, difficulty, sort_order, correct_index, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((questions: SeedQuestion[]) => {
    for (const q of questions) {
      const seedIndex = seedQuestions.findIndex((item) => item.text === q.text);
      stmt.run(
        q.topic,
        q.text,
        JSON.stringify(q.options),
        JSON.stringify(q.optionExplanations),
        q.difficulty ?? difficultyForTopic(q.topic),
        q.sortOrder ?? seedIndex,
        q.correctIndex,
        q.explanation
      );
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
        difficulty = ?,
        sort_order = ?,
        correct_index = ?,
        explanation = ?
    WHERE topic = ?
  `);

  const tx = db.transaction((items: SeedQuestion[]) => {
    for (const q of items) {
      if (findByText.get(q.text)) continue;

      const row = topicCount.get(q.topic) as { count: number };
      if (row.count === 1) {
        const seedIndex = seedQuestions.findIndex((item) => item.text === q.text);
        updateByTopic.run(
          q.text,
          JSON.stringify(q.options),
          JSON.stringify(q.optionExplanations),
          q.difficulty ?? difficultyForTopic(q.topic),
          q.sortOrder ?? seedIndex,
          q.correctIndex,
          q.explanation,
          q.topic
        );
      }
    }
  });

  tx(seedQuestions);
}

function syncQuestionOrder(): void {
  const stmt = db.prepare("UPDATE questions SET difficulty = ?, sort_order = ? WHERE question_text = ?");

  const tx = db.transaction((items: SeedQuestion[]) => {
    items.forEach((q, index) => {
      stmt.run(q.difficulty ?? difficultyForTopic(q.topic), q.sortOrder ?? index, q.text);
    });
  });

  tx(seedQuestions);
}

function difficultyForTopic(topic: string): number {
  const order = [
    "html_semantics",
    "attributes",
    "block_inline",
    "forms",
    "selectors",
    "box_model",
    "units",
    "cascade",
    "specificity",
    "flexbox",
    "position",
    "responsive",
    "media_queries",
    "grid",
    "pseudo",
    "js_variables",
    "js_types",
    "js_conversion",
    "js_operators",
    "js_comparison",
    "js_conditions",
    "js_logic",
    "js_loops",
    "js_switch",
    "js_functions",
    "js_arrow_functions",
    "js_scope",
    "js_hoisting",
    "js_arrays",
    "js_objects",
    "js_this",
    "js_prototypes",
    "js_constructor_functions",
    "js_closures",
    "js_recursion",
    "js_binary_search",
    "js_classes",
    "js_strings",
    "js_errors",
    "js_builtin",
    "js_collections",
    "js_dom",
    "js_events",
    "js_async"
  ];

  const index = order.indexOf(topic);
  return index === -1 ? 99 : index + 1;
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
    difficulty: row.difficulty,
    sortOrder: row.sort_order,
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

export function getNextQuestion(userId: number, mode: QuizMode): Question | null {
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

  if (mode === "interview") {
    return getNextInterviewQuestion(userId);
  }

  const topicFilter = topicsForMode(mode);
  const dueReview = getDueReview(userId, topicFilter);

  if (dueReview) {
    return toQuestion(dueReview);
  }

  const newQuestion = getNewQuestion(userId, topicFilter);

  return newQuestion ? toQuestion(newQuestion) : null;
}

function getDueReview(userId: number, topics: string[] | null): DbQuestion | undefined {
  const topicSql = topics ? `AND q.topic IN (${topics.map(() => "?").join(",")})` : "";

  return db.prepare(`
    SELECT q.*
    FROM question_progress p
    JOIN questions q ON q.id = p.question_id
    LEFT JOIN mistakes m ON m.user_id = p.user_id AND m.question_id = p.question_id AND m.unresolved = 1
    WHERE p.user_id = ?
      AND p.due_at <= datetime('now')
      AND m.id IS NULL
      ${topicSql}
    ORDER BY p.due_at ASC, q.difficulty ASC, q.sort_order ASC
    LIMIT 1
  `).get(userId, ...(topics ?? [])) as DbQuestion | undefined;
}

function getNewQuestion(userId: number, topics: string[] | null): DbQuestion | undefined {
  const topicSql = topics ? `AND q.topic IN (${topics.map(() => "?").join(",")})` : "";

  return db.prepare(`
    SELECT q.*
    FROM questions q
    LEFT JOIN question_progress p ON p.user_id = ? AND p.question_id = q.id
    LEFT JOIN topic_weights tw ON tw.user_id = ? AND tw.topic = q.topic
    WHERE p.question_id IS NULL
      ${topicSql}
    ORDER BY q.difficulty ASC,
      CASE WHEN COALESCE(tw.weight, 0) > 0 THEN 0 ELSE 1 END ASC,
      COALESCE(tw.weight, 0) DESC,
      q.sort_order ASC
    LIMIT 1
  `).get(userId, userId, ...(topics ?? [])) as DbQuestion | undefined;
}

function topicsForMode(mode: QuizMode): string[] | null {
  if (mode === "topic_html") {
    return ["html_semantics", "forms", "attributes", "block_inline"];
  }

  if (mode === "topic_css") {
    return [
      "selectors",
      "specificity",
      "box_model",
      "flexbox",
      "grid",
      "position",
      "responsive",
      "media_queries",
      "pseudo",
      "cascade",
      "units"
    ];
  }

  if (mode === "topic_js") {
    return [
      "js_variables",
      "js_types",
      "js_conversion",
      "js_operators",
      "js_comparison",
      "js_conditions",
      "js_logic",
      "js_loops",
      "js_switch",
      "js_functions",
      "js_arrow_functions",
      "js_scope",
      "js_hoisting",
      "js_arrays",
      "js_objects",
      "js_this",
      "js_prototypes",
      "js_constructor_functions",
      "js_closures",
      "js_recursion",
      "js_binary_search",
      "js_classes",
      "js_strings",
      "js_errors",
      "js_builtin",
      "js_collections",
      "js_dom",
      "js_events",
      "js_async"
    ];
  }

  return null;
}

export function saveAnswer(userId: number, question: Question, selectedIndex: number, mode: QuizMode = "regular"): boolean {
  const isCorrect = selectedIndex === question.correctIndex;

  db.prepare(`
    INSERT INTO answers (user_id, question_id, selected_index, is_correct)
    VALUES (?, ?, ?, ?)
  `).run(userId, question.id, selectedIndex, isCorrect ? 1 : 0);

  updateQuestionProgress(userId, question.id, isCorrect);
  if (mode === "interview") {
    updateInterviewSession(userId, question.id, isCorrect);
  }

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

export function startInterview(userId: number, total = 10): void {
  db.prepare(`
    INSERT INTO interview_sessions (user_id, total, answered, correct, asked_ids_json, is_active, started_at, finished_at)
    VALUES (?, ?, 0, 0, '[]', 1, datetime('now'), NULL)
    ON CONFLICT(user_id)
    DO UPDATE SET
      total = excluded.total,
      answered = 0,
      correct = 0,
      asked_ids_json = '[]',
      is_active = 1,
      started_at = datetime('now'),
      finished_at = NULL
  `).run(userId, total);
}

export function getInterviewStatus(userId: number): { total: number; answered: number; correct: number; isActive: boolean } | null {
  const row = db.prepare(`
    SELECT total, answered, correct, is_active
    FROM interview_sessions
    WHERE user_id = ?
  `).get(userId) as { total: number; answered: number; correct: number; is_active: number } | undefined;

  return row
    ? { total: row.total, answered: row.answered, correct: row.correct, isActive: row.is_active === 1 }
    : null;
}

function getNextInterviewQuestion(userId: number): Question | null {
  const session = db.prepare(`
    SELECT total, answered, asked_ids_json, is_active
    FROM interview_sessions
    WHERE user_id = ?
  `).get(userId) as { total: number; answered: number; asked_ids_json: string; is_active: number } | undefined;

  if (!session || session.is_active !== 1 || session.answered >= session.total) {
    return null;
  }

  const askedIds = JSON.parse(session.asked_ids_json) as number[];
  const placeholders = askedIds.map(() => "?").join(",");
  const excludeSql = askedIds.length ? `WHERE q.id NOT IN (${placeholders})` : "";
  const row = db.prepare(`
    SELECT q.*
    FROM questions q
    ${excludeSql}
    ORDER BY q.difficulty ASC, RANDOM()
    LIMIT 1
  `).get(...askedIds) as DbQuestion | undefined;

  return row ? toQuestion(row) : null;
}

function updateInterviewSession(userId: number, questionId: number, isCorrect: boolean): void {
  const session = db.prepare(`
    SELECT total, answered, correct, asked_ids_json, is_active
    FROM interview_sessions
    WHERE user_id = ? AND is_active = 1
  `).get(userId) as { total: number; answered: number; correct: number; asked_ids_json: string; is_active: number } | undefined;

  if (!session) return;

  const askedIds = new Set<number>(JSON.parse(session.asked_ids_json));
  askedIds.add(questionId);
  const answered = session.answered + 1;
  const correct = session.correct + (isCorrect ? 1 : 0);
  const isFinished = answered >= session.total;

  db.prepare(`
    UPDATE interview_sessions
    SET answered = ?,
        correct = ?,
        asked_ids_json = ?,
        is_active = ?,
        finished_at = CASE WHEN ? = 1 THEN datetime('now') ELSE finished_at END
    WHERE user_id = ?
  `).run(answered, correct, JSON.stringify(Array.from(askedIds)), isFinished ? 0 : 1, isFinished ? 1 : 0, userId);
}

function updateQuestionProgress(userId: number, questionId: number, isCorrect: boolean): void {
  const current = db.prepare(`
    SELECT box, correct_streak, wrong_count
    FROM question_progress
    WHERE user_id = ? AND question_id = ?
  `).get(userId, questionId) as { box: number; correct_streak: number; wrong_count: number } | undefined;

  const nextBox = isCorrect ? Math.min((current?.box ?? 0) + 1, 6) : 0;
  const interval = isCorrect ? intervalForBox(nextBox) : 0;
  const dueModifier = interval === 0 ? "+0 minutes" : `+${interval} days`;

  db.prepare(`
    INSERT INTO question_progress (
      user_id,
      question_id,
      box,
      due_at,
      first_answered_at,
      last_answered_at,
      correct_streak,
      wrong_count
    )
    VALUES (?, ?, ?, datetime('now', ?), datetime('now'), datetime('now'), ?, ?)
    ON CONFLICT(user_id, question_id)
    DO UPDATE SET
      box = excluded.box,
      due_at = excluded.due_at,
      last_answered_at = datetime('now'),
      correct_streak = excluded.correct_streak,
      wrong_count = excluded.wrong_count
  `).run(
    userId,
    questionId,
    nextBox,
    dueModifier,
    isCorrect ? (current?.correct_streak ?? 0) + 1 : 0,
    isCorrect ? current?.wrong_count ?? 0 : (current?.wrong_count ?? 0) + 1
  );
}

function intervalForBox(box: number): number {
  const intervals = [0, 2, 4, 7, 14, 30, 60];
  return intervals[box] ?? 60;
}

export function getQuestionById(questionId: number): Question | null {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(questionId) as DbQuestion | undefined;
  return row ? toQuestion(row) : null;
}

export function getMistakesCount(userId: number): number {
  const row = db.prepare("SELECT COUNT(*) as count FROM mistakes WHERE user_id = ? AND unresolved = 1").get(userId) as { count: number };
  return row.count;
}
