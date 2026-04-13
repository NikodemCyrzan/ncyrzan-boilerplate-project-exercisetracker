import { getDatabase } from "../database.js";
import { ExerciseModel } from "../models/exercise.js";

export const ExerciseRepository = {
	async create(userId, description, duration, date) {
		const result = await getDatabase().run(
			"INSERT INTO exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)",
			userId,
			description,
			duration,
			date,
		);
		return new ExerciseModel(result.lastID, userId, description, duration, date);
	},

	async findByUserId(userId, { from, to, limit } = {}) {
		let query =
			"SELECT id, user_id, description, duration, date FROM exercises WHERE user_id = ?";
		const params = [userId];

		if (from) {
			query += " AND date >= ?";
			params.push(from);
		}

		if (to) {
			query += " AND date <= ?";
			params.push(to);
		}

		query += " ORDER BY date ASC";

		const allMatching = (await getDatabase().all(query, ...params)).map(
			({ id, user_id, description, duration, date }) =>
				new ExerciseModel(id, user_id, description, duration, date),
		);

		if (limit) {
			return { count: allMatching.length, logs: allMatching.slice(0, limit) };
		}

		return { count: allMatching.length, logs: allMatching };
	},
};
