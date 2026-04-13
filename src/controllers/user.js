import { UserService } from "../services/user.js";

export const UserController = {
	async create(req, res) {
		try {
			const user = await UserService.createUser(req.body.username);
			res.json(user);
		} catch (err) {
			res.status(err.status || 500).json({ error: err.message || "Internal error" });
		}
	},

	async getAll(_req, res) {
		try {
			const users = await UserService.getAllUsers();
			res.json(users);
		} catch (err) {
			res.status(err.status || 500).json({ error: err.message || "Internal error" });
		}
	},
};
