# MVP веб-тренажер для подготовки к собеседованию

Простой тренажер по HTML, CSS и базовому JavaScript на Node.js + TypeScript + SQLite. Основной режим теперь веб-сайт, Telegram-бот оставлен как дополнительный запуск.

## Возможности

- вопросы по HTML/CSS/JS;
- режимы `Все темы`, `HTML`, `CSS`, `JavaScript`, `Ошибки`, `Интервью`;
- SRS-повторение как в Anki;
- движение от простого к сложному;
- прогресс, streak, дневная цель, точность, слабые темы;
- визуальные индикаторы прогресса: кольцо точности, карточки метрик, прогресс по темам;
- ручная вставка текста вакансии или краткого саммари урока;
- rule-based анализ текста по ключевым словам;
- хранение прогресса в SQLite на сервере.

## Структура

```txt
src/
  server.ts
  web/
    index.html
    styles.css
    app.js
  services/
  storage/
  questions/
```

## Локальный запуск

```bash
npm install
npm run build
npm run migrate
npm start
```

Открой:

```txt
http://localhost:3000
```

Для разработки:

```bash
npm run dev
```

Telegram-версия, если нужна:

```bash
npm run start:bot
```

## `.env`

Для веб-версии достаточно:

```env
DB_PATH=./data/bot.db
PORT=3000
```

`BOT_TOKEN` нужен только для Telegram-версии.

## Деплой на VPS

Если проект лежит тут:

```txt
/var/www/frontend-interview-bot/hhtg
```

Выполни:

```bash
cd /var/www/frontend-interview-bot/hhtg
npm install
npm run build
npm run migrate
npm start
```

Проверка в браузере:

```txt
http://SERVER_IP:3000
```

## PM2

`ecosystem.config.cjs` уже настроен на веб-сервер:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Проверка:

```bash
pm2 status
pm2 logs frontend-interview-bot
```

## SQLite

## JS Core темы

Вопросы по JavaScript расширены по базовым разделам:

- переменные и константы;
- типы данных и преобразование типов;
- операторы, сравнения, условия и логика;
- циклы и `switch`;
- функции, стрелочные функции, область видимости, hoisting;
- массивы, объекты, `this`, прототипы, функции-конструкторы, замыкания, рекурсия, бинарный поиск и классы;
- строки, ошибки, встроенные объекты, `Set` и `Map`.

Ориентиры по материалам:

- `https://learn.javascript.ru/first-steps`
- `https://www.my-interview.tech/0000-Навигация/001-Frontend/003-JSCore`
- `https://metanit.com/web/javascript/` до главы 10

## SQLite

Основные таблицы:

- `users`
- `web_clients`
- `questions`
- `answers`
- `mistakes`
- `vacancies`
- `topic_weights`
- `question_progress`
- `interview_sessions`

База по умолчанию:

```txt
./data/bot.db
```

Для production полезно делать бэкап:

```bash
cp data/bot.db data/bot-$(date +%F).db
```
