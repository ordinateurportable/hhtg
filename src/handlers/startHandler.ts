import { Context } from "telegraf";
import { mainKeyboard } from "../utils/keyboards";

export async function sendStart(ctx: Context) {
  await ctx.reply(
    "Привет. Я помогу готовиться к собеседованию по HTML/CSS/JS.\n" +
      "Идем от простого к сложному, повторяем по расписанию и учитываем вакансии.",
    mainKeyboard
  );
}
