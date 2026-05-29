import { db } from "../storage/db";
import { topTopics } from "./vacancyService";

const DAILY_GOAL = 5;

export function getProgress(userId: number): {
  solved: number;
  correct: number;
  wrong: number;
  accuracy: number;
  todaySolved: number;
  dailyGoal: number;
  streak: number;
  dueToday: number;
  activeMistakes: number;
  recommendation: string;
  topics: Array<{ topic: string; total: number; answered: number; mastered: number }>;
  weakTopics: Array<{ topic: string; mistakes: number; wrongAnswers: number }>;
  top: Array<{ topic: string; weight: number }>;
} {
  const solved = (db.prepare("SELECT COUNT(*) as count FROM answers WHERE user_id = ?").get(userId) as { count: number }).count;
  const correct = (db.prepare("SELECT COUNT(*) as count FROM answers WHERE user_id = ? AND is_correct = 1").get(userId) as { count: number }).count;
  const wrong = solved - correct;
  const todaySolved = (db.prepare(`
    SELECT COUNT(*) as count
    FROM answers
    WHERE user_id = ? AND date(answered_at) = date('now')
  `).get(userId) as { count: number }).count;
  const dueToday = (db.prepare(`
    SELECT COUNT(*) as count
    FROM question_progress p
    LEFT JOIN mistakes m ON m.user_id = p.user_id AND m.question_id = p.question_id AND m.unresolved = 1
    WHERE p.user_id = ? AND p.due_at <= datetime('now') AND m.id IS NULL
  `).get(userId) as { count: number }).count;
  const activeMistakes = (db.prepare(`
    SELECT COUNT(*) as count
    FROM mistakes
    WHERE user_id = ? AND unresolved = 1
  `).get(userId) as { count: number }).count;
  const topics = db.prepare(`
    SELECT
      q.topic,
      COUNT(q.id) as total,
      COUNT(p.question_id) as answered,
      SUM(CASE WHEN p.box >= 2 THEN 1 ELSE 0 END) as mastered
    FROM questions q
    LEFT JOIN question_progress p ON p.question_id = q.id AND p.user_id = ?
    GROUP BY q.topic
    HAVING answered > 0
    ORDER BY MIN(q.difficulty) ASC, q.topic ASC
  `).all(userId) as Array<{ topic: string; total: number; answered: number; mastered: number }>;
  const weakTopics = getWeakTopics(userId);

  return {
    solved,
    correct,
    wrong,
    accuracy: solved === 0 ? 0 : Math.round((correct / solved) * 100),
    todaySolved,
    dailyGoal: DAILY_GOAL,
    streak: getStreak(userId),
    dueToday,
    activeMistakes,
    recommendation: getRecommendation({ todaySolved, dueToday, activeMistakes, weakTopics }),
    topics,
    weakTopics,
    top: topTopics(userId)
  };
}

function getWeakTopics(userId: number): Array<{ topic: string; mistakes: number; wrongAnswers: number }> {
  return db.prepare(`
    SELECT
      q.topic,
      SUM(CASE WHEN m.unresolved = 1 THEN 1 ELSE 0 END) as mistakes,
      SUM(CASE WHEN a.is_correct = 0 THEN 1 ELSE 0 END) as wrongAnswers
    FROM questions q
    LEFT JOIN mistakes m ON m.question_id = q.id AND m.user_id = ?
    LEFT JOIN answers a ON a.question_id = q.id AND a.user_id = ?
    GROUP BY q.topic
    HAVING mistakes > 0 OR wrongAnswers > 0
    ORDER BY mistakes DESC, wrongAnswers DESC, q.topic ASC
    LIMIT 3
  `).all(userId, userId) as Array<{ topic: string; mistakes: number; wrongAnswers: number }>;
}

function getRecommendation(input: {
  todaySolved: number;
  dueToday: number;
  activeMistakes: number;
  weakTopics: Array<{ topic: string; mistakes: number; wrongAnswers: number }>;
}): string {
  if (input.activeMistakes > 0) {
    return "Сначала нажми «Повторить ошибки» и закрой слабые места.";
  }

  if (input.dueToday > 0) {
    return "Сегодня есть повторы. Лучше начать с обычного теста.";
  }

  if (input.todaySolved < DAILY_GOAL) {
    return "Добей дневную цель: осталось несколько вопросов.";
  }

  if (input.weakTopics.length > 0) {
    return "Выбери «Темы» и потренируй самую слабую тему.";
  }

  return "Хороший темп. Можно пройти короткое интервью на 10 вопросов.";
}

function getStreak(userId: number): number {
  const rows = db.prepare(`
    SELECT DISTINCT date(answered_at) as day
    FROM answers
    WHERE user_id = ?
    ORDER BY day DESC
  `).all(userId) as Array<{ day: string }>;

  const days = new Set(rows.map((row) => row.day));
  let cursor = new Date();
  let streak = 0;

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;

    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

export const getStats = getProgress;
