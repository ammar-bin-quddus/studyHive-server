const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/jwt", authController.createJWT);

module.exports = router;
