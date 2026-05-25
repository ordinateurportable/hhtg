import "dotenv/config";
import { Telegraf } from "telegraf";
import { db } from "./storage/db";
import { seedQuestionsIfEmpty, getUserState } from "./services/questionService";
import { upsertUser } from "./services/userService";
import { sendStart } from "./handlers/startHandler";
import { askQuestion, handleAnswer } from "./handlers/quizHandler";
import { promptVacancy, handleVacancyText } from "./handlers/vacancyHandler";
import { sendStats } from "./handlers/statsHandler";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is required");

seedQuestionsIfEmpty();

const bot = new Telegraf(token);

function ensureUser(ctx: any): number {
  return upsertUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
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

bot.hears("Начать тест", async (ctx) => {
  const userId = ensureUser(ctx);
  await askQuestion(ctx, userId, "regular");
});

bot.hears("Повторить ошибки", async (ctx) => {
  const userId = ensureUser(ctx);
  await askQuestion(ctx, userId, "mistakes");
});

bot.hears("Добавить вакансию", async (ctx) => {
  const userId = ensureUser(ctx);
  await promptVacancy(ctx, userId);
});

bot.hears("Статистика", async (ctx) => {
  const userId = ensureUser(ctx);
  await sendStats(ctx, userId);
});

bot.action("next_question", async (ctx) => {
  const userId = ensureUser(ctx);
  const state = getUserState(userId);
  const mode = state?.current_mode === "mistakes" ? "mistakes" : "regular";
  await ctx.answerCbQuery();
  await askQuestion(ctx, userId, mode);
});

bot.action(/answer:(\d+):(\d+)/, async (ctx) => {
  const userId = ensureUser(ctx);
  const match = (ctx.match as RegExpExecArray) || [];
  const questionId = Number(match[1]);
  const selected = Number(match[2]);

  const state = getUserState(userId);
  const mode = state?.current_mode === "mistakes" ? "mistakes" : "regular";

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
