import type { SeedQuestion } from ".";

export const courseQuestions: SeedQuestion[] = [
  {
    topic: "git",
    text: "Какая команда показывает текущее состояние репозитория?",
    options: ["git status", "git log", "git init", "git push"],
    optionExplanations: ["Показывает измененные, staged и untracked файлы.", "Показывает историю коммитов.", "Создает новый репозиторий.", "Отправляет коммиты на удаленный сервер."],
    correctIndex: 0,
    explanation: "git status — первая команда для проверки, что сейчас происходит в репозитории."
  },
  {
    topic: "git",
    text: "Для чего нужен файл .gitignore?",
    options: ["Чтобы не отслеживать лишние файлы", "Чтобы удалить Git", "Чтобы создать ветку", "Чтобы скачать репозиторий"],
    optionExplanations: ["В .gitignore добавляют node_modules, .env, сборки и локальные файлы.", "Git так не удаляется.", "Ветки создаются через git branch или git switch -c.", "Репозиторий скачивают через git clone."],
    correctIndex: 0,
    explanation: ".gitignore защищает репозиторий от мусора и секретов."
  },
  {
    topic: "git",
    text: "Чем git pull отличается от git fetch?",
    options: ["pull скачивает и сливает, fetch только скачивает", "fetch удаляет ветку", "pull только показывает историю", "Разницы нет"],
    optionExplanations: ["pull = fetch + merge/rebase.", "fetch не удаляет ветки.", "Историю показывает git log.", "Разница есть."],
    correctIndex: 0,
    explanation: "git fetch безопаснее для проверки обновлений, git pull сразу применяет их к рабочей ветке."
  },
  {
    topic: "html_meta",
    text: "Где обычно размещают тег <title>?",
    options: ["В <head>", "В <body>", "В <footer>", "В <main>"],
    optionExplanations: ["<title> — метаинформация документа.", "В body размещают видимое содержимое.", "footer — нижняя часть страницы.", "main — основное содержимое."],
    correctIndex: 0,
    explanation: "<title> находится в <head> и отображается во вкладке браузера."
  },
  {
    topic: "html_tables",
    text: "Какой тег обозначает заголовочную ячейку таблицы?",
    options: ["<td>", "<th>", "<tr>", "<thead>"],
    optionExplanations: ["<td> — обычная ячейка.", "<th> — заголовочная ячейка.", "<tr> — строка таблицы.", "<thead> группирует шапку таблицы."],
    correctIndex: 1,
    explanation: "<th> помогает браузеру и скринридерам понять структуру таблицы."
  },
  {
    topic: "accessibility",
    text: "Что помогает сделать страницу доступнее?",
    options: ["Семантические теги и alt", "Только div и span", "Мелкий серый текст", "Удаление label у input"],
    optionExplanations: ["Семантика и текстовые описания помогают пользователям и assistive tech.", "div/span не дают смысла сами по себе.", "Низкий контраст ухудшает доступность.", "label важен для форм."],
    correctIndex: 0,
    explanation: "Доступность начинается с правильной структуры, подписей и понятных описаний."
  },
  {
    topic: "css_text",
    text: "Какое свойство задает межстрочный интервал?",
    options: ["line-height", "letter-spacing", "font-weight", "text-transform"],
    optionExplanations: ["line-height управляет высотой строки.", "letter-spacing меняет расстояние между буквами.", "font-weight задает насыщенность.", "text-transform меняет регистр."],
    correctIndex: 0,
    explanation: "line-height влияет на читаемость текста."
  },
  {
    topic: "css_colors",
    text: "Какой формат позволяет задавать цвет с прозрачностью?",
    options: ["rgba()", "hex без альфы", "font-color", "colorize()"],
    optionExplanations: ["rgba() содержит alpha-канал.", "Обычный #RRGGBB не содержит прозрачность.", "font-color не является CSS-свойством.", "colorize() нет в CSS."],
    correctIndex: 0,
    explanation: "Прозрачность можно задать через rgba() или современные rgb(... / alpha)."
  },
  {
    topic: "css_transitions",
    text: "Для чего нужно свойство transition?",
    options: ["Для плавного изменения свойства", "Для создания HTML", "Для загрузки шрифта", "Для отправки формы"],
    optionExplanations: ["transition анимирует изменение между состояниями.", "HTML не создается CSS-свойством.", "Шрифт подключают через @font-face/link.", "Формы отправляет HTML/JS."],
    correctIndex: 0,
    explanation: "transition часто используют для hover/focus-состояний."
  },
  {
    topic: "css_backgrounds",
    text: "Какое свойство управляет размером фонового изображения?",
    options: ["background-size", "background-repeat", "object-fit", "image-size"],
    optionExplanations: ["background-size задает cover, contain или размер.", "repeat управляет повторением.", "object-fit работает с img/video.", "image-size не является CSS-свойством."],
    correctIndex: 0,
    explanation: "background-size: cover часто используют для адаптивных фонов."
  },
  {
    topic: "css_fonts",
    text: "Как подключить локальный веб-шрифт в CSS?",
    options: ["@font-face", "@media", "@keyframes", "@import-script"],
    optionExplanations: ["@font-face описывает имя и файлы шрифта.", "@media — адаптивные условия.", "@keyframes — анимации.", "@import-script не существует."],
    correctIndex: 0,
    explanation: "@font-face позволяет использовать свой файл шрифта в проекте."
  },
  {
    topic: "css_optimization",
    text: "Что ближе всего к принципу DRY в CSS?",
    options: ["Переиспользовать классы", "Дублировать все стили", "Писать только inline-style", "Удалить каскад"],
    optionExplanations: ["Повторяемую логику выносят в классы/утилиты.", "Дублирование усложняет поддержку.", "Inline-style плохо переиспользуется.", "Каскад — часть CSS."],
    correctIndex: 0,
    explanation: "DRY снижает повторение и делает стили проще для поддержки."
  },
  {
    topic: "js_storage",
    text: "Где localStorage хранит данные?",
    options: ["В браузере пользователя", "В CSS-файле", "В Git-коммите", "Только в оперативной памяти до перезагрузки"],
    optionExplanations: ["localStorage сохраняет данные в браузере между сессиями.", "CSS не хранит данные приложения.", "Git не связан с браузерным storage.", "Это больше похоже на переменную или sessionStorage."],
    correctIndex: 0,
    explanation: "localStorage удобен для простых пользовательских настроек и черновиков."
  },
  {
    topic: "js_modules",
    text: "Какая пара ключевых слов относится к ES-модулям?",
    options: ["import/export", "get/set CSS", "push/pop", "try/catch"],
    optionExplanations: ["import/export подключают и отдают код между модулями.", "Это не модульная система.", "Это методы массива.", "Это обработка ошибок."],
    correctIndex: 0,
    explanation: "ES-модули помогают делить код на файлы с явными зависимостями."
  },
  {
    topic: "js_debugging",
    text: "Что делает debugger в JavaScript?",
    options: ["Ставит точку остановки", "Удаляет ошибку", "Запускает сервер", "Форматирует CSS"],
    optionExplanations: ["Если DevTools открыт, выполнение остановится на этой строке.", "Ошибку нужно исправлять вручную.", "Сервер debugger не запускает.", "CSS не форматируется."],
    correctIndex: 0,
    explanation: "debugger помогает пошагово посмотреть значения переменных."
  },
  {
    topic: "react_components",
    text: "Что обычно возвращает React-компонент?",
    options: ["JSX", "SQL-запрос", "CSS-файл", "Git-ветку"],
    optionExplanations: ["Компонент описывает UI через JSX.", "SQL не относится к React-компоненту.", "CSS можно подключить отдельно.", "Git-ветки не возвращаются из функций."],
    correctIndex: 0,
    explanation: "React-компонент — функция или класс, который описывает часть интерфейса."
  },
  {
    topic: "react_state",
    text: "Какой хук используют для локального состояния в функциональном компоненте?",
    options: ["useState", "useFetchOnly", "useClass", "useHTML"],
    optionExplanations: ["useState хранит локальное состояние.", "Такого стандартного хука нет.", "Классы не подключают через хук.", "HTML не управляется таким хуком."],
    correctIndex: 0,
    explanation: "useState возвращает текущее значение и функцию обновления."
  },
  {
    topic: "react_effects",
    text: "Для чего чаще используют useEffect?",
    options: ["Для побочных эффектов", "Для объявления типа", "Для CSS-селектора", "Для создания git commit"],
    optionExplanations: ["Запросы, подписки и синхронизация — типичные эффекты.", "Типы — задача TypeScript.", "CSS-селекторы пишут в CSS.", "Git commit создается в терминале."],
    correctIndex: 0,
    explanation: "useEffect запускает код после рендера при изменении зависимостей."
  },
  {
    topic: "react_props",
    text: "Что такое props в React?",
    options: ["Данные, переданные компоненту", "Глобальный CSS", "Команда терминала", "Тип базы данных"],
    optionExplanations: ["props передают данные сверху вниз.", "CSS не является props.", "Это не команда.", "База данных не связана с props."],
    correctIndex: 0,
    explanation: "Props помогают переиспользовать компоненты с разными данными."
  },
  {
    topic: "react_lists",
    text: "Зачем нужен key при рендеринге списка в React?",
    options: ["Чтобы React стабильнее сопоставлял элементы", "Чтобы скрыть элемент", "Чтобы создать CSS grid", "Чтобы отправить fetch"],
    optionExplanations: ["key помогает React понять, какой элемент изменился.", "Скрытие делается условием/CSS.", "Grid — CSS.", "fetch не связан с key."],
    correctIndex: 0,
    explanation: "Для key лучше использовать стабильный id, а не индекс, если порядок может меняться."
  },
  {
    topic: "react_forms",
    text: "Что такое controlled input?",
    options: ["input, значение которого хранится в state", "input без value", "input только для чтения", "input без обработчика"],
    optionExplanations: ["React-state управляет value.", "Это ближе к uncontrolled.", "readonly не означает controlled.", "Обычно нужен onChange."],
    correctIndex: 0,
    explanation: "Controlled-подход удобен для валидации и синхронизации формы."
  },
  {
    topic: "redux_store",
    text: "Что создает configureStore в Redux Toolkit?",
    options: ["Redux store", "React-компонент", "HTML-страницу", "CSS-переменную"],
    optionExplanations: ["configureStore настраивает хранилище Redux.", "Компоненты создает React-код.", "HTML не создается.", "CSS-переменные не связаны с Redux."],
    correctIndex: 0,
    explanation: "Redux store хранит глобальное состояние приложения."
  },
  {
    topic: "redux_slice",
    text: "Для чего нужен createSlice?",
    options: ["Для reducer и actions одного участка состояния", "Для загрузки шрифтов", "Для создания route", "Для компиляции TypeScript"],
    optionExplanations: ["slice объединяет имя, initialState, reducers и actions.", "Шрифты не связаны с Redux.", "Роутинг делает React Router.", "TypeScript компилирует tsc."],
    correctIndex: 0,
    explanation: "createSlice уменьшает шаблонный код Redux."
  },
  {
    topic: "redux_async",
    text: "Что обычно описывает createAsyncThunk?",
    options: ["Асинхронное действие", "CSS-анимацию", "HTML-форму", "Git merge"],
    optionExplanations: ["Например, API-запрос с состояниями pending/fulfilled/rejected.", "CSS-анимации создаются @keyframes.", "Форма описывается HTML/React.", "Git merge не связан с Redux."],
    correctIndex: 0,
    explanation: "createAsyncThunk помогает стандартизировать асинхронные запросы."
  },
  {
    topic: "typescript_types",
    text: "Какой тип лучше использовать, когда значение неизвестно и его нужно проверить?",
    options: ["unknown", "any", "never", "void"],
    optionExplanations: ["unknown заставляет сузить тип перед использованием.", "any отключает проверки.", "never означает невозможное значение.", "void обычно для отсутствия return."],
    correctIndex: 0,
    explanation: "unknown безопаснее any, потому что TypeScript требует проверку."
  },
  {
    topic: "typescript_interfaces",
    text: "Для чего используют interface в TypeScript?",
    options: ["Для описания формы объекта", "Для CSS-анимации", "Для DOM-события", "Для git push"],
    optionExplanations: ["interface задает ожидаемые поля и методы.", "Анимации не описывают interface.", "DOM-события можно типизировать, но interface — не событие.", "Git не связан с TypeScript."],
    correctIndex: 0,
    explanation: "interface помогает документировать структуру данных и ловить ошибки компиляцией."
  },
  {
    topic: "typescript_generics",
    text: "Зачем нужны generics?",
    options: ["Для переиспользуемых типобезопасных функций", "Для подключения CSS", "Для остановки цикла", "Для создания DOM"],
    optionExplanations: ["Generics позволяют сохранить связь типов входа и выхода.", "CSS не подключается generics.", "Циклы останавливают break/return.", "DOM создают браузерные API/React."],
    correctIndex: 0,
    explanation: "Generics делают код гибким без потери типобезопасности."
  },
  {
    topic: "typescript_utility_types",
    text: "Что делает Partial<T>?",
    options: ["Делает все свойства необязательными", "Удаляет тип T", "Делает все поля readonly", "Создает массив"],
    optionExplanations: ["Partial превращает поля T в optional.", "Тип не удаляется.", "Readonly<T> делает поля readonly.", "Массив описывается T[] или Array<T>."],
    correctIndex: 0,
    explanation: "Partial полезен для объектов обновления и черновиков."
  },
  {
    topic: "typescript_type_guards",
    text: "Что является примером type guard?",
    options: ["typeof value === 'string'", "display: flex", "git status", "<header>"],
    optionExplanations: ["typeof сужает тип в условии.", "Это CSS.", "Это команда Git.", "Это HTML-тег."],
    correctIndex: 0,
    explanation: "Type guards помогают безопасно работать с union-типами."
  }
];
