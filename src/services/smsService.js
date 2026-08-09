const axios = require("axios");

const sendSMS = async (to, message) => {
    try {
        const apiKey = process.env.EXOTEL_API_KEY;
        const apiToken = process.env.EXOTEL_API_TOKEN;
        const sid = process.env.EXOTEL_SID;
        const subdomain = process.env.EXOTEL_SUBDOMAIN;
        const from = process.env.EXOTEL_FROM;

        if (!apiKey || !apiToken || !sid || !subdomain || !from) {
            throw new Error("Exotel environment variables are missing");
        }

        const url =
            `https://${apiKey}:${apiToken}${subdomain}` +
            `/v1/Accounts/${sid}/Sms/send`;

        const params = new URLSearchParams();

        params.append("From", from);
        params.append("To", to);
        params.append("Body", message);

        const response = await axios.post(
            url,
            params.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "SMS sending error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports = {
    sendSMS
};