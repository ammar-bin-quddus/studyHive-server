const { ObjectId } = require("mongodb");
const { getAssignmentsCollection } = require("../models/assignmentModel");

exports.getAllAssignments = async (req, res) => {
  const search = req.query.search || "";
  const level = req.query.level || "";
  const query = {};

  if (search) query.title = { $regex: search, $options: "i" };
  if (level) query.level = level;

  const result = await getAssignmentsCollection().find(query).toArray();
  res.send(result);
};

exports.getAssignmentById = async (req, res) => {
  const id = req.params.id;
  const result = await getAssignmentsCollection().findOne({ _id: new ObjectId(id) });
  res.send(result);
};

exports.createAssignment = async (req, res) => {
  const result = await getAssignmentsCollection().insertOne(req.body);
  res.send(result);
};

exports.updateAssignment = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updatedData = {
    $set: {
      photoUrl: req.body.photoUrl,
      title: req.body.title,
      description: req.body.description,
      marks: req.body.marks,
      dueDate: req.body.dueDate,
      level: req.body.level,
    },
  };
  const result = await getAssignmentsCollection().updateOne(filter, updatedData, options);
  res.send(result);
};

exports.deleteAssignment = async (req, res) => {
  const id = req.params.id;
  const result = await getAssignmentsCollection().deleteOne({ _id: new ObjectId(id) });
  res.send(result);
};
