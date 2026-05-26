import { Context, Markup } from "telegraf";
import { TOPIC_LABELS, TOPIC_LINKS } from "../utils/constants";
import { nextQuestionKeyboard } from "../utils/keyboards";
import {
  getInterviewStatus,
  getMistakesCount,
  getNextQuestion,
  getQuestionById,
  QuizMode,
  saveAnswer,
  setUserState
} from "../services/questionService";

const MODE_LABELS: Partial<Record<QuizMode, string>> = {
  topic_html: "HTML",
  topic_css: "CSS",
  topic_js: "JavaScript"
};

export async function askQuestion(ctx: Context, userId: number, mode: QuizMode) {
  const question = getNextQuestion(userId, mode);

  if (!question) {
    if (mode === "mistakes") {
      await ctx.reply("Ошибок для повторения нет. Можно начать обычный тест.");
    } else if (mode === "interview") {
      const status = getInterviewStatus(userId);
      if (status && !status.isActive) {
        await ctx.reply(`Интервью завершено.\nРезультат: ${status.correct}/${status.total}`);
      } else {
        await ctx.reply("Интервью пока не запущено. Нажми «Интервью».");
      }
    } else if (mode.startsWith("topic_")) {
      await ctx.reply(`В этой теме пока все. Можно выбрать другую тему или вернуться позже.`);
    } else {
      await ctx.reply("На сегодня все. Новые повторы появятся позже, а ошибки можно открыть отдельной кнопкой.");
    }
    return;
  }

  setUserState(userId, "await_answer", question.id, mode);

  const keyboard = Markup.inlineKeyboard(
    question.options.map((opt, i) => [Markup.button.callback(opt, `answer:${question.id}:${i}`)])
  );

  const topic = TOPIC_LABELS[question.topic] || question.topic;
  const interview = mode === "interview" ? getInterviewStatus(userId) : null;
  const interviewPrefix = interview?.isActive ? `Интервью: ${interview.answered + 1}/${interview.total}\n` : "";
  const topicPrefix = MODE_LABELS[mode] ? `Тренировка: ${MODE_LABELS[mode]}\n` : "";

  await ctx.reply(`${interviewPrefix}${topicPrefix}Тема: ${topic}\n\n${question.text}`, keyboard);
}

export async function handleAnswer(
  ctx: Context,
  userId: number,
  questionId: number,
  selectedIndex: number,
  mode: QuizMode
) {
  const question = getQuestionById(questionId);
  if (!question) {
    await ctx.reply("Вопрос не найден. Нажми «Начать тест».");
    return;
  }

  const isCorrect = saveAnswer(userId, question, selectedIndex, mode);
  setUserState(userId, "idle", null, mode);

  const status = isCorrect ? "Правильно" : "Неправильно";
  const correctText = `Верный ответ: ${question.options[question.correctIndex]}`;
  const optionReview = question.optionExplanations
    .map((explanation, index) => `${question.options[index]} - ${explanation}`)
    .join("\n");
  const topicLink = TOPIC_LINKS[question.topic];

  if (!isCorrect) {
    const material = topicLink ? `\nМатериал: ${topicLink}` : "";
    await ctx.reply(`${status}.\n${correctText}\n${question.explanation}\n\nРазбор вариантов:\n${optionReview}${material}`);
  } else {
    await ctx.reply(`${status}.\n${correctText}\n${question.explanation}`);
  }

  if (mode === "mistakes") {
    const left = getMistakesCount(userId);
    await ctx.reply(`Осталось ошибок: ${left}`);
  }

  if (mode === "interview") {
    const interview = getInterviewStatus(userId);
    if (interview && !interview.isActive) {
      await ctx.reply(`Интервью завершено.\nРезультат: ${interview.correct}/${interview.total}`);
      return;
    }
  }

  await ctx.reply("Продолжим?", nextQuestionKeyboard);
}
