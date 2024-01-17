const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  status: Boolean,
  dateOfBirth: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  trainers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trainers" }],
});

module.exports = mongoose.model("Students", StudentSchema);
