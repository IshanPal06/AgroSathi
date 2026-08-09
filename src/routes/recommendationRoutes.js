const express = require("express");

const {
    getRecommendation
} = require("../controllers/recommendationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


router.get(
    "/:farmId/:cropId",
    protect,
    getRecommendation
);


module.exports = router;