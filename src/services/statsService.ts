import { db } from "../storage/db";
import { topTopics } from "./vacancyService";

const DAILY_GOAL = 5;

export function getProgress(userId: number): {
  solved: number;
  correct: number;
  wrong: number;
  todaySolved: number;
  dailyGoal: number;
  streak: number;
  dueToday: number;
  activeMistakes: number;
  topics: Array<{ topic: string; total: number; answered: number; mastered: number }>;
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

  return {
    solved,
    correct,
    wrong,
    todaySolved,
    dailyGoal: DAILY_GOAL,
    streak: getStreak(userId),
    dueToday,
    activeMistakes,
    topics,
    top: topTopics(userId)
  };
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
