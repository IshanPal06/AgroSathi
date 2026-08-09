const { sendSMS } = require("../services/smsService");

const sendFarmerSMS = async (req, res) => {
    try {
        const {
            phone,
            message
        } = req.body;

        if (!phone || !message) {
            return res.status(400).json({
                success: false,
                message: "phone and message are required"
            });
        }

        const result = await sendSMS(phone, message);

        res.status(200).json({
            success: true,
            message: "SMS sent successfully",
            result
        });

    } catch (error) {
        console.error("Communication error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send SMS",
            error: error.response?.data || error.message
        });
    }
};

module.exports = {
    sendFarmerSMS
};