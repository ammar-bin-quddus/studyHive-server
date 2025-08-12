let submittedAssignmentCollection;

function init(db) {
  submittedAssignmentCollection = db.collection("submittedAssignments");
}

function getSubmittedAssignmentCollection() {
  return submittedAssignmentCollection;
}

module.exports = { init, getSubmittedAssignmentCollection };
