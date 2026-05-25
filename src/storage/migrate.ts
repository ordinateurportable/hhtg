import "dotenv/config";
import { db } from "./db";

const row = db.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
console.log(`Schema ready. Questions in DB: ${row.count}`);
