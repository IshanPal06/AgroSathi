const axios = require("axios");

const getMarketPrices = async (req, res) => {

    try {

        const {
            commodity,
            state,
            district,
            market
        } = req.query;

        if (!commodity) {
            return res.status(400).json({
                success: false,
                message: "commodity query parameter is required"
            });
        }

        const apiUrl =
            "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

        const params = {
            "api-key": process.env.DATA_GOV_API_KEY,
            format: "json",
            limit: 50,
            "filters[commodity]": commodity
        };

        if (state) {
            params["filters[state]"] = state;
        }

        if (district) {
            params["filters[district]"] = district;
        }

        if (market) {
            params["filters[market]"] = market;
        }

        const response = await axios.get(apiUrl, { params });

        const records = response.data.records || [];

        res.status(200).json({
            success: true,
            count: records.length,
            commodity,
            filters: {
                state: state || null,
                district: district || null,
                market: market || null
            },
            prices: records
        });

    } catch (error) {

        console.error(
            "Market API error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch market prices"
        });
    }
};

// ========================================
// FIND BEST MARKET
// ========================================

const getBestMarket = async (req, res) => {

    try {

        const {
            commodity,
            state
        } = req.query;


        // Commodity is required

        if (!commodity) {

            return res.status(400).json({
                success: false,
                message: "commodity query parameter is required"
            });

        }


        // Government API URL

        const apiUrl =
            "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";


        // API parameters

        const params = {

            "api-key": process.env.DATA_GOV_API_KEY,

            format: "json",

            limit: 100,

            "filters[commodity]": commodity

        };


        // Optional state filter

        if (state) {

            params["filters[state]"] = state;

        }


        // Call Government API

        const response = await axios.get(
            apiUrl,
            { params }
        );


        const records = response.data.records || [];


        // No data found

        if (records.length === 0) {

            return res.status(404).json({
                success: false,
                message: "No market data found"
            });

        }


        // Convert prices to numbers

        const validRecords = records
            .map(record => {

                return {
                    ...record,

                    modal_price: Number(record.modal_price),

                    min_price: Number(record.min_price),

                    max_price: Number(record.max_price)

                };

            })
            .filter(record =>
                !isNaN(record.modal_price)
            );


        // No valid prices

        if (validRecords.length === 0) {

            return res.status(404).json({
                success: false,
                message: "No valid market prices found"
            });

        }


        // Find market with highest modal price

        const bestMarket = validRecords.reduce(
            (best, current) => {

                if (
                    current.modal_price >
                    best.modal_price
                ) {

                    return current;

                }

                return best;

            }
        );


        // Find market with lowest modal price

        const lowestMarket = validRecords.reduce(
            (lowest, current) => {

                if (
                    current.modal_price <
                    lowest.modal_price
                ) {

                    return current;

                }

                return lowest;

            }
        );


        // Difference between highest and lowest price

        const priceDifference =
            bestMarket.modal_price -
            lowestMarket.modal_price;


        // Farmer-friendly recommendation

        const recommendation =
            `For ${commodity}, ${bestMarket.market} has the highest modal price of ₹${bestMarket.modal_price}.`;


        // Send response

        res.status(200).json({

            success: true,

            commodity,

            state: state || null,

            recommendation,


            bestMarket: {

                market: bestMarket.market,

                district: bestMarket.district,

                state: bestMarket.state,

                modalPrice: bestMarket.modal_price,

                minPrice: bestMarket.min_price,

                maxPrice: bestMarket.max_price,

                arrivalDate: bestMarket.arrival_date

            },


            lowestMarket: {

                market: lowestMarket.market,

                district: lowestMarket.district,

                state: lowestMarket.state,

                modalPrice: lowestMarket.modal_price

            },


            priceDifference

        });


    } catch (error) {

        console.error(
            "Best market error:",
            error.response?.data || error.message
        );


        res.status(500).json({

            success: false,

            message: "Failed to find best market"

        });

    }

};

module.exports = {
    getMarketPrices,
    getBestMarket
};