const Disease = require("../models/Disease");
const Farm = require("../models/Farm");
const Crop = require("../models/Crop");

const {
    analyzeCropImage
} = require("../services/geminiService");

const detectDisease = async (req, res) => {

    try {

        // Check if image was uploaded
         const { farmId, cropId } = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a crop image"
            });
        }

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

        const crop = await Crop.findOne({
            _id: cropId,
            farmId: farmId
        });

        if (!crop) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        console.log("Image received:");
        console.log("Original name:", req.file.originalname);
        console.log("MIME type:", req.file.mimetype);
        console.log("Size:", req.file.size);

        // Send image to Gemini
        const aiResult = await analyzeCropImage(
            req.file.buffer,
            req.file.mimetype
        );
        let cleanedResult = aiResult
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedResult = JSON.parse(cleanedResult);

        const diseaseRecord = await Disease.create({
            farmerId: req.userId,
            farmId: farmId,
            cropId: cropId,

            crop: parsedResult.crop,
            disease: parsedResult.disease,
            confidence: parsedResult.confidence,
            severity: parsedResult.severity,
            symptoms: parsedResult.symptoms,
            recommendation: parsedResult.recommendation
        });

        console.log("Gemini response:");
        console.log(aiResult);

        res.status(200).json({
            success: true,
            message: "Disease analysis completed",
            result: parsedResult
        });

    } catch (error) {

    console.error("================================");
    console.error("DISEASE DETECTION ERROR");
    console.error(error);
    console.error("================================");

    res.status(500).json({
        success: false,
        message: "Disease detection failed",
        error: error.message
    });
}
};

// GET DISEASE HISTORY FOR A CROP

const getDiseaseHistory = async (req, res) => {
    try {

        const { cropId } = req.params;

        // Find crop
        const crop = await Crop.findOne({
            _id: cropId
        });

        if (!crop) {
            return res.status(404).json({
                success: false,
                message: "Crop not found"
            });
        }

        // Make sure crop belongs to farmer's farm
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

        // Get disease history
        const diagnoses = await Disease.find({
            cropId: cropId,
            farmerId: req.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: diagnoses.length,
            diagnoses
        });

    } catch (error) {

        console.error("Get disease history error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get disease history"
        });
    }
};

module.exports = {
    detectDisease,
    getDiseaseHistory
};