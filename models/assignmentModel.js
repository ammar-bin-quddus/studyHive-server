let assignmentsCollection;

function init(db) {
  assignmentsCollection = db.collection("assignments");
}

function getAssignmentsCollection() {
  return assignmentsCollection;
}

module.exports = { init, getAssignmentsCollection };
