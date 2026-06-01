import crypto from "crypto";
import { db } from "../storage/db";

export function ensureWebUser(clientId?: string | null): { clientId: string; userId: number } {
  const existingClientId = clientId?.trim();

  if (existingClientId) {
    const existing = db.prepare("SELECT user_id FROM web_clients WHERE client_id = ?").get(existingClientId) as
      | { user_id: number }
      | undefined;

    if (existing) {
      return { clientId: existingClientId, userId: existing.user_id };
    }
  }

  const nextClientId = existingClientId || crypto.randomUUID();
  const telegramId = createSyntheticTelegramId();

  db.prepare(`
    INSERT INTO users (telegram_id, username, first_name)
    VALUES (?, ?, ?)
  `).run(telegramId, `web_${nextClientId.slice(0, 8)}`, "Web user");

  const user = db.prepare("SELECT id FROM users WHERE telegram_id = ?").get(telegramId) as { id: number };

  db.prepare(`
    INSERT INTO web_clients (client_id, user_id)
    VALUES (?, ?)
  `).run(nextClientId, user.id);

  return { clientId: nextClientId, userId: user.id };
}

function createSyntheticTelegramId(): number {
  while (true) {
    const value = -Math.floor(1_000_000_000_000 + Math.random() * 8_000_000_000_000);
    const existing = db.prepare("SELECT id FROM users WHERE telegram_id = ?").get(value);

    if (!existing) {
      return value;
    }
  }
}
