import { ExerciseModel } from "../models/exercise.js";

export const ExerciseRepository = {
	async create(db, userId, description, duration, date) {
		await db.run(
			"INSERT INTO exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)",
			userId,
			description,
			duration,
			date,
		);
		return new ExerciseModel(userId, description, duration, date);
	},

	async findByUserId(db, userId, { from, to, limit } = {}) {
		let query = "SELECT id, description, duration, date FROM exercises WHERE user_id = ?";
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

		const allMatching = (await db.all(query, ...params)).map(
			({ userId, description, duration, date }) =>
				new ExerciseModel(userId, description, duration, date),
		);

		if (limit) {
			return { count: allMatching.length, logs: allMatching.slice(0, limit) };
		}

		return { count: allMatching.length, logs: allMatching };
	},
};
