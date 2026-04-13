import { UserRepository } from "../repositories/user.js";

export const UserService = {
	async createUser(username) {
		if (!username || !username.trim()) {
			throw { status: 400, message: "username is required" };
		}

		const trimmed = username.trim();
		const existing = await UserRepository.findByUsername(trimmed);
		if (existing) {
			throw { status: 400, message: "username already taken" };
		}

		return UserRepository.create(trimmed);
	},

	async getAllUsers() {
		const users = await UserRepository.findAll();
		if (users.length === 0) {
			throw { status: 404, message: "No users found" };
		}

		return users;
	},
};
