import Database from "better-sqlite3"
import path from "path"

const DB_PATH = path.join(process.cwd(), "feedback.db")

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma("journal_mode = WAL")
    db.pragma("foreign_keys = ON")

    // Auto-create table on first use
    db.exec(`
      CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        case_number TEXT NOT NULL UNIQUE,
        reporter_type TEXT NOT NULL CHECK (reporter_type IN ('student', 'teacher')),
        reporter_id TEXT NOT NULL,
        reporter_name TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('academic', 'facility', 'technology', 'safety', 'other')),
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
        admin_response TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    // Create indexes for fast lookups
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_cases_reporter_id ON cases (reporter_id);
      CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases (case_number);
      CREATE INDEX IF NOT EXISTS idx_cases_status ON cases (status);
    `)
  }

  return db
}
