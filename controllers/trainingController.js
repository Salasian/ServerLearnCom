const Trainings = require("../models/trainingModel");
const {
  stringToMongoId,
  arrayOfStringsToMongoIds,
} = require("../config/utils");

exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Trainings.find()
      .populate("student")
      .populate("trainers");
    res.status(200).json(trainings);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Get All Training Failed: ".concat(error.message),
    });
  }
};

exports.getTrainingsBy = async (req, res) => {
  try {
    const search_field = Object.keys(req.query)[0];
    const search_value = Object.values(req.query)[0];
    const queryObj = {};

    if (search_field !== "" && search_value !== "") {
      queryObj[search_field] = search_value;
    }

    const training = await Trainings.findOne(queryObj)
      .populate("student")
      .populate("trainers");

    if (!training) {
      return res.status(404).json({
        status: "failure",
        message: `Training with the given ${search_field}:${search_value} not found`,
      });
    }

    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Training Search by Query Failed: ".concat(error.message),
    });
  }
};

exports.getAllTrainingsByStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const trainings = await Trainings.find({ student: studentId })
      .populate("student")
      .populate("trainers");
    res.status(200).json(trainings);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "All Trainings Search by Student ID Failed: ".concat(
        error.message
      ),
    });
  }
};

exports.getAllTrainingsByTrainer = async (req, res) => {
  const { trainerId } = req.params;
  try {
    const trainings = await Trainings.find({ trainers: trainerId })
      .populate("student")
      .populate("trainers");
    res.status(200).json(trainings);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "All Trainings Search by Trainer ID Failed: ".concat(
        error.message
      ),
    });
  }
};

exports.postTraining = async (req, res) => {
  const {
    startDate,
    name,
    type,
    participant,
    duration,
    description,
    student,
    trainers,
  } = req.body;

  try {
    let training = await Trainings.findOne({ name: name });
    if (training)
      return res.status(400).send("Trainings name already registered.");
    const newTraining = new Trainings({
      startDate,
      name,
      type,
      participant,
      description,
      duration,
      student: stringToMongoId(student),
      trainers,
    });

    newTraining.save();
    res.status(200).json(newTraining);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Post Training Failed: ".concat(error.message),
    });
  }
};

exports.updateTrainingByName = async (req, res) => {
  const { name: nameParams } = req.params;
  const { startDate, name, type, participant, duration, student, trainers } =
    req.body;

  try {
    const training = await Trainings.findOneAndUpdate(
      { name: nameParams },
      {
        startDate,
        name,
        type,
        participant,
        duration,
        student: stringToMongoId(student),
        trainers: arrayOfStringsToMongoIds(trainers),
      },
      { new: true }
    );

    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Update Training Failed: ".concat(error.message),
    });
  }
};

exports.deleteTrainingByName = async (req, res) => {
  const { name } = req.params;
  try {
    const training = await Trainings.findOneAndDelete({ name: name });
    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Delete Training Failed: ".concat(error.message),
    });
  }
};
