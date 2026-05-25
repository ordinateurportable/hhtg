import { Context } from "telegraf";
import { mainKeyboard } from "../utils/keyboards";

export async function sendStart(ctx: Context) {
  await ctx.reply(
    "Привет. Я помогу готовиться к собеседованию по HTML/CSS.\n" +
      "1 вопрос за раз, разбор ответов, повтор ошибок и адаптация по вакансиям.",
    mainKeyboard
  );
}
