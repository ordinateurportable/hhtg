import { Context } from "telegraf";
import { getStats } from "../services/statsService";
import { TOPIC_LABELS } from "../utils/constants";

export async function sendStats(ctx: Context, userId: number) {
  const stats = getStats(userId);

  const top = stats.top.length
    ? stats.top.map((t) => `${TOPIC_LABELS[t.topic] || t.topic}: ${t.weight}`).join("\n")
    : "Пока нет данных";

  await ctx.reply(
    `Статистика:\n` +
      `Решено: ${stats.solved}\n` +
      `Правильных: ${stats.correct}\n` +
      `Ошибок: ${stats.wrong}\n\n` +
      `Топ тем по вакансиям:\n${top}`
  );
}
