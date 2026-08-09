const express = require("express");

const {
    sendFarmerSMS
} = require("../controllers/communicationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/sms", protect, sendFarmerSMS);

module.exports = router;