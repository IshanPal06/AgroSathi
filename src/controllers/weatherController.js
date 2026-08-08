const axios = require("axios");
const Farm = require("../models/Farm");

// GET WEATHER FOR FARM

const getWeather = async (req, res) => {
    try {
        const farmId = req.params.farmId;

        // 1. Check if farm belongs to logged-in farmer
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

        // 2. Get farm coordinates
        const { latitude, longitude } = farm.location;

        // 3. Check coordinates
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: "Farm location is missing"
            });
        }

        // 4. Call Open-Meteo
        const response = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: latitude,
                    longitude: longitude,

                    current: [
                        "temperature_2m",
                        "relative_humidity_2m",
                        "rain",
                        "wind_speed_10m",
                        "weather_code"
                    ].join(","),

                    hourly: [
                        "temperature_2m",
                        "precipitation_probability",
                        "precipitation"
                    ].join(","),

                    daily: [
                        "temperature_2m_max",
                        "temperature_2m_min",
                        "precipitation_sum",
                        "precipitation_probability_max"
                    ].join(","),

                    timezone: "auto"
                }
            }
        );

        // 5. Send useful data to frontend
        res.status(200).json({
            success: true,

            farmId: farmId,

            location: {
                latitude,
                longitude
            },

            current: response.data.current,

            hourly: response.data.hourly,

            daily: response.data.daily
        });

    } catch (error) {
        console.error(
            "Weather API error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch weather data"
        });
    }
};

module.exports = {
    getWeather
};