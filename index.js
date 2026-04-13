import { UserController } from "./src/controllers/user.js";
import { ExerciseController } from "./src/controllers/exercise.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express, { static as stc } from "express";
import cors from "cors";
import("dotenv/config.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(stc("public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", UserController.create);
app.get("/api/users", UserController.getAll);
app.post("/api/users/:_id/exercises", ExerciseController.add);
app.get("/api/users/:_id/logs", ExerciseController.logs);

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("App is listening on port " + listener.address().port);
});
