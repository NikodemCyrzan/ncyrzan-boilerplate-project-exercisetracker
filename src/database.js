import { Database } from "sqlite-async";

export let db;

export async function setupDatabase() {
	db = await Database.open("./database.db");

	await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE
        )
    `);

	await db.exec(`
        CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            description TEXT NOT NULL,
            duration INTEGER NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

	return db;
}

export function getDatabase() {
	if (!db) {
		throw new Error("Database not initialized — call initDatabase() first");
	}

	return db;
}
