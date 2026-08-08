const express = require("express");

const {
    createCrop,
    getCrops,
    updateCrop
} = require("../controllers/cropController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createCrop);

router.get("/:farmId", protect, getCrops);

router.put("/:id", protect, updateCrop);

module.exports = router;