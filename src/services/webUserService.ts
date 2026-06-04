import crypto from "crypto";
import { db } from "../storage/db";

export function ensureWebUser(clientId?: string | null, accessCode?: string | null): { clientId: string; userId: number; accessCode?: string } {
  const existingClientId = clientId?.trim();
  const normalizedCode = normalizeAccessCode(accessCode);
  const currentUser = existingClientId ? findUserByClientId(existingClientId) : null;

  if (normalizedCode) {
    const userId = ensureUserByAccessCode(normalizedCode, currentUser?.user_id);
    const nextClientId = existingClientId || crypto.randomUUID();

    db.prepare(`
      INSERT INTO web_client_links (client_id, user_id)
      VALUES (?, ?)
      ON CONFLICT(client_id)
      DO UPDATE SET user_id = excluded.user_id
    `).run(nextClientId, userId);

    return { clientId: nextClientId, userId, accessCode: normalizedCode };
  }

  if (existingClientId) {
    const existing = findUserByClientId(existingClientId);

    if (existing) {
      const code = db.prepare("SELECT code FROM account_codes WHERE user_id = ?").get(existing.user_id) as { code: string } | undefined;
      return { clientId: existingClientId, userId: existing.user_id, accessCode: code?.code };
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
    INSERT INTO web_client_links (client_id, user_id)
    VALUES (?, ?)
  `).run(nextClientId, user.id);

  return { clientId: nextClientId, userId: user.id };
}

function findUserByClientId(clientId: string): { user_id: number } | undefined {
  return db.prepare("SELECT user_id FROM web_client_links WHERE client_id = ?").get(clientId) as
    | { user_id: number }
    | undefined;
}

function ensureUserByAccessCode(code: string, fallbackUserId?: number): number {
  const existing = db.prepare("SELECT user_id FROM account_codes WHERE code = ?").get(code) as { user_id: number } | undefined;
  if (existing) return existing.user_id;

  if (fallbackUserId) {
    db.prepare("DELETE FROM account_codes WHERE user_id = ?").run(fallbackUserId);
    db.prepare(`
      INSERT INTO account_codes (code, user_id)
      VALUES (?, ?)
    `).run(code, fallbackUserId);

    return fallbackUserId;
  }

  const telegramId = createSyntheticTelegramId();

  db.prepare(`
    INSERT INTO users (telegram_id, username, first_name)
    VALUES (?, ?, ?)
  `).run(telegramId, `web_${code}`, "Web user");

  const user = db.prepare("SELECT id FROM users WHERE telegram_id = ?").get(telegramId) as { id: number };

  db.prepare(`
    INSERT INTO account_codes (code, user_id)
    VALUES (?, ?)
  `).run(code, user.id);

  return user.id;
}

function normalizeAccessCode(value?: string | null): string | null {
  const code = value?.trim().toLowerCase().replace(/[^a-zа-я0-9_-]/gi, "");
  return code && code.length >= 3 ? code.slice(0, 32) : null;
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
