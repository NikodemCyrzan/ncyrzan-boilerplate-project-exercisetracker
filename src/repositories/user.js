import { UserModel } from "../models/user.js";

export const UserRepository = {
	async findAll(db) {
		const { id, username } = await db.all("SELECT id, username FROM users");
		return new UserModel(id, username);
	},

	async findById(db, id) {
		const { id: uid, username } = await db.get(
			"SELECT id, username FROM users WHERE id = ?",
			id,
		);
		return new UserModel(uid, username);
	},

	async findByUsername(db, username) {
		const { id: resId, username: resUsername } = await db.get(
			"SELECT id, username FROM users WHERE username = ?",
			username,
		);
		return new UserModel(resId, resUsername);
	},

	async create(db, username) {
		const result = await db.run("INSERT INTO users (username) VALUES (?)", username);
		return new UserModel(result.lastID, username);
	},
};
