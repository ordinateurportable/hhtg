import { db } from "../storage/db";

export function upsertUser(telegramId: number, username: string | undefined, firstName: string | undefined): number {
  db.prepare(`
    INSERT INTO users (telegram_id, username, first_name)
    VALUES (?, ?, ?)
    ON CONFLICT(telegram_id)
    DO UPDATE SET username=excluded.username, first_name=excluded.first_name
  `).run(telegramId, username ?? null, firstName ?? null);

  const user = db.prepare("SELECT id FROM users WHERE telegram_id = ?").get(telegramId) as { id: number };
  return user.id;
}
