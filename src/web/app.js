const state = {
  clientId: localStorage.getItem("trainerClientId"),
  mode: "regular",
  question: null,
  homeworkIndex: Number(localStorage.getItem("homeworkIndex") || 0)
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
  homework: document.querySelector("#homework"),
  nextHomework: document.querySelector("#nextHomework"),
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
  await loadHomework();
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
  els.nextHomework.addEventListener("click", async () => {
    state.homeworkIndex += 1;
    localStorage.setItem("homeworkIndex", String(state.homeworkIndex));
    await loadHomework();
  });
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
  els.vacancyResult.textContent = `Текст сохранен.\nКлючевые слова: ${data.keywords.join(", ") || "нет"}\nТемы: ${data.topicLabels.join(", ") || "нет"}`;
  els.vacancyText.value = "";
  await loadProgress();
}

async function loadProgress() {
  const progress = await api(`/api/progress?clientId=${state.clientId}`);
  const goalPercent = percent(progress.todaySolved, progress.dailyGoal);
  const topics = progress.topics.length
    ? progress.topics.map(renderTopicProgress).join("")
    : `<div class="empty-state">Пока нет пройденных тем</div>`;
  const weak = progress.weakTopics.length
    ? progress.weakTopics.map(renderWeakTopic).join("")
    : `<div class="empty-state">Слабых тем пока нет</div>`;

  els.progress.innerHTML = `
    <div class="progress-hero">
      <div class="ring" style="--value:${progress.accuracy}">
        <span>${progress.accuracy}%</span>
      </div>
      <div>
        <div class="progress-title">Точность</div>
        <div class="progress-note">${escapeHtml(progress.recommendation)}</div>
      </div>
    </div>

    <div class="metric-grid">
      ${renderMetric("Сегодня", `${Math.min(progress.todaySolved, progress.dailyGoal)}/${progress.dailyGoal}`)}
      ${renderMetric("Дней подряд", progress.streak)}
      ${renderMetric("Повторы", progress.dueToday)}
      ${renderMetric("Ошибки", progress.activeMistakes)}
    </div>

    <div class="progress-block">
      <div class="progress-row">
        <span>Дневная цель</span>
        <strong>${goalPercent}%</strong>
      </div>
      <div class="bar"><span style="width:${goalPercent}%"></span></div>
    </div>

    <div class="progress-block">
      <div class="progress-heading">Слабые темы</div>
      <div class="topic-list">${weak}</div>
    </div>

    <div class="progress-block">
      <div class="progress-heading">Пройденные темы</div>
      <div class="topic-list">${topics}</div>
    </div>
  `;
}

async function loadHomework() {
  const data = await api(`/api/homework?index=${state.homeworkIndex}`);
  const task = data.task;

  els.homework.className = "homework";
  els.homework.innerHTML = `
    <div class="homework-topic">${escapeHtml(task.topic)} · ${data.index + 1}/${data.total}</div>
    <h3>${escapeHtml(task.title)}</h3>
    <p>${escapeHtml(task.description)}</p>
    <ul>
      ${task.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderMetric(label, value) {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderTopicProgress(topic) {
  const value = percent(topic.answered, topic.total);
  return `
    <div class="topic-progress">
      <div class="progress-row">
        <span>${escapeHtml(topic.topicLabel)}</span>
        <strong>${topic.answered}/${topic.total}</strong>
      </div>
      <div class="bar"><span style="width:${value}%"></span></div>
    </div>
  `;
}

function renderWeakTopic(topic) {
  return `
    <div class="weak-topic">
      <span>${escapeHtml(topic.topicLabel)}</span>
      <strong>${topic.wrongAnswers}</strong>
    </div>
  `;
}

function percent(value, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((value / total) * 100));
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
