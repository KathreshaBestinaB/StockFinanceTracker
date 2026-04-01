const express = require("express");
const axios = require("axios");
const router = express.Router();

// search keyword
router.get("/search/:keyword", async (req, res) => {
    try {
        const keyword = req.params.keyword;

        const response = await axios.get(
            `https://api.twelvedata.com/symbol_search?symbol=${keyword}&apikey=${process.env.STOCK_API_KEY}`
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching stock suggestions",
            error: error.message
        });
    }
});


// Historical chart data
router.get("/chart/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol;

        const response = await axios.get(
            `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=7&apikey=${process.env.STOCK_API_KEY}`
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching chart data",
            error: error.message
        });
    }
});

// Current stock quote
router.get("/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol;

        const response = await axios.get(
            `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.STOCK_API_KEY}`
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching stock",
            error: error.message
        });
    }
});

module.exports = router;