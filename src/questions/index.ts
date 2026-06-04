import { courseQuestions } from "./courseQuestions";

export type SeedQuestion = {
  topic: string;
  text: string;
  options: string[];
  optionExplanations: string[];
  difficulty?: number;
  sortOrder?: number;
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
      "<section> описывает смысловой раздел.",
      "<header> может содержать меню, но не является меню сам по себе."
    ],
    correctIndex: 1,
    explanation: "<nav> используют для основных навигационных ссылок."
  },
  {
    topic: "forms",
    text: "Какой атрибут делает поле формы обязательным?",
    options: ["validate", "required", "must", "need"],
    optionExplanations: [
      "validate не делает поле обязательным.",
      "required включает встроенную проверку обязательности.",
      "must не является HTML-атрибутом.",
      "need не является HTML-атрибутом."
    ],
    correctIndex: 1,
    explanation: "required не дает отправить форму без заполнения поля."
  },
  {
    topic: "attributes",
    text: "Для чего нужен атрибут alt у <img>?",
    options: ["Для стилей", "Для текстового описания", "Для lazy loading", "Для ширины"],
    optionExplanations: [
      "Стили задаются CSS.",
      "alt описывает изображение текстом.",
      "Lazy loading задается loading=\"lazy\".",
      "Ширина задается width или CSS."
    ],
    correctIndex: 1,
    explanation: "alt важен для доступности и случая, когда картинка не загрузилась."
  },
  {
    topic: "block_inline",
    text: "Какой элемент по умолчанию строчный?",
    options: ["<div>", "<p>", "<span>", "<section>"],
    optionExplanations: [
      "<div> блочный.",
      "<p> блочный.",
      "<span> строчный.",
      "<section> блочный."
    ],
    correctIndex: 2,
    explanation: "<span> по умолчанию inline."
  },
  {
    topic: "selectors",
    text: "Как выбрать все элементы с классом card?",
    options: ["#card", ".card", "card", "*card"],
    optionExplanations: [
      "#card выбирает id.",
      ".card выбирает class.",
      "card выбирает тег <card>.",
      "*card некорректен для класса."
    ],
    correctIndex: 1,
    explanation: "CSS-класс выбирается через точку."
  },
  {
    topic: "specificity",
    text: "Что имеет более высокую специфичность?",
    options: [".menu a", "header a", "#menu a", "a"],
    optionExplanations: [
      "Класс + тег слабее id.",
      "Два тега слабее класса и id.",
      "id дает самый высокий вес среди вариантов.",
      "Один тег самый слабый."
    ],
    correctIndex: 2,
    explanation: "Селектор с id приоритетнее классов и тегов."
  },
  {
    topic: "box_model",
    text: "Что входит в CSS box model?",
    options: ["content, padding, border, margin", "font, line-height", "display и position", "только width/height"],
    optionExplanations: [
      "Это полный набор частей box model.",
      "Это свойства текста.",
      "Это свойства раскладки.",
      "Это только размер content box."
    ],
    correctIndex: 0,
    explanation: "Блочная модель: content, padding, border, margin."
  },
  {
    topic: "flexbox",
    text: "Как по главной оси центрировать элементы во flex-контейнере?",
    options: ["align-items: center", "justify-content: center", "text-align: center", "position: center"],
    optionExplanations: [
      "align-items работает по поперечной оси.",
      "justify-content работает по главной оси.",
      "text-align центрирует текст.",
      "position: center не существует."
    ],
    correctIndex: 1,
    explanation: "Во flex главная ось управляется justify-content."
  },
  {
    topic: "grid",
    text: "Как включить CSS Grid?",
    options: ["display: grid", "grid: true", "layout: grid", "position: grid"],
    optionExplanations: [
      "display: grid включает grid-контекст.",
      "Такого свойства нет.",
      "Такого свойства нет.",
      "position не включает grid."
    ],
    correctIndex: 0,
    explanation: "Grid включается через display: grid."
  },
  {
    topic: "position",
    text: "Какой position фиксирует элемент относительно окна браузера?",
    options: ["absolute", "relative", "sticky", "fixed"],
    optionExplanations: [
      "absolute зависит от positioned-предка.",
      "relative смещает относительно обычного места.",
      "sticky прилипает после порога.",
      "fixed привязан к viewport."
    ],
    correctIndex: 3,
    explanation: "position: fixed фиксирует элемент относительно viewport."
  },
  {
    topic: "responsive",
    text: "Что чаще используют для адаптивной ширины блоков?",
    options: ["px", "%", "pt", "cm"],
    optionExplanations: [
      "px фиксирует размер.",
      "% зависит от родителя.",
      "pt больше для печати.",
      "cm редко используют в вебе."
    ],
    correctIndex: 1,
    explanation: "Проценты помогают блоку подстраиваться под родителя."
  },
  {
    topic: "media_queries",
    text: "Какой синтаксис media query корректный?",
    options: ["@media width < 768", "@media (max-width: 768px)", "@query (768)", "@media-device"],
    optionExplanations: [
      "Некорректный базовый синтаксис.",
      "Корректное условие max-width.",
      "@query не является media query.",
      "@media-device не существует."
    ],
    correctIndex: 1,
    explanation: "Базовая запись: @media (max-width: 768px)."
  },
  {
    topic: "pseudo",
    text: "Какой селектор сработает при наведении?",
    options: [":hover", "::after", ":focus-visible-only", "::hover"],
    optionExplanations: [
      ":hover описывает наведение.",
      "::after создает псевдоэлемент.",
      "Такого стандартного селектора нет.",
      "hover - псевдокласс, не псевдоэлемент."
    ],
    correctIndex: 0,
    explanation: ":hover применяется при наведении курсора."
  },
  {
    topic: "cascade",
    text: "Если два одинаковых селектора задают один стиль, что победит?",
    options: ["Первый", "Случайный", "Более поздний", "Ни один"],
    optionExplanations: [
      "Первый проиграет более позднему.",
      "CSS не выбирает случайно.",
      "При равной специфичности побеждает правило ниже.",
      "Одно из правил будет применено."
    ],
    correctIndex: 2,
    explanation: "При равной специфичности работает более позднее правило."
  },
  {
    topic: "units",
    text: "Какая единица зависит от размера шрифта текущего контекста?",
    options: ["rem", "px", "em", "vh"],
    optionExplanations: [
      "rem зависит от root font-size.",
      "px абсолютная единица.",
      "em зависит от font-size контекста.",
      "vh зависит от высоты viewport."
    ],
    correctIndex: 2,
    explanation: "em считается от font-size текущего элемента или контекста."
  },
  {
    topic: "js_variables",
    text: "Чем let отличается от const?",
    options: ["let нельзя менять", "const нельзя переназначить", "const замораживает объект", "Разницы нет"],
    optionExplanations: ["let можно переназначать.", "const запрещает новое присваивание.", "Поля объекта менять можно.", "Разница есть."],
    correctIndex: 1,
    explanation: "const фиксирует привязку переменной, но не делает объект глубоко неизменяемым."
  },
  {
    topic: "js_types",
    text: "Что вернет typeof null?",
    options: ["null", "object", "undefined", "boolean"],
    optionExplanations: ["typeof null не возвращает строку null.", "Это историческая особенность JS.", "undefined будет для undefined.", "boolean будет для true/false."],
    correctIndex: 1,
    explanation: "typeof null возвращает \"object\"."
  },
  {
    topic: "js_conversion",
    text: "Что получится при Number('')?",
    options: ["0", "NaN", "undefined", "''"],
    optionExplanations: ["Пустая строка при численном преобразовании становится 0.", "NaN будет для строки без числового смысла.", "undefined не результат Number('').", "Number возвращает число."],
    correctIndex: 0,
    explanation: "Number('') возвращает 0."
  },
  {
    topic: "js_operators",
    text: "Что вернет выражение '5' + 2?",
    options: ["7", "'52'", "NaN", "Ошибка"],
    optionExplanations: ["Сложение чисел не произойдет.", "С + и строкой будет конкатенация.", "NaN здесь не возникает.", "Это валидное выражение."],
    correctIndex: 1,
    explanation: "Оператор + со строкой приводит второй операнд к строке."
  },
  {
    topic: "js_comparison",
    text: "Чем === отличается от ==?",
    options: ["Сравнивает без приведения типов", "Всегда быстрее", "Запрещен браузером", "Разницы нет"],
    optionExplanations: ["Строгое равенство не приводит типы.", "Скорость не главное отличие.", "== валиден.", "Разница есть."],
    correctIndex: 0,
    explanation: "=== сравнивает значение и тип без неявного преобразования."
  },
  {
    topic: "js_conditions",
    text: "Какое значение считается falsy?",
    options: ["'0'", "[]", "0", "{}"],
    optionExplanations: ["Непустая строка truthy.", "Массив truthy.", "0 является falsy.", "Объект truthy."],
    correctIndex: 2,
    explanation: "0, '', null, undefined, NaN и false являются falsy."
  },
  {
    topic: "js_logic",
    text: "Что вернет true && 'hello'?",
    options: ["true", "'hello'", "false", "undefined"],
    optionExplanations: ["&& возвращает не обязательно boolean.", "&& возвращает последний truthy-операнд.", "false здесь нет.", "undefined здесь нет."],
    correctIndex: 1,
    explanation: "&& возвращает первое falsy значение или последнее, если все truthy."
  },
  {
    topic: "js_loops",
    text: "Как досрочно остановить цикл?",
    options: ["stop", "break", "return false", "exit"],
    optionExplanations: ["stop не оператор JS.", "break выходит из цикла.", "return выходит из функции.", "exit не оператор JS."],
    correctIndex: 1,
    explanation: "break завершает ближайший цикл или switch."
  },
  {
    topic: "js_switch",
    text: "Зачем обычно нужен break в switch?",
    options: ["Чтобы не было fall-through", "Чтобы создать переменную", "Чтобы сравнивать строго", "Чтобы вернуть значение"],
    optionExplanations: ["Без break выполнение пойдет в следующий case.", "Переменные создаются let/const.", "switch и так использует строгое сравнение.", "return работает только в функции."],
    correctIndex: 0,
    explanation: "break останавливает выполнение текущей ветки switch."
  },
  {
    topic: "js_functions",
    text: "Что вернет функция без return?",
    options: ["null", "0", "undefined", "false"],
    optionExplanations: ["null надо вернуть явно.", "0 надо вернуть явно.", "Без return результат undefined.", "false надо вернуть явно."],
    correctIndex: 2,
    explanation: "Если return нет, функция возвращает undefined."
  },
  {
    topic: "js_arrow_functions",
    text: "Что особенного у стрелочной функции?",
    options: ["Нет своего this", "Нельзя передавать аргументы", "Всегда async", "Всегда метод объекта"],
    optionExplanations: ["this берется из внешней области.", "Аргументы передавать можно.", "async надо указать явно.", "Стрелка не обязана быть методом."],
    correctIndex: 0,
    explanation: "Стрелочные функции не имеют собственного this."
  },
  {
    topic: "js_scope",
    text: "Какая область видимости у let?",
    options: ["Функциональная", "Блочная", "Глобальная всегда", "Только файловая"],
    optionExplanations: ["Это ближе к var.", "let виден внутри блока.", "let не всегда глобальный.", "Это не точное правило для обычного скрипта."],
    correctIndex: 1,
    explanation: "let и const имеют блочную область видимости."
  },
  {
    topic: "js_hoisting",
    text: "Что произойдет при обращении к let-переменной до объявления?",
    options: ["undefined", "ReferenceError", "null", "0"],
    optionExplanations: ["Так ведет себя var.", "До объявления let находится в TDZ.", "null не подставляется.", "0 не подставляется."],
    correctIndex: 1,
    explanation: "let/const находятся в temporal dead zone до строки объявления."
  },
  {
    topic: "js_arrays",
    text: "Какой метод создает новый массив без изменения исходного?",
    options: ["push", "pop", "map", "sort"],
    optionExplanations: ["push меняет исходный массив.", "pop меняет исходный массив.", "map возвращает новый массив.", "sort сортирует исходный массив."],
    correctIndex: 2,
    explanation: "map возвращает новый массив результатов."
  },
  {
    topic: "js_objects",
    text: "Как получить поле name у объекта user?",
    options: ["user.name", "user->name", "user::name", "user#name"],
    optionExplanations: ["Точечная нотация корректна.", "Такого синтаксиса в JS нет.", "Это не доступ к свойству.", "Это не доступ к обычному свойству."],
    correctIndex: 0,
    explanation: "К свойствам объекта обращаются через точку или квадратные скобки."
  },
  {
    topic: "js_this",
    text: "Что обычно определяет значение this в обычной функции?",
    options: ["Место объявления", "Способ вызова", "Имя функции", "Количество аргументов"],
    optionExplanations: ["Для обычной функции важен вызов.", "this зависит от того, как вызвали функцию.", "Имя не задает this.", "Аргументы не задают this."],
    correctIndex: 1,
    explanation: "В обычных функциях this определяется способом вызова."
  },
  {
    topic: "js_prototypes",
    text: "Для чего нужен прототип объекта?",
    options: ["Для поиска унаследованных свойств", "Для подключения CSS", "Для хранения HTML", "Для остановки цикла"],
    optionExplanations: ["Свойства ищутся по цепочке прототипов.", "CSS не связан с прототипом.", "HTML не хранится в прототипе.", "Циклы останавливает break."],
    correctIndex: 0,
    explanation: "Если свойства нет в объекте, JS ищет его в прототипной цепочке."
  },
  {
    topic: "js_constructor_functions",
    text: "Как обычно вызывают функцию-конструктор?",
    options: ["С оператором new", "Через await", "Только как стрелочную функцию", "Через import"],
    optionExplanations: ["new создает объект и привязывает this к нему.", "await ждет Promise, но не создает объект.", "Стрелочные функции не подходят для конструкторов.", "import подключает модули."],
    correctIndex: 0,
    explanation: "Функция-конструктор вызывается через new и обычно заполняет свойства через this."
  },
  {
    topic: "js_closures",
    text: "Что такое замыкание?",
    options: ["Функция с доступом к внешним переменным", "Закрытие вкладки браузера", "Ошибка синтаксиса", "Копия DOM-дерева"],
    optionExplanations: ["Функция помнит переменные из внешней области.", "Это не связано с вкладками.", "Замыкание не является ошибкой.", "DOM не копируется автоматически."],
    correctIndex: 0,
    explanation: "Замыкание позволяет функции использовать переменные из области, где она была создана."
  },
  {
    topic: "js_recursion",
    text: "Что обязательно должно быть у рекурсивной функции?",
    options: ["Базовый случай", "Только стрелочный синтаксис", "Метод map", "CSS-класс"],
    optionExplanations: ["Базовый случай останавливает рекурсию.", "Синтаксис функции не важен.", "map не обязателен.", "CSS не связан с рекурсией."],
    correctIndex: 0,
    explanation: "Без базового случая рекурсия может уйти в бесконечные вызовы."
  },
  {
    topic: "js_binary_search",
    text: "Какое главное условие для бинарного поиска?",
    options: ["Данные отсортированы", "Массив содержит только строки", "Нельзя использовать циклы", "Нужен DOM"],
    optionExplanations: ["Бинарный поиск работает по отсортированным данным.", "Тип элементов не главное условие.", "Алгоритм можно написать и циклом, и рекурсией.", "DOM здесь не нужен."],
    correctIndex: 0,
    explanation: "Бинарный поиск каждый шаг отбрасывает половину диапазона, поэтому порядок данных критичен."
  },
  {
    topic: "js_classes",
    text: "Что такое class в JavaScript?",
    options: ["Синтаксис поверх прототипов", "Новый примитив", "HTML-класс", "CSS-селектор"],
    optionExplanations: ["class упрощает работу с конструкторами и прототипами.", "Нового примитива не появляется.", "Это не атрибут HTML.", "Это не CSS-селектор."],
    correctIndex: 0,
    explanation: "Классы в JS основаны на прототипном наследовании."
  },
  {
    topic: "js_strings",
    text: "Что делает шаблонная строка с ${}?",
    options: ["Вставляет выражение в строку", "Создает массив", "Отключает Unicode", "Делает строку mutable"],
    optionExplanations: ["${} интерполирует выражение.", "Массив не создается.", "Unicode не отключается.", "Строки остаются неизменяемыми."],
    correctIndex: 0,
    explanation: "Template literals позволяют вставлять выражения через ${...}."
  },
  {
    topic: "js_errors",
    text: "Для чего нужна конструкция try...catch?",
    options: ["Для обработки ошибок", "Для создания функции", "Для цикла", "Для импорта CSS"],
    optionExplanations: ["catch ловит исключение из try.", "Функции создаются function/=>.", "Циклы создаются for/while.", "CSS не импортируется через try."],
    correctIndex: 0,
    explanation: "try...catch позволяет обработать исключение."
  },
  {
    topic: "js_builtin",
    text: "Что вернет Math.floor(2.9)?",
    options: ["2", "3", "2.9", "NaN"],
    optionExplanations: ["floor округляет вниз.", "3 вернул бы ceil или round.", "Возвращается целое число.", "Число валидное."],
    correctIndex: 0,
    explanation: "Math.floor округляет число вниз до ближайшего целого."
  },
  {
    topic: "js_collections",
    text: "Чем Set отличается от массива?",
    options: ["Хранит только уникальные значения", "Всегда сортирует", "Хранит только строки", "Не итерируется"],
    optionExplanations: ["Set не хранит дубликаты.", "Set не сортирует автоматически.", "Set хранит разные типы.", "Set можно итерировать."],
    correctIndex: 0,
    explanation: "Set - коллекция уникальных значений."
  },
  {
    topic: "js_collections",
    text: "Для чего подходит Map?",
    options: ["Для пар ключ-значение с любыми ключами", "Только для CSS", "Только для чисел", "Для остановки Promise"],
    optionExplanations: ["Map хранит пары ключ-значение.", "CSS не связан с Map.", "Ключи и значения могут быть разных типов.", "Promise так не останавливают."],
    correctIndex: 0,
    explanation: "Map удобен, когда ключом может быть не только строка."
  },
  ...courseQuestions
];
