const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        location: {
            district: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            }
        },

        role: {
            type: String,
            default: "farmer"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);