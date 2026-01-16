import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'kisibilgisi.db');
const db = new Database(dbPath);

// Initialize the database with the users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    photoUrl TEXT,
    phoneNumber TEXT,
    password TEXT,
    bloodType TEXT,
    pin TEXT,
    userNote TEXT,
    extraInfo TEXT,
    emergencyContacts TEXT,
    createdAt INTEGER DEFAULT (unixepoch())
  )
`);

// Migration: Add new columns if they don't exist
try {
  db.exec('ALTER TABLE users ADD COLUMN phoneNumber TEXT');
} catch (error: any) { }

try {
  db.exec('ALTER TABLE users ADD COLUMN password TEXT');
} catch (error: any) { }

try {
  db.exec('ALTER TABLE users ADD COLUMN pin TEXT');
} catch (error: any) { }

try {
  db.exec('ALTER TABLE users ADD COLUMN userNote TEXT');
} catch (error: any) { }

try {
  db.exec('ALTER TABLE users ADD COLUMN emergencyContacts TEXT');
} catch (error: any) { }

try {
  db.exec('ALTER TABLE users ADD COLUMN socialMedia TEXT');
} catch (error: any) { }

// Create admins table
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt INTEGER DEFAULT (unixepoch())
  )
`);

// Seed default admin if not exists
const checkAdmin = db.prepare('SELECT * FROM admins WHERE username = ?');
if (!checkAdmin.get('admin')) {
  const insertAdmin = db.prepare('INSERT INTO admins (id, username, password) VALUES (?, ?, ?)');
  // v4 is not available here easily without importing UUID, let's use a simple random string or require uuid
  // actually, let's import uuid to be safe or just use a placeholder since it is text
  // We can use a simple helper or just import { v4 as uuidv4 } from 'uuid';
  // But db.ts currently imports 'better-sqlite3' and 'path'.
  // Let's rely on uuid import.
  // Wait, I can't easily add import if I don't see the top of the file fully in this context (I saw lines 1-20).
  // I can just use a simple random string for now or 'default-admin-id'.
  insertAdmin.run('default-admin-id', 'admin', 'admin123');
  console.log('Seeded default admin user.');
}

export default db;
