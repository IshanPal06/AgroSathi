const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        farmSize: {
            type: Number,
            required: true,
            min: 0
        },

        soilType: {
            type: String,
            required: true
        },

        irrigationType: {
            type: String,
            required: true
        },

        location: {
            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Farm", farmSchema);