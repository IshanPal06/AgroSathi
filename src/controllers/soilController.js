const Soil = require("../models/Soil");
const Farm = require("../models/Farm");

// CREATE / UPDATE SOIL DATA

const createSoil = async (req, res) => {
    try {
        const {
            farmId,
            ph,
            nitrogen,
            phosphorus,
            potassium,
            organicCarbon,
            moisture
        } = req.body;

        if (!farmId) {
            return res.status(400).json({
                success: false,
                message: "farmId is required"
            });
        }

        // Check that the farm belongs to the logged-in farmer
        const farm = await Farm.findOne({
            _id: farmId,
            farmerId: req.userId
        });

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found"
            });
        }

        const soil = await Soil.findOneAndUpdate(
            { farmId },
            {
                farmId,
                ph,
                nitrogen,
                phosphorus,
                potassium,
                organicCarbon,
                moisture
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Soil data saved successfully",
            soil
        });

    } catch (error) {
        console.error("Create soil error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET SOIL DATA FOR FARM

const getSoil = async (req, res) => {
    try {
        const farmId = req.params.farmId;

        // Check farm ownership
        const farm = await Farm.findOne({
            _id: farmId,
            farmerId: req.userId
        });

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found"
            });
        }

        const soil = await Soil.findOne({
            farmId
        });

        if (!soil) {
            return res.status(404).json({
                success: false,
                message: "Soil data not found"
            });
        }

        res.status(200).json({
            success: true,
            soil
        });

    } catch (error) {
        console.error("Get soil error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// UPDATE SOIL DATA

const updateSoil = async (req, res) => {
    try {
        const soil = await Soil.findById(req.params.id);

        if (!soil) {
            return res.status(404).json({
                success: false,
                message: "Soil data not found"
            });
        }

        // Check that the soil belongs to a farm owned by the farmer
        const farm = await Farm.findOne({
            _id: soil.farmId,
            farmerId: req.userId
        });

        if (!farm) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        Object.assign(soil, req.body);

        await soil.save();

        res.status(200).json({
            success: true,
            message: "Soil data updated successfully",
            soil
        });

    } catch (error) {
        console.error("Update soil error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createSoil,
    getSoil,
    updateSoil
};