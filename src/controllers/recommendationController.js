const Farm = require("../models/Farm");
const Crop = require("../models/Crop");
const Soil = require("../models/Soil");


// GET SMART RECOMMENDATION

const getRecommendation = async (req, res) => {

    try {

        const { farmId, cropId } = req.params;


        // --------------------------------
        // 1. CHECK FARM
        // --------------------------------

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


        // --------------------------------
        // 2. CHECK CROP
        // --------------------------------

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
        // --------------------------------
        // 3. GET SOIL DATA
        // --------------------------------

        const soil = await Soil.findOne({
            farmId: farmId
        });

        if (!soil) {
            return res.status(404).json({
            success: false,
            message: "Soil data not found for this farm"
            });
        }


        // --------------------------------
        // 3. BASIC WEATHER DATA
        // --------------------------------

        /*
            For now we will use the farm's
            location to get weather.

            We will connect this to your
            existing Open-Meteo service.
        */


        const latitude = farm.location.latitude;
        const longitude = farm.location.longitude;


        // --------------------------------
        // 4. FETCH WEATHER
        // --------------------------------

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,precipitation&daily=precipitation_probability_max&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather API failed");
        }

        const weather = await weatherResponse.json();


        // --------------------------------
        // 5. EXTRACT WEATHER
        // --------------------------------

        const temperature =
            weather.current?.temperature_2m;

        const humidity =
            weather.current?.relative_humidity_2m;

        const rain =
            weather.current?.rain || 0;

        const precipitationProbability =
            weather.daily?.precipitation_probability_max?.[0] || 0;


        // --------------------------------
        // 6. IRRIGATION ENGINE
        // --------------------------------

        let irrigationAction;
        let irrigationReason;


        // --------------------------------
        // 6. IRRIGATION ENGINE
        // --------------------------------



        // Soil already has enough moisture
        if (
            soil.moisture !== undefined &&
            soil.moisture >= 75
        ) {

            irrigationAction =
            "Skip irrigation for now";

            irrigationReason =
            "Soil moisture is already high.";


// Rain is expected
        } else if (
            precipitationProbability >= 60 ||
            rain > 0
        ) {

            irrigationAction =
            "Reduce or skip irrigation";

            irrigationReason =
            "Rain is expected or currently occurring.";


        // Soil is dry
        } else if (
    soil.moisture !== undefined &&
    soil.moisture < 30
) {

    irrigationAction =
        "Increase irrigation";

    irrigationReason =
        "Soil moisture is low and the crop may require additional water.";


// High temperature
} else if (temperature >= 35) {

    irrigationAction =
        "Increase irrigation monitoring";

    irrigationReason =
        "High temperature may increase crop water demand.";


// High humidity
} else if (humidity >= 80) {

    irrigationAction =
        "Use moderate irrigation";

    irrigationReason =
        "High humidity can reduce water loss.";


} else {

    irrigationAction =
        "Follow normal irrigation schedule";

    irrigationReason =
        "Soil moisture and weather conditions are within normal ranges.";
}


        // --------------------------------
// 7. FERTILIZER ENGINE
// --------------------------------

let fertilizerAction;
let fertilizerReason;


// Low nitrogen
if (
    soil.nitrogen !== undefined &&
    soil.nitrogen < 40
) {

    fertilizerAction =
        "Consider nitrogen-rich fertilizer.";

    fertilizerReason =
        "Soil nitrogen level is low and may limit crop growth.";


// Low phosphorus
} else if (
    soil.phosphorus !== undefined &&
    soil.phosphorus < 20
) {

    fertilizerAction =
        "Consider phosphorus-rich fertilizer.";

    fertilizerReason =
        "Soil phosphorus level is low and may affect root and flower development.";


// Low potassium
} else if (
    soil.potassium !== undefined &&
    soil.potassium < 100
) {

    fertilizerAction =
        "Consider potassium-rich fertilizer.";

    fertilizerReason =
        "Soil potassium level is low and may affect crop strength and fruit development.";


// Nutrients look okay → use crop stage
} else {

    switch (crop.stage?.toLowerCase()) {

        case "seedling":

            fertilizerAction =
                "Use a light starter fertilizer.";

            fertilizerReason =
                "Young plants require nutrients for early root and leaf development.";

            break;


        case "vegetative":

            fertilizerAction =
                "Consider nitrogen-rich fertilizer.";

            fertilizerReason =
                "Vegetative growth requires adequate nitrogen.";

            break;


        case "flowering":

            fertilizerAction =
                "Use a balanced fertilizer with adequate phosphorus and potassium.";

            fertilizerReason =
                "Flowering crops require nutrients that support flowering and fruit development.";

            break;


        case "fruiting":

            fertilizerAction =
                "Prioritize potassium-rich fertilizer.";

            fertilizerReason =
                "Potassium supports fruit development and quality.";

            break;


        default:

            fertilizerAction =
                "Follow the crop-specific fertilizer schedule.";

            fertilizerReason =
                "Crop stage information is insufficient for a more specific recommendation.";
    }
}

        // --------------------------------
        // 8. RESPONSE
        // --------------------------------

        res.status(200).json({

            success: true,

            farm: {
                id: farm._id,
                name: farm.name
            },

            crop: {
                id: crop._id,
                name: crop.name,
                stage: crop.stage
            },
            soil: {
    ph: soil.ph,
    nitrogen: soil.nitrogen,
    phosphorus: soil.phosphorus,
    potassium: soil.potassium,
    organicCarbon: soil.organicCarbon,
    moisture: soil.moisture
},

            weather: {
                temperature,
                humidity,
                rain,
                precipitationProbability
            },

            recommendation: {

                irrigation: {
                    action: irrigationAction,
                    reason: irrigationReason
                },

                fertilizer: {
                    action: fertilizerAction,
                    reason: fertilizerReason
                }

            }

        });


    } catch (error) {

        console.error(
            "Recommendation error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to generate recommendation"
        });
    }
};


module.exports = {
    getRecommendation
};