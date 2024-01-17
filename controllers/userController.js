const Users = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.send(users);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Get All Users Failed".concat(error.message),
    });
  }
};

exports.getUserBy = async (req, res) => {
  try {
    const search_field = Object.keys(req.query)[0];
    const search_value = Object.values(req.query)[0];

    const queryObj = {};

    if (search_field !== "" && search_value !== "") {
      queryObj[search_field] = search_value;
    }

    const user = await Users.findOne(queryObj);

    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: `User with the given ${search_field}:${search_value} not found`,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Get User By Failed".concat(error.message),
    });
  }
};

exports.postUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    let user = await Users.findOne({ username });
    if (user) return res.status(400).send("Username already registered.");

    const newUser = new Users({ username, password, role });

    newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "User creation Failed".concat(error.message),
    });
  }
};

exports.deleteUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await Users.findOneAndDelete({ username: username });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "User delete Failed".concat(error.message),
    });
  }
};

exports.updateUserByUsername = async (req, res) => {
  const { username: usernameParams } = req.params;
  const { username, password, role } = req.body;

  try {
    const user = await Users.findOneAndUpdate(
      { username: usernameParams },
      { username, password, role },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "User update Failed".concat(error.message),
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.query;
  try {
    const userAccepted = await Users.findOne({
      username: username,
      password: password,
    });
    if (userAccepted === null) {
      res.status(400).send("Invalid Credentials");
    } else {
      res.status(200).json(userAccepted);
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      error: "Login Failed".concat(error.message),
    });
  }
};
