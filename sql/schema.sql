CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  telegram_id INTEGER UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE web_clients (
  client_id TEXT PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE questions (
  id INTEGER PRIMARY KEY,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options_json TEXT NOT NULL,
  option_explanations_json TEXT,
  difficulty INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL
);

CREATE TABLE answers (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  selected_index INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  answered_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE mistakes (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  unresolved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT,
  UNIQUE(user_id, question_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE vacancies (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  added_at TEXT NOT NULL DEFAULT (datetime('now')),
  keywords_json TEXT NOT NULL,
  topics_json TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE topic_weights (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  topic TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, topic),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_state (
  user_id INTEGER PRIMARY KEY,
  mode TEXT NOT NULL,
  current_question_id INTEGER,
  current_mode TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE question_progress (
  user_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  box INTEGER NOT NULL DEFAULT 0,
  due_at TEXT NOT NULL DEFAULT (datetime('now')),
  first_answered_at TEXT,
  last_answered_at TEXT,
  correct_streak INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, question_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE interview_sessions (
  user_id INTEGER PRIMARY KEY,
  total INTEGER NOT NULL DEFAULT 10,
  answered INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  asked_ids_json TEXT NOT NULL DEFAULT '[]',
  is_active INTEGER NOT NULL DEFAULT 1,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
