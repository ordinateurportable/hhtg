import "dotenv/config";
import fs from "fs";
import http from "http";
import path from "path";
import { URL } from "url";
import { db } from "./storage/db";
import {
  getInterviewStatus,
  getNextQuestion,
  getQuestionById,
  Question,
  QuizMode,
  saveAnswer,
  seedQuestionsIfEmpty,
  startInterview
} from "./services/questionService";
import { getProgress } from "./services/statsService";
import { saveVacancy } from "./services/vacancyService";
import { ensureWebUser } from "./services/webUserService";
import { TOPIC_LABELS, TOPIC_LINKS } from "./utils/constants";

const port = Number(process.env.PORT || process.env.API_PORT || 3000);
const publicDir = path.resolve(process.cwd(), "src", "web");

seedQuestionsIfEmpty();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    serveStatic(res, url.pathname);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`Web trainer started on http://localhost:${port}`);
});

process.once("SIGINT", () => {
  db.close();
  server.close();
});

process.once("SIGTERM", () => {
  db.close();
  server.close();
});

async function handleApi(req: http.IncomingMessage, res: http.ServerResponse, url: URL): Promise<void> {
  if (req.method === "GET" && url.pathname === "/api/session") {
    const session = ensureWebUser(url.searchParams.get("clientId"));
    sendJson(res, 200, session);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/progress") {
    const session = ensureWebUser(url.searchParams.get("clientId"));
    sendJson(res, 200, withLabels(getProgress(session.userId)));
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/question") {
    const session = ensureWebUser(url.searchParams.get("clientId"));
    const mode = parseMode(url.searchParams.get("mode"));
    const question = getNextQuestion(session.userId, mode);

    sendJson(res, 200, {
      question: question ? publicQuestion(question) : null,
      interview: mode === "interview" ? getInterviewStatus(session.userId) : null
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/answer") {
    const body = await readJson(req);
    const session = ensureWebUser(body.clientId);
    const questionId = Number(body.questionId);
    const selectedIndex = Number(body.selectedIndex);
    const mode = parseMode(body.mode);
    const question = getQuestionById(questionId);

    if (!question || Number.isNaN(selectedIndex)) {
      sendJson(res, 400, { error: "Bad answer payload" });
      return;
    }

    const isCorrect = saveAnswer(session.userId, question, selectedIndex, mode);
    const interview = mode === "interview" ? getInterviewStatus(session.userId) : null;

    sendJson(res, 200, {
      isCorrect,
      correctIndex: question.correctIndex,
      correctAnswer: question.options[question.correctIndex],
      explanation: question.explanation,
      optionExplanations: question.optionExplanations,
      material: TOPIC_LINKS[question.topic] || null,
      interview
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/vacancy") {
    const body = await readJson(req);
    const session = ensureWebUser(body.clientId);
    const text = String(body.text || "").trim();

    if (!text) {
      sendJson(res, 400, { error: "Vacancy text is required" });
      return;
    }

    const result = saveVacancy(session.userId, text);
    sendJson(res, 200, withTopicNames(result));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/interview/start") {
    const body = await readJson(req);
    const session = ensureWebUser(body.clientId);
    startInterview(session.userId);
    sendJson(res, 200, { interview: getInterviewStatus(session.userId) });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

function parseMode(value: unknown): QuizMode {
  return value === "mistakes" ||
    value === "interview" ||
    value === "topic_html" ||
    value === "topic_css" ||
    value === "topic_js"
    ? value
    : "regular";
}

function publicQuestion(question: Question) {
  return {
    id: question.id,
    topic: question.topic,
    topicLabel: TOPIC_LABELS[question.topic] || question.topic,
    text: question.text,
    options: question.options,
    difficulty: question.difficulty
  };
}

function withLabels<T extends { topics?: Array<{ topic: string }>; top?: Array<{ topic: string }>; weakTopics?: Array<{ topic: string }> }>(
  data: T
): T {
  for (const list of [data.topics, data.top, data.weakTopics]) {
    list?.forEach((item) => {
      Object.assign(item, { topicLabel: TOPIC_LABELS[item.topic] || item.topic });
    });
  }

  return data;
}

function withTopicNames(data: { keywords: string[]; topics: string[] }) {
  return {
    ...data,
    topicLabels: data.topics.map((topic) => TOPIC_LABELS[topic] || topic)
  };
}

async function readJson(req: http.IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res: http.ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function serveStatic(res: http.ServerResponse, pathname: string): void {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(publicDir, `.${safePath}`);

  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  const ext = path.extname(filePath);
  const types: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
  };

  res.writeHead(200, {
    "Content-Type": types[ext] || "application/octet-stream"
  });
  fs.createReadStream(filePath).pipe(res);
}
