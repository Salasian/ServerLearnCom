const express = require("express");
const connectDB = require("./config/db");
var cors = require("cors");

const {
  getAllUsers,
  getUserBy,
  postUser,
  deleteUserByUsername,
  updateUserByUsername,
  loginUser,
} = require("./controllers/userController");
const {
  getAllStudents,
  getStudentBy,
  postStudent,
  updateStudentByUser,
  deleteStudentByUser,
} = require("./controllers/studentController");
const {
  getAllTrainers,
  getTrainerBy,
  postTrainer,
  updateTrainerByUser,
  deleteTrainerByUser,
  updateTrainerStudentsByUser,
  deleteTrainerStudentsByUser,
} = require("./controllers/trainerController");
const {
  getAllTrainings,
  getTrainingsBy,
  postTraining,
  updateTrainingByName,
  deleteTrainingByName,
  getAllTrainingsByStudent,
  getAllTrainingsByTrainer,
} = require("./controllers/trainingController");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

//Users
app.get("/users", getAllUsers);
app.get("/users/search", getUserBy);
app.post("/users", postUser);
app.delete("/users/:username", deleteUserByUsername);
app.put("/users/:username", updateUserByUsername);
app.get("/users/login", loginUser);

//Students
app.get("/students", getAllStudents);
app.get("/students/search", getStudentBy);
app.post("/students", postStudent);
app.put("/students/:user", updateStudentByUser);
app.delete("/students/:user", deleteStudentByUser);

//Trainers
app.get("/trainers", getAllTrainers);
app.get("/trainers/search", getTrainerBy);
app.post("/trainers", postTrainer);
app.put("/trainers/:user", updateTrainerByUser);
app.put("/trainers/addStudent/:trainerId", updateTrainerStudentsByUser);
app.put("/trainers/deleteStudent/:trainerId", deleteTrainerStudentsByUser);
app.delete("/trainers/:user", deleteTrainerByUser);

//Trainings
app.get("/trainings", getAllTrainings);
app.get("/trainings/search", getTrainingsBy);
app.get("/trainings/student/:studentId", getAllTrainingsByStudent);
app.get("/trainings/trainer/:trainerId", getAllTrainingsByTrainer);
app.post("/trainings", postTraining);
app.put("/trainings/:name", updateTrainingByName);
app.delete("/trainings/:name", deleteTrainingByName);

app.listen(3000, console.log("Server started"));
