const mongoose = require("mongoose");

function stringToMongoId(id) {
  return new mongoose.Types.ObjectId(id);
}

function arrayOfStringsToMongoIds(arrayOfIds) {
  return arrayOfIds.filter((id) => new mongoose.Types.ObjectId(id));
}

module.exports = { stringToMongoId, arrayOfStringsToMongoIds };
