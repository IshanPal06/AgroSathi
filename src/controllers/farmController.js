const Farm = require("../models/Farm");


// =========================
// CREATE FARM
// =========================

const createFarm = async (req, res) => {
    try {
        const {
            name,
            farmSize,
            soilType,
            irrigationType,
            latitude,
            longitude
        } = req.body;

        if (
            !name ||
            farmSize === undefined ||
            !soilType ||
            !irrigationType ||
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All farm fields are required"
            });
        }

        const farm = await Farm.create({
            farmerId: req.userId,
            name,
            farmSize,
            soilType,
            irrigationType,
            location: {
                latitude,
                longitude
            }
        });

        res.status(201).json({
            success: true,
            message: "Farm created successfully",
            farm
        });

    } catch (error) {
        console.error("Create farm error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// GET ALL FARMS OF FARMER
// =========================

const getFarms = async (req, res) => {
    try {
        const farms = await Farm.find({
            farmerId: req.userId
        });

        res.status(200).json({
            success: true,
            count: farms.length,
            farms
        });

    } catch (error) {
        console.error("Get farms error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// GET SINGLE FARM
// =========================

const getFarm = async (req, res) => {
    try {
        const farm = await Farm.findOne({
            _id: req.params.id,
            farmerId: req.userId
        });

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found"
            });
        }

        res.status(200).json({
            success: true,
            farm
        });

    } catch (error) {
        console.error("Get farm error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// UPDATE FARM
// =========================

const updateFarm = async (req, res) => {
    try {
        const farm = await Farm.findOneAndUpdate(
            {
                _id: req.params.id,
                farmerId: req.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Farm updated successfully",
            farm
        });

    } catch (error) {
        console.error("Update farm error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// DELETE FARM
// =========================

const deleteFarm = async (req, res) => {
    try {
        const farm = await Farm.findOneAndDelete({
            _id: req.params.id,
            farmerId: req.userId
        });

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Farm deleted successfully"
        });

    } catch (error) {
        console.error("Delete farm error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createFarm,
    getFarms,
    getFarm,
    updateFarm,
    deleteFarm
};