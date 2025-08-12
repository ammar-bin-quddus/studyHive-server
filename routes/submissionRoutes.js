const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, submissionController.getAllSubmissions);
router.get("/attempted-assignments", verifyToken, submissionController.getSubmissionsByEmail);
router.post("/", submissionController.createSubmission);
router.patch("/marks/:id", verifyToken, submissionController.updateSubmissionMarks);

module.exports = router;
