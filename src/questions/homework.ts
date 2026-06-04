export type HomeworkTask = {
  id: string;
  topic: string;
  title: string;
  description: string;
  checklist: string[];
};

export const homeworkTasks: HomeworkTask[] = [
  {
    id: "git-basic-flow",
    topic: "Git",
    title: "Мини-ДЗ: базовый Git-flow",
    description: "Создай тестовый репозиторий и пройди полный путь от изменения файла до коммита.",
    checklist: ["git init", "создай README.md", "git status", "git add .", "git commit -m \"init project\"", "посмотри историю через git log"]
  },
  {
    id: "html-profile-card",
    topic: "HTML",
    title: "Мини-ДЗ: семантическая карточка",
    description: "Сверстай карточку профиля с семантическими тегами и изображением.",
    checklist: ["используй header/main/section", "добавь img с alt", "добавь список навыков", "добавь ссылку с href", "проверь структуру заголовков"]
  },
  {
    id: "html-form",
    topic: "HTML Forms",
    title: "Мини-ДЗ: форма заявки",
    description: "Сделай небольшую форму записи на курс.",
    checklist: ["input для имени", "input type=\"email\"", "select с вариантом курса", "textarea для комментария", "required и label для каждого поля"]
  },
  {
    id: "css-layout",
    topic: "CSS",
    title: "Мини-ДЗ: адаптивный блок преимуществ",
    description: "Сверстай 3 карточки преимуществ, которые перестраиваются на мобильном экране.",
    checklist: ["desktop: 3 колонки", "mobile: 1 колонка", "используй flex или grid", "добавь gap", "добавь media query"]
  },
  {
    id: "css-states",
    topic: "CSS",
    title: "Мини-ДЗ: состояния кнопки",
    description: "Сделай кнопку с понятными состояниями наведения и фокуса.",
    checklist: [":hover", ":active", ":focus-visible", "transition", "контрастный цвет текста"]
  },
  {
    id: "js-todo-array",
    topic: "JavaScript",
    title: "Мини-ДЗ: массив задач",
    description: "Напиши функции для работы со списком задач в массиве.",
    checklist: ["addTask(title)", "removeTask(id)", "toggleTask(id)", "filter completed", "выведи результат через console.table"]
  },
  {
    id: "js-dom-form",
    topic: "JavaScript DOM",
    title: "Мини-ДЗ: форма + DOM",
    description: "Сделай форму, которая добавляет карточку на страницу без перезагрузки.",
    checklist: ["addEventListener submit", "preventDefault", "querySelector", "создание элемента", "очистка формы после добавления"]
  },
  {
    id: "js-storage",
    topic: "JavaScript Storage",
    title: "Мини-ДЗ: сохранение темы",
    description: "Сделай переключатель светлой/темной темы и сохрани выбор.",
    checklist: ["кнопка переключения", "classList.toggle", "localStorage.setItem", "localStorage.getItem при загрузке", "тема не сбрасывается после refresh"]
  },
  {
    id: "react-counter",
    topic: "React",
    title: "Мини-ДЗ: React-счетчик",
    description: "Собери компонент счетчика на useState.",
    checklist: ["кнопка плюс", "кнопка минус", "кнопка сброс", "disabled при значении 0", "вынеси Button в отдельный компонент"]
  },
  {
    id: "react-list",
    topic: "React",
    title: "Мини-ДЗ: список карточек",
    description: "Отрендери массив данных в React через map.",
    checklist: ["массив объектов", "компонент Card", "key из id", "условный рендер пустого списка", "минимальная стилизация"]
  },
  {
    id: "redux-mini",
    topic: "Redux Toolkit",
    title: "Мини-ДЗ: slice для фильтра",
    description: "Создай маленький slice, который хранит выбранный фильтр списка.",
    checklist: ["configureStore", "createSlice", "initialState", "action setFilter", "useSelector и useDispatch"]
  },
  {
    id: "ts-types",
    topic: "TypeScript",
    title: "Мини-ДЗ: типизация задач",
    description: "Опиши типы для массива задач и функций работы с ним.",
    checklist: ["type Task", "строгие типы параметров", "тип возвращаемого значения", "Partial<Task> для обновления", "type guard для неизвестного значения"]
  }
];
