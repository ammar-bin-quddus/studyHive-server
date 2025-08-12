let userDataCollection;

function init(db) {
  userDataCollection = db.collection("userDb");
}

function getUserDataCollection() {
  return userDataCollection;
}

module.exports = { init, getUserDataCollection };
