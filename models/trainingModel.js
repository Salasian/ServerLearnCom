const mongoose = require("mongoose");

const TrainingSchema = mongoose.Schema({
  startDate: String,
  name: String,
  type: String,
  participant: String,
  duration: Number,
  description: String,
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Students" },
  trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trainers" }],
});

module.exports = mongoose.model("Trainings", TrainingSchema);
