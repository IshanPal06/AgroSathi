const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
    {
        farmId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farm",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        variety: {
            type: String,
            trim: true
        },

        sowingDate: {
            type: Date,
            required: true
        },

        stage: {
            type: String,
            default: "Seedling"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Crop", cropSchema);