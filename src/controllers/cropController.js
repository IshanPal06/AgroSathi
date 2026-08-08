const Crop = require("../models/Crop");
const Farm = require("../models/Farm");


// CREATE CROP

const createCrop = async (req, res) => {
    try {
        const {
            farmId,
            name,
            variety,
            sowingDate,
            stage
        } = req.body;

        if (!farmId || !name || !sowingDate) {
            return res.status(400).json({
                success: false,
                message: "farmId, name and sowingDate are required"
            });
        }

        // Make sure farm belongs to logged-in farmer
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

        const crop = await Crop.create({
            farmId,
            name,
            variety,
            sowingDate,
            stage
        });

        res.status(201).json({
            success: true,
            message: "Crop created successfully",
            crop
        });

    } catch (error) {
        console.error("Create crop error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET CROPS FOR FARM

const getCrops = async (req, res) => {
    try {
        const farm = await Farm.findOne({
            _id: req.params.farmId,
            farmerId: req.userId
        });

        if (!farm) {
            return res.status(404).json({
                success: false,
                message: "Farm not found"
            });
        }

        const crops = await Crop.find({
            farmId: req.params.farmId
        });

        res.status(200).json({
            success: true,
            count: crops.length,
            crops
        });

    } catch (error) {
        console.error("Get crops error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// UPDATE CROP

const updateCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        const farm = await Farm.findOne({
            _id: crop.farmId,
            farmerId: req.userId
        });

        if (!farm) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        Object.assign(crop, req.body);

        await crop.save();

        res.status(200).json({
            success: true,
            message: "Crop updated successfully",
            crop
        });

    } catch (error) {
        console.error("Update crop error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createCrop,
    getCrops,
    updateCrop
};