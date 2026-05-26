# MVP Telegram-бот для подготовки к собеседованию (HTML/CSS)

Простой Telegram-бот на Node.js + TypeScript + Telegraf + SQLite.

## Что умеет

- `/start` + кнопки меню:
  - `Начать тест`
  - `Интервью`
  - `Повторить ошибки`
  - `Добавить вакансию`
  - `Темы`
  - `Прогресс`
- Тесты по HTML/CSS/JS:
  - один вопрос за раз,
  - inline-кнопки,
  - ответ + короткое объяснение,
  - при ошибке разбор всех вариантов и ссылка на материал,
  - кнопка `Следующий вопрос`.
- Вакансии вручную:
  - `/vacancy` или кнопка,
  - пользователь вставляет текст,
  - rule-based анализ по ключевым словам,
  - рост весов тем,
  - сохранение текста, даты, keywords, topics.
- Адаптация теста:
  - новые вопросы идут от простого к сложному,
  - темы из вакансий получают мягкий приоритет внутри уровня,
  - правильно решенные вопросы повторяются позже по SRS-расписанию.
- Повтор ошибок:
  - `/mistakes` или кнопка,
  - задаются только ошибочные вопросы, пока не будут решены.
- `/progress`:
  - дневная цель,
  - дни подряд,
  - решено,
  - правильных,
  - ошибок,
  - повторы на сегодня,
  - пройденные темы,
  - топ тем по вакансиям.
- `/interview`:
  - 10 вопросов подряд,
  - без повторов внутри сессии,
  - итоговый счет в конце.
- `/topics`:
  - тренировка только по HTML,
  - тренировка только по CSS,
  - тренировка только по JavaScript,
  - возврат к общему режиму.

## Структура проекта

```txt
.
├─ .env.example
├─ .gitignore
├─ ecosystem.config.cjs
├─ frontend-interview-bot.service
├─ package.json
├─ tsconfig.json
├─ sql/
│  └─ schema.sql
└─ src/
   ├─ bot.ts
   ├─ handlers/
   │  ├─ quizHandler.ts
   │  ├─ startHandler.ts
   │  ├─ statsHandler.ts
   │  └─ vacancyHandler.ts
   ├─ questions/
   │  └─ index.ts
   ├─ services/
   │  ├─ questionService.ts
   │  ├─ statsService.ts
   │  ├─ userService.ts
   │  └─ vacancyService.ts
   ├─ storage/
   │  ├─ db.ts
   │  └─ migrate.ts
   └─ utils/
      ├─ constants.ts
      └─ keyboards.ts
```

## Быстрый старт (локально)

1. Установить Node.js 20+.
2. Установить зависимости:
```bash
npm install
```
3. Создать `.env` из примера:
```bash
cp .env.example .env
```
4. Заполнить `BOT_TOKEN` в `.env`.
5. Запуск в dev:
```bash
npm run dev
```
6. Прод-режим локально:
```bash
npm run build
npm start
```

SQLite создается автоматически по пути `DB_PATH` (по умолчанию `./data/bot.db`).

## Команды бота

- `/start`
- `/vacancy`
- `/mistakes`
- `/progress`
- `/stats` (старый алиас)
- `/interview`
- `/topics`

## Rule-based анализ вакансий

Ключевые слова (без NLP, только простая проверка `includes`):
- `HTML`, `CSS`, `BEM`, `Flexbox`, `Grid`, `адаптивная верстка`, `семантика`, `SCSS`, `Git`, `JavaScript`, `формы`, `position`, `media queries`, `псевдоклассы`, `box model`.

Логика:
- если keyword найден в тексте вакансии, добавляются связанные темы;
- для каждой найденной темы `weight += 1`;
- при выдаче нового вопроса бот учитывает вес темы внутри текущего уровня сложности.

## Повторение и прогресс

Бот использует простую SRS-логику:
- правильный ответ переносит вопрос на повтор через `2`, `4`, `7`, `14`, `30`, затем `60` дней;
- неправильный ответ возвращает вопрос в режим ошибок;
- обычный тест сначала показывает вопросы, срок повторения которых уже наступил;
- если повторов нет, бот дает новый вопрос по порядку сложности;
- если на сегодня вопросов нет, бот предлагает вернуться позже или разобрать ошибки.

В прогрессе дополнительно видно:
- дневную цель `5` вопросов;
- сколько вопросов решено сегодня;
- streak: сколько дней подряд пользователь отвечал хотя бы на один вопрос;
- какие темы уже начаты и сколько вопросов по ним пройдено.

## SQLite схема

Пример схемы: `sql/schema.sql`

Таблицы:
- `users`
- `questions`
- `answers`
- `mistakes`
- `vacancies`
- `topic_weights`
- `user_state`
- `question_progress`
- `interview_sessions`

## Деплой на VPS (Ubuntu)

1. Подготовка сервера:
```bash
sudo apt update
sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

2. Клонирование и сборка:
```bash
cd /var/www
sudo mkdir -p frontend-interview-bot
sudo chown -R $USER:$USER frontend-interview-bot
cd frontend-interview-bot
# скопируй сюда проект
npm install
npm run build
cp .env.example .env
# заполнить BOT_TOKEN и DB_PATH
```

### Вариант A: PM2

```bash
sudo npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Проверка:
```bash
pm2 status
pm2 logs frontend-interview-bot
```

### Вариант B: systemd

1. Скопировать сервис:
```bash
sudo cp frontend-interview-bot.service /etc/systemd/system/frontend-interview-bot.service
```
2. Проверить пути внутри файла сервиса (`WorkingDirectory`, `ExecStart`, `EnvironmentFile`).
3. Включить сервис:
```bash
sudo systemctl daemon-reload
sudo systemctl enable frontend-interview-bot
sudo systemctl start frontend-interview-bot
```
4. Проверка:
```bash
sudo systemctl status frontend-interview-bot
journalctl -u frontend-interview-bot -f
```

## Примечания

- Это MVP: минимум логики, без парсинга ссылок и без сложных интеграций.
- Данные сохраняются между перезапусками в SQLite.
- Для production лучше делать регулярный бэкап файла `bot.db`.
