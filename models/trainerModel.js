const mongoose = require("mongoose");

const TrainerSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  status: Boolean,
  specialization: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Students" }],
});

module.exports = mongoose.model("Trainers", TrainerSchema);
