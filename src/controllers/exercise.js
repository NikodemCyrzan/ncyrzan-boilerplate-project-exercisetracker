import { ExerciseService } from "../services/exercise.js";

export const ExerciseController = {
	async add(req, res) {
		try {
			const result = await ExerciseService.addExercise(Number(req.params._id), req.body);
			res.json(result);
		} catch (err) {
			res.status(err.status || 500).json({ error: err.message || "Internal error" });
		}
	},

	async logs(req, res) {
		try {
			const result = await ExerciseService.getLogs(Number(req.params._id), req.query);
			res.json(result);
		} catch (err) {
			res.status(err.status || 500).json({ error: err.message || "Internal error" });
		}
	},
};
