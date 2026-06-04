const state = {
  clientId: localStorage.getItem("trainerClientId"),
  accessCode: localStorage.getItem("trainerAccessCode") || "",
  mode: "regular",
  question: null,
  orderSelection: [],
  homeworkIndex: Number(localStorage.getItem("homeworkIndex") || 0)
};

const els = {
  accessCode: document.querySelector("#accessCode"),
  saveAccessCode: document.querySelector("#saveAccessCode"),
  accountStatus: document.querySelector("#accountStatus"),
  progress: document.querySelector("#progress"),
  courseMap: document.querySelector("#courseMap"),
  completedTopics: document.querySelector("#completedTopics"),
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
  els.accessCode.value = state.accessCode;
  await loadSession();
  bindEvents();
  await loadProgress();
  await loadHomework();
  await loadQuestion();
}

async function loadSession() {
  const params = new URLSearchParams();
  if (state.clientId) params.set("clientId", state.clientId);
  if (state.accessCode) params.set("accessCode", state.accessCode);

  const session = await api(`/api/session?${params.toString()}`);
  state.clientId = session.clientId;
  localStorage.setItem("trainerClientId", state.clientId);

  if (session.accessCode) {
    state.accessCode = session.accessCode;
    localStorage.setItem("trainerAccessCode", state.accessCode);
    els.accessCode.value = state.accessCode;
    els.accountStatus.textContent = `Аккаунт: ${state.accessCode}. Прогресс синхронизируется между устройствами.`;
  } else {
    els.accountStatus.textContent = "Сейчас прогресс привязан только к этому браузеру.";
  }
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

  els.saveAccessCode.addEventListener("click", async () => {
    state.accessCode = els.accessCode.value.trim();
    localStorage.setItem("trainerAccessCode", state.accessCode);
    await loadSession();
    await loadProgress();
    await loadQuestion();
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
  state.orderSelection = [];
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

  els.questionMeta.innerHTML = `
    ${escapeHtml(interviewPrefix)}${escapeHtml(data.question.topicLabel)} · сложность ${data.question.difficulty}
    <button class="mark-button ${data.question.marked ? "marked" : ""}" type="button">
      ${data.question.marked ? "Отмечен" : "Отметить"}
    </button>
  `;
  els.questionMeta.querySelector(".mark-button").addEventListener("click", toggleMark);

  els.questionText.textContent = data.question.text;

  if (data.question.theory) {
    const theory = document.createElement("div");
    theory.className = "theory-card";
    theory.textContent = data.question.theory;
    els.options.append(theory);
  }

  if (data.question.type === "text") {
    renderTextQuestion();
    return;
  }

  if (data.question.type === "order") {
    renderOrderQuestion(data.question.options);
    return;
  }

  data.question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => answer({ selectedIndex: index }));
    els.options.append(button);
  });
}

function renderTextQuestion() {
  const wrapper = document.createElement("div");
  wrapper.className = "text-answer";
  wrapper.innerHTML = `
    <input id="textAnswer" type="text" placeholder="Введи короткий ответ" />
    <button id="sendTextAnswer" class="primary" type="button">Проверить</button>
  `;
  els.options.append(wrapper);
  wrapper.querySelector("#sendTextAnswer").addEventListener("click", () => {
    answer({ textAnswer: wrapper.querySelector("#textAnswer").value });
  });
}

function renderOrderQuestion(options) {
  const shuffled = shuffle(options.map((text, index) => ({ text, index })));
  const picked = document.createElement("div");
  picked.className = "picked-order";
  picked.textContent = "Порядок пока пуст";
  els.options.append(picked);

  shuffled.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option.text;
    button.addEventListener("click", () => {
      state.orderSelection.push(option.index);
      button.disabled = true;
      picked.textContent = `Твой порядок: ${state.orderSelection.length}/${options.length}`;
    });
    els.options.append(button);
  });

  const submit = document.createElement("button");
  submit.className = "primary";
  submit.textContent = "Проверить порядок";
  submit.addEventListener("click", () => answer({ selectedOrder: state.orderSelection }));
  els.options.append(submit);
}

async function answer(payload) {
  if (!state.question) return;

  const data = await api("/api/answer", {
    method: "POST",
    body: {
      clientId: state.clientId,
      questionId: state.question.id,
      mode: state.mode,
      ...payload
    }
  });

  document.querySelectorAll(".option").forEach((button, index) => {
    button.disabled = true;
    if (state.question.type === "choice" && index === data.correctIndex) button.classList.add("correct");
    if (state.question.type === "choice" && index === payload.selectedIndex && !data.isCorrect) button.classList.add("wrong");
  });

  const review = state.question.type === "choice"
    ? data.optionExplanations.map((text, index) => `${state.question.options[index]} - ${text}`).join("\n")
    : "Главное — вспомнить принцип, а не угадать кнопку.";
  const material = data.material ? `\n\nМатериал: ${data.material}` : "";
  const interview = data.interview && !data.interview.isActive
    ? `\n\nИнтервью завершено: ${data.interview.correct}/${data.interview.total}`
    : "";

  els.result.className = `result ${data.isCorrect ? "" : "bad"}`;
  els.result.textContent = `${data.isCorrect ? "Правильно" : "Неправильно"}.\nВерный ответ: ${data.correctAnswer}\n${data.explanation}\n\nРазбор:\n${review}${material}${interview}`;

  await loadProgress();
}

async function toggleMark() {
  if (!state.question) return;
  const data = await api("/api/question/mark", {
    method: "POST",
    body: { clientId: state.clientId, questionId: state.question.id }
  });

  state.question.marked = data.marked;
  await loadQuestion();
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
  const weak = progress.weakTopics.length
    ? progress.weakTopics.map(renderWeakTopic).join("")
    : `<div class="empty-state">Слабых тем пока нет</div>`;
  const completed = progress.topics.length
    ? progress.topics.map(renderTopicProgress).join("")
    : `<div class="empty-state">Пока нет пройденных тем</div>`;

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
  `;

  els.courseMap.innerHTML = progress.courseMap.map(renderCourseModule).join("");
  els.completedTopics.innerHTML = completed;
}

function renderCourseModule(module) {
  return `
    <section class="course-module">
      <h3>${escapeHtml(module.title)}</h3>
      <div class="course-items">
        ${module.items.map(renderCourseItem).join("")}
      </div>
    </section>
  `;
}

function renderCourseItem(item) {
  const label = item.status === "done" ? "пройдено" : item.status === "active" ? "в процессе" : "впереди";
  return `
    <article class="course-item ${item.status}">
      <div class="progress-row">
        <span>${escapeHtml(item.title)}</span>
        <strong>${item.percent}%</strong>
      </div>
      <div class="bar"><span style="width:${item.percent}%"></span></div>
      <small>${label} · ${item.answered}/${item.total} вопросов</small>
    </article>
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

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
