const Students = require("../models/studentModel");
const Users = require("../models/userModel");
const Trainings = require("../models/trainingModel");
const { stringToMongoId } = require("../config/utils");

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Students.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Get All Students Failed: ".concat(error.message),
    });
  }
};

exports.getStudentBy = async (req, res) => {
  try {
    const search_field = Object.keys(req.query)[0];
    const search_value = Object.values(req.query)[0];
    const queryObj = {};

    if (search_field !== "" && search_value !== "") {
      queryObj[search_field] = search_value;
    }

    const student = await Students.findOne(queryObj).populate("trainers");

    if (!student) {
      return res.status(404).json({
        status: "failure",
        message: `Student with the given ${search_field}:${search_value} not found`,
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Student Search by Query Failed: ".concat(error.message),
    });
  }
};

exports.postStudent = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    address,
    status,
    dateOfBirth,
    user: id,
    trainers,
  } = req.body;
  try {
    let student = await Students.findOne({ user: id });
    if (student) return res.status(400).send("Student already registered.");

    const newStudent = new Students({
      firstName,
      lastName,
      email,
      address,
      status,
      dateOfBirth,
      user: stringToMongoId(id),
      trainers,
    });

    newStudent.save();
    res.status(200).json(newStudent);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Post Student Failed: ".concat(error.message),
    });
  }
};

exports.updateStudentByUser = async (req, res) => {
  const { user: userParams } = req.params;

  const { firstName, lastName, email, address, status, dateOfBirth, trainers } =
    req.body;
  try {
    const student = await Students.findOneAndUpdate(
      { user: userParams },
      {
        firstName,
        lastName,
        email,
        address,
        status,
        dateOfBirth,
        trainers,
      },
      { new: true }
    );

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Update Student Failed: ".concat(error.message),
    });
  }
};

exports.deleteStudentByUser = async (req, res) => {
  const { user } = req.params;
  try {
    const student = await Students.findOneAndDelete({ user: user });
    await Users.findOneAndDelete({ _id: user });
    await Trainings.deleteMany({ student: student._id });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Delete Student Failed: ".concat(error.message),
    });
  }
};
