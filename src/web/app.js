const state = {
  clientId: localStorage.getItem("trainerClientId"),
  mode: "regular",
  question: null
};

const els = {
  progress: document.querySelector("#progress"),
  questionMeta: document.querySelector("#questionMeta"),
  questionText: document.querySelector("#questionText"),
  options: document.querySelector("#options"),
  result: document.querySelector("#result"),
  nextQuestion: document.querySelector("#nextQuestion"),
  saveVacancy: document.querySelector("#saveVacancy"),
  vacancyText: document.querySelector("#vacancyText"),
  vacancyResult: document.querySelector("#vacancyResult"),
  startInterview: document.querySelector("#startInterview"),
  refreshProgress: document.querySelector("#refreshProgress")
};

init();

async function init() {
  const session = await api(`/api/session${state.clientId ? `?clientId=${state.clientId}` : ""}`);
  state.clientId = session.clientId;
  localStorage.setItem("trainerClientId", state.clientId);

  bindEvents();
  await loadProgress();
  await loadQuestion();
}

function bindEvents() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", async () => {
      document.querySelectorAll("[data-mode]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.mode = button.dataset.mode;
      clearResult();
      await loadQuestion();
    });
  });

  els.nextQuestion.addEventListener("click", loadQuestion);
  els.refreshProgress.addEventListener("click", loadProgress);

  els.startInterview.addEventListener("click", async () => {
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.remove("active"));
    state.mode = "interview";
    await api("/api/interview/start", { method: "POST", body: { clientId: state.clientId } });
    clearResult();
    await loadQuestion();
  });

  els.saveVacancy.addEventListener("click", saveVacancy);
}

async function loadQuestion() {
  clearResult();
  els.options.innerHTML = "";

  const data = await api(`/api/question?clientId=${state.clientId}&mode=${state.mode}`);

  if (!data.question) {
    els.questionMeta.textContent = state.mode === "interview" && data.interview
      ? `Интервью завершено: ${data.interview.correct}/${data.interview.total}`
      : "На сейчас вопросов нет";
    els.questionText.textContent = "Можно посмотреть прогресс или выбрать другой режим.";
    return;
  }

  state.question = data.question;
  const interviewPrefix = data.interview?.isActive
    ? `Интервью ${data.interview.answered + 1}/${data.interview.total} · `
    : "";

  els.questionMeta.textContent = `${interviewPrefix}${data.question.topicLabel} · сложность ${data.question.difficulty}`;
  els.questionText.textContent = data.question.text;

  data.question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => answer(index));
    els.options.append(button);
  });
}

async function answer(selectedIndex) {
  if (!state.question) return;

  const data = await api("/api/answer", {
    method: "POST",
    body: {
      clientId: state.clientId,
      questionId: state.question.id,
      selectedIndex,
      mode: state.mode
    }
  });

  document.querySelectorAll(".option").forEach((button, index) => {
    button.disabled = true;
    if (index === data.correctIndex) button.classList.add("correct");
    if (index === selectedIndex && !data.isCorrect) button.classList.add("wrong");
  });

  const review = data.optionExplanations
    .map((text, index) => `${state.question.options[index]} - ${text}`)
    .join("\n");
  const material = data.material ? `\n\nМатериал: ${data.material}` : "";
  const interview = data.interview && !data.interview.isActive
    ? `\n\nИнтервью завершено: ${data.interview.correct}/${data.interview.total}`
    : "";

  els.result.className = `result ${data.isCorrect ? "" : "bad"}`;
  els.result.textContent = `${data.isCorrect ? "Правильно" : "Неправильно"}.\nВерный ответ: ${data.correctAnswer}\n${data.explanation}\n\nРазбор вариантов:\n${review}${material}${interview}`;

  await loadProgress();
}

async function saveVacancy() {
  const text = els.vacancyText.value.trim();
  if (!text) return;

  const data = await api("/api/vacancy", {
    method: "POST",
    body: { clientId: state.clientId, text }
  });

  els.vacancyResult.className = "result";
  els.vacancyResult.textContent = `Вакансия сохранена.\nКлючевые слова: ${data.keywords.join(", ") || "нет"}\nТемы: ${data.topicLabels.join(", ") || "нет"}`;
  els.vacancyText.value = "";
  await loadProgress();
}

async function loadProgress() {
  const progress = await api(`/api/progress?clientId=${state.clientId}`);
  const topics = progress.topics.length
    ? progress.topics.map((topic) => `${topic.topicLabel}: ${topic.answered}/${topic.total}`).join("<br>")
    : "Пока нет";
  const weak = progress.weakTopics.length
    ? progress.weakTopics.map((topic) => `${topic.topicLabel}: ${topic.wrongAnswers}`).join("<br>")
    : "Пока нет";

  els.progress.innerHTML = `
    <div><strong>Сегодня:</strong> ${Math.min(progress.todaySolved, progress.dailyGoal)}/${progress.dailyGoal}</div>
    <div><strong>Дней подряд:</strong> ${progress.streak}</div>
    <div><strong>Точность:</strong> ${progress.accuracy}%</div>
    <div><strong>Повторы:</strong> ${progress.dueToday}</div>
    <div><strong>Ошибки:</strong> ${progress.activeMistakes}</div>
    <div><strong>Что дальше:</strong> ${escapeHtml(progress.recommendation)}</div>
    <div><strong>Слабые темы:</strong><br>${weak}</div>
    <div><strong>Пройдено:</strong><br>${topics}</div>
  `;
}

function clearResult() {
  els.result.className = "result hidden";
  els.result.textContent = "";
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
