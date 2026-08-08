const express = require("express");

const {
    createFarm,
    getFarms,
    getFarm,
    updateFarm,
    deleteFarm
} = require("../controllers/farmController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createFarm);

router.get("/", protect, getFarms);

router.get("/:id", protect, getFarm);

router.put("/:id", protect, updateFarm);

router.delete("/:id", protect, deleteFarm);

module.exports = router;