const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", assignmentController.getAllAssignments);
router.get("/:id", verifyToken, assignmentController.getAssignmentById);
router.post("/", assignmentController.createAssignment);
router.put("/:id", verifyToken, assignmentController.updateAssignment);
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;
