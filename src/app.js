const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const farmRoutes = require("./routes/farmRoutes");
const cropRoutes = require("./routes/cropRoutes");
const soilRoutes = require("./routes/soilRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const marketRoutes = require("./routes/marketRoutes");

const app = express()

app.use(cors())
app.use(express.json());

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

module.exports = app;
