const express = require("express");

const {
    createFarm,
    getFarms,
    getFarm,
    updateFarm,
    deleteFarm
} = require("../controllers/farmController");

const protect = require("../middleware/authMiddleware");
const validateFarm = require("../validators/farmValidator");
const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    validateFarm,
    validationMiddleware,
    createFarm
);

router.get("/", protect, getFarms);

router.get("/:id", protect, getFarm);

router.put(
    "/:id",
    protect,
    validateFarm,
    validationMiddleware,
    updateFarm
);

router.delete("/:id", protect, deleteFarm);

module.exports = router;