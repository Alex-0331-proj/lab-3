import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "shorty.db");

const db = new Database(dbPath);
console.log("Успішно підключено до бази SQLite (shorty.db) через better-sqlite3");
db.pragma('foreign_keys = ON');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    sex TEXT,
    dob TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NULL,
    long_url TEXT NOT NULL,
    short_code TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);


export const dbQuery = (query, params = []) => {
  try {
    const stmt = db.prepare(query);
    return stmt.all(params);
  } catch (err) {
    console.error("Помилка SQLite (query):", err.message);
    throw err;
  }
};

export const dbRun = (query, params = []) => {
  try {
    const stmt = db.prepare(query);
    const info = stmt.run(params); 
    return { id: info.lastInsertRowId, changes: info.changes };
  } catch (err) {
    console.error("Помилка SQLite (run):", err.message);
    throw err;
  }
};
