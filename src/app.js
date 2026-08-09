const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const farmRoutes = require("./routes/farmRoutes");
const cropRoutes = require("./routes/cropRoutes");
const soilRoutes = require("./routes/soilRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const marketRoutes = require("./routes/marketRoutes");
const communicationRoutes = require("./routes/communicationRoutes");

const app = express()
app.use(helmet());

app.use(cors())
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

app.get("/api/health", (req, res) =>{
    res.status(200).json({
        success: true,
        message: "Smart Farm API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/disease", diseaseRoutes);
app.use(
    "/api/recommendations",
    recommendationRoutes
);
app.use("/api/market", marketRoutes);
app.use("/api/communication", communicationRoutes);

module.exports = app;
