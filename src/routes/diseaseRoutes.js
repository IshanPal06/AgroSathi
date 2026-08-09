const express = require("express");

const {
    detectDisease,
    getDiseaseHistory
} = require("../controllers/diseaseController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/detect",
    protect,
    upload.single("image"),
    detectDisease
);

router.get(
    "/crop/:cropId",
    protect,
    getDiseaseHistory
);

module.exports = router;