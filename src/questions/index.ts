export type SeedQuestion = {
  topic: string;
  text: string;
  options: string[];
  optionExplanations: string[];
  correctIndex: number;
  explanation: string;
};

export const seedQuestions: SeedQuestion[] = [
  {
    topic: "html_semantics",
    text: "Какой тег лучше всего подходит для основной навигации сайта?",
    options: ["<div>", "<nav>", "<section>", "<header>"],
    optionExplanations: [
      "<div> нейтральный контейнер без смысла.",
      "<nav> явно обозначает блок навигации.",
      "<section> подходит для смыслового раздела, не для навигации.",
      "<header> может содержать навигацию, но сам не описывает меню."
    ],
    correctIndex: 1,
    explanation: "<nav> используется для блоков навигационных ссылок."
  },
  {
    topic: "forms",
    text: "Какой атрибут делает поле формы обязательным?",
    options: ["validate", "required", "must", "need"],
    optionExplanations: [
      "validate не является HTML-атрибутом для обязательности.",
      "required включает встроенную проверку обязательного поля.",
      "must не используется браузером как валидатор.",
      "need не является стандартным HTML-атрибутом."
    ],
    correctIndex: 1,
    explanation: "Атрибут required не дает отправить форму без заполнения поля."
  },
  {
    topic: "attributes",
    text: "Для чего нужен атрибут alt у <img>?",
    options: ["Стилизация", "Запасной текст", "Ленивая загрузка", "Ширина картинки"],
    optionExplanations: [
      "Стили задаются CSS или атрибутом style, но не alt.",
      "alt дает текстовое описание изображения.",
      "Ленивая загрузка задается loading=\"lazy\".",
      "Размер задают width/height или CSS."
    ],
    correctIndex: 1,
    explanation: "alt описывает изображение для доступности и если картинка не загрузилась."
  },
  {
    topic: "block_inline",
    text: "Какой элемент по умолчанию строчный?",
    options: ["<div>", "<p>", "<span>", "<section>"],
    optionExplanations: [
      "<div> по умолчанию блочный.",
      "<p> по умолчанию блочный абзац.",
      "<span> по умолчанию строчный.",
      "<section> по умолчанию блочный смысловой раздел."
    ],
    correctIndex: 2,
    explanation: "<span> по умолчанию inline."
  },
  {
    topic: "selectors",
    text: "Как выбрать все элементы с классом card?",
    options: ["#card", ".card", "card", "*card"],
    optionExplanations: [
      "#card выбирает элемент с id=\"card\".",
      ".card выбирает элементы с class=\"card\".",
      "card выбирает тег <card>, если такой есть.",
      "*card не является корректным селектором класса."
    ],
    correctIndex: 1,
    explanation: "Точка перед именем обозначает CSS-класс."
  },
  {
    topic: "specificity",
    text: "Что имеет более высокую специфичность?",
    options: [".menu a", "header a", "#menu a", "a"],
    optionExplanations: [
      ".menu a содержит класс и тег.",
      "header a содержит только теги.",
      "#menu a содержит id, поэтому сильнее остальных.",
      "a содержит только один тег."
    ],
    correctIndex: 2,
    explanation: "Селектор с id (#menu) приоритетнее класса и тега."
  },
  {
    topic: "box_model",
    text: "Что входит в CSS box model?",
    options: ["content, padding, border, margin", "font, line-height", "display и position", "только width/height"],
    optionExplanations: [
      "Это полный набор частей блочной модели.",
      "Шрифт и line-height влияют на текст, но не описывают box model.",
      "display и position управляют раскладкой и позиционированием.",
      "width/height задают только размер content box."
    ],
    correctIndex: 0,
    explanation: "Блочная модель: content -> padding -> border -> margin."
  },
  {
    topic: "flexbox",
    text: "Как по горизонтали центрировать элементы во flex-контейнере?",
    options: ["align-items: center", "justify-content: center", "text-align: center", "margin: auto"],
    optionExplanations: [
      "align-items центрирует по поперечной оси.",
      "justify-content центрирует по главной оси.",
      "text-align центрирует текст и inline-содержимое, не flex-элементы.",
      "margin: auto может помочь отдельному элементу, но не группе."
    ],
    correctIndex: 1,
    explanation: "По главной оси flex используется justify-content."
  },
  {
    topic: "grid",
    text: "Как включить CSS Grid для контейнера?",
    options: ["display: grid", "grid: true", "layout: grid", "position: grid"],
    optionExplanations: [
      "display: grid включает grid-контекст.",
      "grid: true не является CSS-свойством для включения grid.",
      "layout: grid не существует в CSS.",
      "position управляет позиционированием, не grid."
    ],
    correctIndex: 0,
    explanation: "Grid активируется через display: grid."
  },
  {
    topic: "position",
    text: "Какой position фиксирует элемент относительно окна браузера?",
    options: ["absolute", "relative", "sticky", "fixed"],
    optionExplanations: [
      "absolute позиционируется относительно ближайшего positioned-предка.",
      "relative смещает элемент относительно его обычного места.",
      "sticky ведет себя как relative, пока не достигнет порога.",
      "fixed фиксирует элемент относительно viewport."
    ],
    correctIndex: 3,
    explanation: "fixed привязывает элемент к viewport."
  },
  {
    topic: "responsive",
    text: "Что чаще используют для адаптивной ширины блоков?",
    options: ["px", "%", "pt", "cm"],
    optionExplanations: [
      "px фиксирует размер и хуже адаптируется.",
      "% зависит от размера родителя.",
      "pt больше относится к печати.",
      "cm редко используют для экранной верстки."
    ],
    correctIndex: 1,
    explanation: "Проценты помогают блоку подстраиваться под родителя."
  },
  {
    topic: "media_queries",
    text: "Какой синтаксис media query корректный?",
    options: ["@media width < 768", "@media (max-width: 768px)", "@query (768)", "@media-device"],
    optionExplanations: [
      "Такой синтаксис не является базовым CSS media query.",
      "@media (max-width: 768px) корректно задает условие ширины.",
      "@query не является правилом CSS для media queries.",
      "@media-device не является стандартным at-rule."
    ],
    correctIndex: 1,
    explanation: "Стандартный синтаксис: @media (max-width: 768px)."
  },
  {
    topic: "pseudo",
    text: "Какой селектор применится при наведении курсора?",
    options: [":hover", "::after", ":focus-visible-only", "::hover"],
    optionExplanations: [
      ":hover срабатывает при наведении.",
      "::after создает псевдоэлемент после содержимого.",
      ":focus-visible-only не является стандартным селектором.",
      "::hover неверен: hover - псевдокласс, а не псевдоэлемент."
    ],
    correctIndex: 0,
    explanation: ":hover - псевдокласс состояния наведения."
  },
  {
    topic: "cascade",
    text: "Что произойдет, если два одинаковых селектора задают один стиль?",
    options: ["Всегда побеждает первый", "Стили смешиваются случайно", "Побеждает более позднее правило", "Стили игнорируются"],
    optionExplanations: [
      "Первый проиграет, если специфичность равна и второе правило ниже.",
      "CSS применяет строгие правила каскада, не случайность.",
      "При равной специфичности побеждает правило ниже в коде.",
      "Правила не игнорируются, браузер выбирает победителя каскада."
    ],
    correctIndex: 2,
    explanation: "При равной специфичности работает правило, объявленное позже."
  },
  {
    topic: "units",
    text: "Какая единица зависит от размера шрифта родителя?",
    options: ["rem", "px", "em", "vh"],
    optionExplanations: [
      "rem зависит от font-size корневого элемента.",
      "px является абсолютной экранной единицей.",
      "em зависит от размера шрифта контекста.",
      "vh зависит от высоты viewport."
    ],
    correctIndex: 2,
    explanation: "em зависит от font-size текущего или родительского контекста."
  },
  {
    topic: "js_variables",
    text: "Чем let отличается от const?",
    options: ["let нельзя менять", "const нельзя переназначить", "const всегда делает объект неизменяемым", "Разницы нет"],
    optionExplanations: [
      "let как раз можно переназначать.",
      "const запрещает переназначение переменной.",
      "const не замораживает объект, его поля можно менять.",
      "Разница есть: let изменяемая привязка, const нет."
    ],
    correctIndex: 1,
    explanation: "const защищает от повторного присваивания, но не делает значение глубоко неизменяемым."
  },
  {
    topic: "js_types",
    text: "Что вернет typeof null?",
    options: ["null", "object", "undefined", "boolean"],
    optionExplanations: [
      "typeof null не возвращает строку \"null\".",
      "Это историческая особенность JavaScript.",
      "undefined будет только для undefined.",
      "boolean возвращается для true/false."
    ],
    correctIndex: 1,
    explanation: "typeof null возвращает \"object\" из-за старой особенности языка."
  },
  {
    topic: "js_functions",
    text: "Что такое callback?",
    options: ["Функция, переданная как аргумент", "Объект браузера", "Тип массива", "CSS-селектор"],
    optionExplanations: [
      "Callback передают другой функции для вызова позже.",
      "Объект браузера не называют callback.",
      "Массив не является callback.",
      "CSS-селектор не связан с callback."
    ],
    correctIndex: 0,
    explanation: "Callback - это функция, которую вызывают внутри другой функции."
  },
  {
    topic: "js_arrays",
    text: "Какой метод создает новый массив без изменения исходного?",
    options: ["push", "pop", "map", "sort"],
    optionExplanations: [
      "push меняет исходный массив.",
      "pop удаляет элемент из исходного массива.",
      "map возвращает новый массив.",
      "sort сортирует исходный массив."
    ],
    correctIndex: 2,
    explanation: "map проходит по массиву и возвращает новый массив результатов."
  },
  {
    topic: "js_objects",
    text: "Как получить значение поля name из объекта user?",
    options: ["user.name", "user->name", "user::name", "user#name"],
    optionExplanations: [
      "Точечная нотация user.name корректна.",
      "user->name не используется в JavaScript.",
      "user::name не является обычным доступом к свойству.",
      "user#name не используется для свойств объекта."
    ],
    correctIndex: 0,
    explanation: "К свойствам объекта обычно обращаются через точку: user.name."
  },
  {
    topic: "js_dom",
    text: "Как выбрать элемент по id=\"app\"?",
    options: ["document.querySelector('#app')", "document.getClass('app')", "window.select('#app')", "document.id('app')"],
    optionExplanations: [
      "querySelector принимает CSS-селектор, #app выбирает id.",
      "getClass не является стандартным DOM-методом.",
      "window.select не выбирает DOM-элементы.",
      "document.id не является стандартным DOM-методом."
    ],
    correctIndex: 0,
    explanation: "document.querySelector('#app') вернет первый элемент с id app."
  },
  {
    topic: "js_events",
    text: "Как подписаться на клик по кнопке button?",
    options: ["button.on('click')", "button.addEventListener('click', handler)", "button.click(handler)", "listen(button, click)"],
    optionExplanations: [
      "on('click') характерен для некоторых библиотек, не для DOM API.",
      "addEventListener - стандартный способ подписки.",
      "button.click() программно вызывает клик.",
      "listen(button, click) не является стандартным DOM API."
    ],
    correctIndex: 1,
    explanation: "В DOM события обычно слушают через addEventListener."
  },
  {
    topic: "js_async",
    text: "Что делает await?",
    options: ["Останавливает весь браузер", "Ждет результат Promise внутри async-функции", "Создает новый массив", "Удаляет обработчик события"],
    optionExplanations: [
      "await не блокирует весь браузер.",
      "await ожидает выполнение Promise в async-функции.",
      "Массивы создают литералом [] или конструкторами/методами.",
      "Обработчики удаляют через removeEventListener."
    ],
    correctIndex: 1,
    explanation: "await позволяет писать асинхронный код похожим на синхронный образом."
  }
];
