import { getDatabase } from "../database.js";
import { UserModel } from "../models/user.js";

export const UserRepository = {
	async findAll() {
		const rows = await getDatabase().all("SELECT id, username FROM users");
		return rows.map(({ id, username }) => new UserModel(id, username));
	},

	async findById(id) {
		const row = await getDatabase().get("SELECT id, username FROM users WHERE id = ?", id);
		if (!row) return null;
		return new UserModel(row.id, row.username);
	},

	async findByUsername(username) {
		const row = await getDatabase().get(
			"SELECT id, username FROM users WHERE username = ?",
			username,
		);
		if (!row) return null;
		return new UserModel(row.id, row.username);
	},

	async create(username) {
		const result = await getDatabase().run("INSERT INTO users (username) VALUES (?)", username);
		return new UserModel(result.lastID, username);
	},
};
