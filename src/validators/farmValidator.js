const { body } = require("express-validator");

const validateFarm = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Farm name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Farm name must be between 2 and 100 characters"),

    body("farmSize")
        .notEmpty()
        .withMessage("Farm size is required")
        .isFloat({ min: 0 })
        .withMessage("Farm size must be a positive number"),

    body("soilType")
        .trim()
        .notEmpty()
        .withMessage("Soil type is required"),

    body("irrigationType")
        .trim()
        .notEmpty()
        .withMessage("Irrigation type is required"),

    body("latitude")
        .notEmpty()
        .withMessage("Latitude is required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),

    body("longitude")
        .notEmpty()
        .withMessage("Longitude is required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180")
];

module.exports = validateFarm;