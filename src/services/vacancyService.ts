import { db } from "../storage/db";
import { VACANCY_KEYWORDS } from "../utils/constants";

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ");
}

export function analyzeVacancy(text: string): { keywords: string[]; topics: string[] } {
  const normalized = normalize(text);
  const foundKeywords = new Set<string>();
  const foundTopics = new Set<string>();

  for (const item of VACANCY_KEYWORDS) {
    if (normalized.includes(item.keyword)) {
      foundKeywords.add(item.keyword);
      for (const topic of item.topics) foundTopics.add(topic);
    }
  }

  return {
    keywords: Array.from(foundKeywords),
    topics: Array.from(foundTopics)
  };
}

export function saveVacancy(userId: number, text: string): { keywords: string[]; topics: string[] } {
  const analysis = analyzeVacancy(text);

  db.prepare(`
    INSERT INTO vacancies (user_id, text, keywords_json, topics_json)
    VALUES (?, ?, ?, ?)
  `).run(userId, text, JSON.stringify(analysis.keywords), JSON.stringify(analysis.topics));

  const upsert = db.prepare(`
    INSERT INTO topic_weights (user_id, topic, weight)
    VALUES (?, ?, 1)
    ON CONFLICT(user_id, topic)
    DO UPDATE SET weight = weight + 1
  `);

  const tx = db.transaction((topics: string[]) => {
    for (const topic of topics) upsert.run(userId, topic);
  });

  tx(analysis.topics);
  return analysis;
}

export function topTopics(userId: number): Array<{ topic: string; weight: number }> {
  return db.prepare(`
    SELECT topic, weight
    FROM topic_weights
    WHERE user_id = ?
    ORDER BY weight DESC, topic ASC
    LIMIT 5
  `).all(userId) as Array<{ topic: string; weight: number }>;
}
