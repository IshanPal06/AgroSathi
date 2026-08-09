const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        farmId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farm",
            required: true
        },

        cropId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crop",
            required: true
        },

        crop: {
            type: String,
            required: true
        },

        disease: {
            type: String,
            required: true
        },

        confidence: {
            type: Number,
            required: true
        },

        severity: {
            type: String,
            required: true
        },

        symptoms: {
            type: [String],
            default: []
        },

        recommendation: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Disease", diseaseSchema);