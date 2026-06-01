import { Context } from "telegraf";
import { setUserState } from "../services/questionService";
import { saveVacancy } from "../services/vacancyService";
import { TOPIC_LABELS } from "../utils/constants";

export async function promptVacancy(ctx: Context, userId: number) {
  setUserState(userId, "await_vacancy", null, null);
  await ctx.reply("Пришли требования вакансии или краткое саммари урока одним сообщением.");
}

export async function handleVacancyText(ctx: Context, userId: number, text: string) {
  const result = saveVacancy(userId, text);
  setUserState(userId, "idle", null, null);

  const topics = result.topics.length
    ? result.topics.map((t) => TOPIC_LABELS[t] || t).join(", ")
    : "Нет совпадений";

  const keywords = result.keywords.length ? result.keywords.join(", ") : "Нет совпадений";

  await ctx.reply(`Текст сохранен.\nКлючевые слова: ${keywords}\nТемы: ${topics}`);
}
