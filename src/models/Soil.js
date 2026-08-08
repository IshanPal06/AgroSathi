const mongoose = require("mongoose");

const soilSchema = new mongoose.Schema(
    {
        farmId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farm",
            required: true
        },

        ph: {
            type: Number,
            min: 0,
            max: 14
        },

        nitrogen: {
            type: Number,
            min: 0
        },

        phosphorus: {
            type: Number,
            min: 0
        },

        potassium: {
            type: Number,
            min: 0
        },

        organicCarbon: {
            type: Number,
            min: 0
        },

        moisture: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Soil", soilSchema);``