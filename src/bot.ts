import "dotenv/config";
import { Telegraf } from "telegraf";
import { db } from "./storage/db";
import { seedQuestionsIfEmpty, getUserState, QuizMode, startInterview } from "./services/questionService";
import { upsertUser } from "./services/userService";
import { sendStart } from "./handlers/startHandler";
import { askQuestion, handleAnswer } from "./handlers/quizHandler";
import { promptVacancy, handleVacancyText } from "./handlers/vacancyHandler";
import { sendProgress, sendStats } from "./handlers/statsHandler";
import { topicsKeyboard } from "./utils/keyboards";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is required");

seedQuestionsIfEmpty();

const bot = new Telegraf(token);

function ensureUser(ctx: any): number {
  return upsertUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
}

function parseQuizMode(value: string | null | undefined): QuizMode {
  if (
    value === "mistakes" ||
    value === "interview" ||
    value === "topic_html" ||
    value === "topic_css" ||
    value === "topic_js"
  ) {
    return value;
  }

  return "regular";
}

bot.start(async (ctx) => {
  ensureUser(ctx);
  await sendStart(ctx);
});

bot.command("vacancy", async (ctx) => {
  const userId = ensureUser(ctx);
  await promptVacancy(ctx, userId);
});

bot.command("mistakes", async (ctx) => {
  const userId = ensureUser(ctx);
  await askQuestion(ctx, userId, "mistakes");
});

bot.command("stats", async (ctx) => {
  const userId = ensureUser(ctx);
  await sendStats(ctx, userId);
});

bot.command("progress", async (ctx) => {
  const userId = ensureUser(ctx);
  await sendProgress(ctx, userId);
});

bot.command("topics", async (ctx) => {
  ensureUser(ctx);
  await ctx.reply("Выбери направление тренировки:", topicsKeyboard);
});

bot.command("interview", async (ctx) => {
  const userId = ensureUser(ctx);
  startInterview(userId);
  await ctx.reply("Режим интервью: 10 вопросов подряд. В конце покажу результат.");
  await askQuestion(ctx, userId, "interview");
});

bot.hears("Начать тест", async (ctx) => {
  const userId = ensureUser(ctx);
  await askQuestion(ctx, userId, "regular");
});

bot.hears("Интервью", async (ctx) => {
  const userId = ensureUser(ctx);
  startInterview(userId);
  await ctx.reply("Режим интервью: 10 вопросов подряд. В конце покажу результат.");
  await askQuestion(ctx, userId, "interview");
});

bot.hears("Темы", async (ctx) => {
  ensureUser(ctx);
  await ctx.reply("Выбери направление тренировки:", topicsKeyboard);
});

bot.hears("Повторить ошибки", async (ctx) => {
  const userId = ensureUser(ctx);
  await askQuestion(ctx, userId, "mistakes");
});

bot.hears("Добавить вакансию", async (ctx) => {
  const userId = ensureUser(ctx);
  await promptVacancy(ctx, userId);
});

bot.hears("Прогресс", async (ctx) => {
  const userId = ensureUser(ctx);
  await sendProgress(ctx, userId);
});

bot.hears("Статистика", async (ctx) => {
  const userId = ensureUser(ctx);
  await sendProgress(ctx, userId);
});

bot.action("next_question", async (ctx) => {
  const userId = ensureUser(ctx);
  const state = getUserState(userId);
  const mode = parseQuizMode(state?.current_mode);
  await ctx.answerCbQuery();
  await askQuestion(ctx, userId, mode);
});

bot.action(/topic_mode:(html|css|js|all)/, async (ctx) => {
  const userId = ensureUser(ctx);
  const selected = ctx.match[1];
  const mode: QuizMode = selected === "html"
    ? "topic_html"
    : selected === "css"
      ? "topic_css"
      : selected === "js"
        ? "topic_js"
        : "regular";

  await ctx.answerCbQuery();
  await askQuestion(ctx, userId, mode);
});

bot.action(/answer:(\d+):(\d+)/, async (ctx) => {
  const userId = ensureUser(ctx);
  const match = (ctx.match as RegExpExecArray) || [];
  const questionId = Number(match[1]);
  const selected = Number(match[2]);

  const state = getUserState(userId);
  const mode = parseQuizMode(state?.current_mode);

  await ctx.answerCbQuery();
  await handleAnswer(ctx, userId, questionId, selected, mode);
});

bot.on("text", async (ctx) => {
  const userId = ensureUser(ctx);
  const state = getUserState(userId);

  if (state?.mode === "await_vacancy") {
    await handleVacancyText(ctx, userId, ctx.message.text);
    return;
  }

  await ctx.reply("Выбери действие через кнопки или команды: /start");
});

bot.catch((err) => {
  console.error("Bot error", err);
});

bot.launch().then(() => {
  console.log("Bot started");
});

process.once("SIGINT", () => {
  db.close();
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  db.close();
  bot.stop("SIGTERM");
});
