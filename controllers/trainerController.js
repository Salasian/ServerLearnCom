const Trainers = require("../models/trainerModel");
const Users = require("../models/userModel");
const { stringToMongoId } = require("../config/utils");

exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainers.find();
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Get All Trainer Failed: ".concat(error.message),
    });
  }
};

exports.getTrainerBy = async (req, res) => {
  try {
    const search_field = Object.keys(req.query)[0];
    const search_value = Object.values(req.query)[0];
    const queryObj = {};

    if (search_field !== "" && search_value !== "") {
      queryObj[search_field] = search_value;
    }

    const trainer = await Trainers.findOne(queryObj).populate("students");

    if (!trainer) {
      return res.status(404).json({
        status: "failure",
        message: `Trainer with the given ${search_field}:${search_value} not found`,
      });
    }

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Trainer Search by Query Failed: ".concat(error.message),
    });
  }
};

exports.postTrainer = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    address,
    status,
    specialization,
    user: id,
    students,
  } = req.body;
  try {
    let trainer = await Trainers.findOne({ user: id });
    if (trainer) return res.status(400).send("Trainer already registered.");

    const newTrainer = new Trainers({
      firstName,
      lastName,
      email,
      address,
      status,
      specialization,
      user: stringToMongoId(id),
      students,
    });

    newTrainer.save();
    res.status(200).json(newTrainer);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Post Trainer Failed: ".concat(error.message),
    });
  }
};

exports.updateTrainerByUser = async (req, res) => {
  const { user: userParams } = req.params;

  const {
    firstName,
    lastName,
    email,
    address,
    status,
    specialization,
    students,
  } = req.body;
  try {
    const trainer = await Trainers.findOneAndUpdate(
      { user: userParams },
      {
        firstName,
        lastName,
        email,
        address,
        status,
        specialization,
        students,
      },
      { new: true }
    );

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Update Trainer Failed: ".concat(error.message),
    });
  }
};

exports.updateTrainerStudentsByUser = async (req, res) => {
  const { trainerId } = req.params;
  const { studentId } = req.body;
  try {
    const id = stringToMongoId(trainerId);
    const trainer = await Trainers.findOne({ _id: id });
    if (!trainer.students.includes(studentId)) trainer.students.push(studentId);
    const updatedTrainer = await Trainers.findOneAndUpdate(
      { _id: id },
      {
        students: trainer.students,
      },
      { new: true }
    );

    res.status(200).json(updatedTrainer);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "updateTrainerStudentsByUser Failed: ".concat(error.message),
    });
  }
};

exports.deleteTrainerStudentsByUser = async (req, res) => {
  const { trainerId } = req.params;
  const { studentId } = req.body;
  try {
    const idTrainer = stringToMongoId(trainerId);
    const idStudent = studentId;
    const trainer = await Trainers.findOne({ _id: idTrainer });
    if (trainer.students.includes(studentId))
      trainer.students = trainer.students.filter((student) => {
        if (idStudent !== student.toString()) return student;
        return;
      });

    const updatedTrainer = await Trainers.findOneAndUpdate(
      { _id: idTrainer },
      {
        students: trainer.students,
      },
      { new: true }
    );

    res.status(200).json(updatedTrainer);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "deleteTrainerStudentsByUser Failed: ".concat(error.message),
    });
  }
};

exports.deleteTrainerByUser = async (req, res) => {
  const { user } = req.params;
  try {
    const trainer = await Trainers.findOneAndDelete({ user: user });
    await Users.findOneAndDelete({ _id: user });
    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Delete Trainer Failed: ".concat(error.message),
    });
  }
};
