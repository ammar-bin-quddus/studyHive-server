const { ObjectId } = require("mongodb");
const { getSubmittedAssignmentCollection } = require("../models/submissionModel");

exports.getAllSubmissions = async (req, res) => {
  const result = await getSubmittedAssignmentCollection().find().toArray();
  res.send(result);
};

exports.getSubmissionsByEmail = async (req, res) => {
  const { email } = req.query;
      const result = await getSubmittedAssignmentCollection()
        .find({ examineeEmail: email })
        .toArray();
      res.send(result);
};

exports.createSubmission = async (req, res) => {
  const result = await getSubmittedAssignmentCollection().insertOne(req.body);
  res.send(result);
};

exports.updateSubmissionMarks = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  const result = await getSubmittedAssignmentCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  res.send(result);
};
