export type CourseMapItem = {
  id: string;
  title: string;
  topics: string[];
};

export type CourseMapModule = {
  id: string;
  title: string;
  items: CourseMapItem[];
};

export const courseMap: CourseMapModule[] = [
  {
    id: "layout",
    title: "Модуль 1: HTML и CSS",
    items: [
      { id: "git", title: "Git и GitHub", topics: ["git"] },
      { id: "html-base", title: "HTML: структура, семантика, формы", topics: ["html_semantics", "attributes", "block_inline", "forms", "html_meta", "html_tables", "accessibility"] },
      { id: "css-base", title: "CSS: селекторы, каскад, box model", topics: ["selectors", "specificity", "box_model", "cascade", "units", "css_text", "css_colors"] },
      { id: "css-layout", title: "Макеты: flex, grid, position, responsive", topics: ["flexbox", "grid", "position", "responsive", "media_queries"] },
      { id: "css-effects", title: "CSS: состояния, фоны, шрифты, оптимизация", topics: ["pseudo", "css_transitions", "css_backgrounds", "css_fonts", "css_optimization"] }
    ]
  },
  {
    id: "javascript",
    title: "Модуль 2: JavaScript",
    items: [
      { id: "js-core", title: "JS Core: типы, условия, циклы, функции", topics: ["js_variables", "js_types", "js_conversion", "js_operators", "js_comparison", "js_conditions", "js_logic", "js_loops", "js_switch", "js_functions", "js_arrow_functions"] },
      { id: "js-data", title: "Данные: массивы, объекты, строки, коллекции", topics: ["js_arrays", "js_objects", "js_strings", "js_builtin", "js_collections"] },
      { id: "js-advanced", title: "Продвинутый JS: scope, this, прототипы, классы", topics: ["js_scope", "js_hoisting", "js_this", "js_prototypes", "js_constructor_functions", "js_closures", "js_recursion", "js_binary_search", "js_classes"] },
      { id: "js-browser", title: "Браузер: DOM, события, формы, storage", topics: ["js_dom", "js_events", "forms", "js_storage", "js_debugging"] },
      { id: "js-network", title: "Асинхронность и модули", topics: ["js_async", "js_modules", "js_errors"] }
    ]
  },
  {
    id: "react-ts",
    title: "Модуль 3: React и TypeScript",
    items: [
      { id: "react-core", title: "React: компоненты, props, state, effects", topics: ["react_components", "react_props", "react_state", "react_effects"] },
      { id: "react-ui", title: "React: списки и формы", topics: ["react_lists", "react_forms"] },
      { id: "redux", title: "Redux Toolkit", topics: ["redux_store", "redux_slice", "redux_async"] },
      { id: "typescript", title: "TypeScript: типы и безопасный код", topics: ["typescript_types", "typescript_interfaces", "typescript_generics", "typescript_utility_types", "typescript_type_guards"] }
    ]
  }
];
