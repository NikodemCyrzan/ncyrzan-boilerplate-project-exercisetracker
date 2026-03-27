import { fileURLToPath } from "url";
import { dirname } from "path";
import express, { static as stc } from "express";
import cors from "cors";
import { Database } from "sqlite-async";
import("dotenv/config.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(stc("public"));

const db = await Database.open("./database.db");

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL
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

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
	const { username } = req.body;

	if (!username || !username.trim()) {
		return res.status(400).json({ error: "username is required" });
	}

	const result = await db.run("INSERT INTO users (username) VALUES (?)", username.trim());

	res.json({ id: result.lastID, username: username.trim() });
});

app.get("/api/users", async (_req, res) => {
	const users = await db.all("SELECT id, username FROM users");

	if (users.length === 0) {
		return res.status(404).json({ error: "No users found" });
	}

	res.json(users);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
	const userId = Number(req.params._id);
	const { description, duration, date } = req.body;

	const user = await db.get("SELECT * FROM users WHERE id = ?", userId);
	if (!user) {
		return res.status(400).json({ error: "User not found" });
	}

	if (!description || !description.trim()) {
		return res.status(400).json({ error: "description is required" });
	}

	const dur = Number(duration);
	if (!duration || isNaN(dur) || !Number.isInteger(dur) || dur <= 0) {
		return res
			.status(400)
			.json({ error: "duration is required and must be a positive integer" });
	}

	let exerciseDate;
	if (!date || !date.trim()) {
		exerciseDate = new Date().toISOString().slice(0, 10);
	} else {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
			return res.status(400).json({ error: "date must be in YYYY-MM-DD format" });
		}
		const parsed = new Date(date.trim());
		if (isNaN(parsed.getTime())) {
			return res.status(400).json({ error: "date is not a valid" });
		}
		exerciseDate = date.trim();
	}

	const result = await db.run(
		"INSERT INTO exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)",
		userId,
		description.trim(),
		dur,
		exerciseDate,
	);

	res.json({
		userId: user.id,
		exerciseId: result.lastID,
		description: description.trim(),
		duration: dur,
		date: exerciseDate,
	});
});

app.get("/api/users/:_id/logs", async (req, res) => {
	const userId = Number(req.params._id);

	const user = await db.get("SELECT id, username FROM users WHERE id = ?", userId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	let query = "SELECT id, description, duration, date FROM exercises WHERE user_id = ?";
	const params = [userId];

	if (req.query.from) {
		query += " AND date >= ?";
		params.push(req.query.from);
	}

	if (req.query.to) {
		query += " AND date <= ?";
		params.push(req.query.to);
	}

	query += " ORDER BY date DESC";

	if (req.query.limit) {
		const limit = Number(req.query.limit);
		if (!isNaN(limit) && Number.isInteger(limit) && limit > 0) {
			query += " LIMIT ?";
			params.push(limit);
		}
	}

	const exercises = await db.all(query, ...params);

	res.json({
		count: exercises.length,
		logs: exercises,
	});
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
