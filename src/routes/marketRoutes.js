const express = require("express");

const {
    getMarketPrices,
    getBestMarket
} = require("../controllers/marketController");

const protect = require("../middleware/authMiddleware");



const router = express.Router();

router.get(
    "/prices",
    protect,
    getMarketPrices
);

router.get(
    "/best",
    protect,
    getBestMarket
);

module.exports = router;