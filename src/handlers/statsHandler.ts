import { Context } from "telegraf";
import { getProgress } from "../services/statsService";
import { TOPIC_LABELS } from "../utils/constants";

export async function sendProgress(ctx: Context, userId: number) {
  const progress = getProgress(userId);

  const topics = progress.topics.length
    ? progress.topics
        .map((t) => {
          const status = t.mastered === t.total ? "закреплено" : `${t.answered}/${t.total}`;
          return `${TOPIC_LABELS[t.topic] || t.topic}: ${status}`;
        })
        .join("\n")
    : "Пока нет пройденных тем.";

  const weakTopics = progress.weakTopics.length
    ? progress.weakTopics
        .map((t) => `${TOPIC_LABELS[t.topic] || t.topic}: ошибок ${t.mistakes}, промахов ${t.wrongAnswers}`)
        .join("\n")
    : "Пока слабых тем нет.";

  const vacancyTop = progress.top.length
    ? progress.top.map((t) => `${TOPIC_LABELS[t.topic] || t.topic}: ${t.weight}`).join("\n")
    : "Пока нет данных.";

  await ctx.reply(
    `Прогресс:\n` +
      `Сегодня: ${Math.min(progress.todaySolved, progress.dailyGoal)}/${progress.dailyGoal}\n` +
      `Дней подряд: ${progress.streak}\n` +
      `Решено: ${progress.solved}\n` +
      `Точность: ${progress.accuracy}%\n` +
      `Правильных: ${progress.correct}\n` +
      `Ошибок: ${progress.wrong}\n` +
      `Повторить сегодня: ${progress.dueToday}\n` +
      `Ошибки в работе: ${progress.activeMistakes}\n\n` +
      `Что дальше:\n${progress.recommendation}\n\n` +
      `Слабые темы:\n${weakTopics}\n\n` +
      `Пройденные темы:\n${topics}\n\n` +
      `Приоритеты по вакансиям:\n${vacancyTop}`
  );
}

export const sendStats = sendProgress;
