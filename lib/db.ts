import initSqlJs, { type Database } from "sql.js"
import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "feedback.db")

let db: Database | null = null
let initPromise: Promise<Database> | null = null

export async function getDb(): Promise<Database> {
  if (db) return db

  if (initPromise) return initPromise

  initPromise = (async () => {
    const SQL = await initSqlJs()

    // Load existing database file if it exists
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH)
      db = new SQL.Database(fileBuffer)
    } else {
      db = new SQL.Database()
    }

    // Auto-create table on first use
    db.run(`
      CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        case_number TEXT NOT NULL UNIQUE,
        reporter_type TEXT NOT NULL,
        reporter_id TEXT NOT NULL,
        reporter_name TEXT NOT NULL,
        category TEXT NOT NULL,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        admin_response TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // Create indexes
    db.run("CREATE INDEX IF NOT EXISTS idx_cases_reporter_id ON cases (reporter_id)")
    db.run("CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases (case_number)")
    db.run("CREATE INDEX IF NOT EXISTS idx_cases_status ON cases (status)")

    // Save after init
    saveDb()

    return db
  })()

  return initPromise
}

export function saveDb() {
  if (db) {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(DB_PATH, buffer)
  }
}
