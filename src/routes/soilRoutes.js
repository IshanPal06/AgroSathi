const express = require("express");

const {
    createSoil,
    getSoil,
    updateSoil
} = require("../controllers/soilController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createSoil);

router.get("/:farmId", protect, getSoil);

router.put("/:id", protect, updateSoil);

module.exports = router;