import { UserRepository } from "../repositories/user.js";
import { ExerciseRepository } from "../repositories/exercise.js";

export const ExerciseService = {
	async addExercise(userId, { description, duration, date }) {
		const user = await UserRepository.findById(userId);
		if (!user) {
			throw { status: 400, message: "User not found" };
		}

		if (!description || !description.trim()) {
			throw { status: 400, message: "description is required" };
		}

		const dur = Number(duration);
		if (!duration || isNaN(dur) || !Number.isInteger(dur) || dur <= 0) {
			throw { status: 400, message: "duration is required and must be a positive integer" };
		}

		let exerciseDate;
		if (!date || !date.trim()) {
			exerciseDate = new Date().toISOString().slice(0, 10);
		} else {
			const trimmedDate = date.trim();
			if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) {
				throw { status: 400, message: "date must be in YYYY-MM-DD format" };
			}
			const parsed = new Date(trimmedDate);
			if (isNaN(parsed.getTime())) {
				throw { status: 400, message: "date is not valid" };
			}
			exerciseDate = trimmedDate;
		}

		return ExerciseRepository.create(user.id, description.trim(), dur, exerciseDate);
	},

	async getLogs(userId, query) {
		const user = await UserRepository.findById(userId);
		if (!user) {
			throw { status: 404, message: "User not found" };
		}

		const limit = query.limit ? Number(query.limit) : undefined;
		const parsedLimit =
			limit && !isNaN(limit) && Number.isInteger(limit) && limit > 0 ? limit : undefined;

		return ExerciseRepository.findByUserId(userId, {
			from: query.from,
			to: query.to,
			limit: parsedLimit,
		});
	},
};
