import { Context, Markup } from "telegraf";
import { TOPIC_LABELS, TOPIC_LINKS } from "../utils/constants";
import { nextQuestionKeyboard } from "../utils/keyboards";
import { getMistakesCount, getNextQuestion, getQuestionById, saveAnswer, setUserState } from "../services/questionService";

export async function askQuestion(ctx: Context, userId: number, mode: "regular" | "mistakes") {
  const question = getNextQuestion(userId, mode);

  if (!question) {
    if (mode === "mistakes") {
      await ctx.reply("Ошибок для повторения нет. Можно начать обычный тест.");
    } else {
      await ctx.reply("Вопросы пока не найдены.");
    }
    return;
  }

  setUserState(userId, "await_answer", question.id, mode);

  const keyboard = Markup.inlineKeyboard(
    question.options.map((opt, i) => [Markup.button.callback(opt, `answer:${question.id}:${i}`)])
  );

  const topic = TOPIC_LABELS[question.topic] || question.topic;
  await ctx.reply(`Тема: ${topic}\n\n${question.text}`, keyboard);
}

export async function handleAnswer(ctx: Context, userId: number, questionId: number, selectedIndex: number, mode: "regular" | "mistakes") {
  const question = getQuestionById(questionId);
  if (!question) {
    await ctx.reply("Вопрос не найден. Нажми «Начать тест».");
    return;
  }

  const isCorrect = saveAnswer(userId, question, selectedIndex);
  setUserState(userId, "idle", null, mode);

  const status = isCorrect ? "Правильно" : "Неправильно";
  const correctText = `Верный ответ: ${question.options[question.correctIndex]}`;
  const optionReview = question.optionExplanations
    .map((explanation, index) => `${question.options[index]} - ${explanation}`)
    .join("\n");
  const topicLink = TOPIC_LINKS[question.topic];

  if (!isCorrect) {
    const material = topicLink ? `\nМатериал: ${topicLink}` : "";
    await ctx.reply(
      `${status}.\n${correctText}\n${question.explanation}\n\nРазбор вариантов:\n${optionReview}${material}`,
      nextQuestionKeyboard
    );
  } else {
    await ctx.reply(`${status}.\n${correctText}\n${question.explanation}`, nextQuestionKeyboard);
  }

  if (mode === "mistakes") {
    const left = getMistakesCount(userId);
    await ctx.reply(`Осталось ошибок: ${left}`);
  }
}
