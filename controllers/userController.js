const { getUserDataCollection } = require("../models/userModel");

exports.createUser = async (req, res) => {
  const result = await getUserDataCollection().insertOne(req.body);
  res.send(result);
};

exports.getAllUsers = async (req, res) => {
  const result = await getUserDataCollection().find().toArray();
  res.send(result);
};
