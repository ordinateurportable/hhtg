import { Markup } from "telegraf";

export const mainKeyboard = Markup.keyboard([
  ["Начать тест", "Повторить ошибки"],
  ["Добавить вакансию", "Статистика"]
]).resize();

export const nextQuestionKeyboard = Markup.inlineKeyboard([
  Markup.button.callback("Следующий вопрос", "next_question")
]);
