import { db } from "../storage/db";
import { topTopics } from "./vacancyService";

export function getStats(userId: number): {
  solved: number;
  correct: number;
  wrong: number;
  top: Array<{ topic: string; weight: number }>;
} {
  const solved = (db.prepare("SELECT COUNT(*) as count FROM answers WHERE user_id = ?").get(userId) as { count: number }).count;
  const correct = (db.prepare("SELECT COUNT(*) as count FROM answers WHERE user_id = ? AND is_correct = 1").get(userId) as { count: number }).count;
  const wrong = solved - correct;

  return {
    solved,
    correct,
    wrong,
    top: topTopics(userId)
  };
}
