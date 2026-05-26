import { Markup } from "telegraf";

export const mainKeyboard = Markup.keyboard([
  ["Начать тест", "Интервью"],
  ["Повторить ошибки", "Прогресс"],
  ["Темы", "Добавить вакансию"]
]).resize();

export const nextQuestionKeyboard = Markup.inlineKeyboard([
  Markup.button.callback("Следующий вопрос", "next_question")
]);

export const topicsKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback("HTML", "topic_mode:html"), Markup.button.callback("CSS", "topic_mode:css")],
  [Markup.button.callback("JavaScript", "topic_mode:js")],
  [Markup.button.callback("Все темы", "topic_mode:all")]
]);
