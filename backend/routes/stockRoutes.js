const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get('/trending', async (req, res) => {
  try {
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'AMZN', 'MSFT'];
    const results = [];

    for (const symbol of symbols) {
      try {
        const response = await axios.get('https://api.twelvedata.com/quote', {
          params: {
            symbol,
            apikey: process.env.STOCK_API_KEY
          }
        });

        console.log(symbol, response.data);

        if (!response.data || response.data.status === 'error') {
          continue;
        }

        results.push({
          symbol,
          price: parseFloat(response.data.close) || 0,
          change: parseFloat(response.data.percent_change) || 0
        });
      } catch (err) {
        console.log(`Error for ${symbol}:`, err.response?.data || err.message);
      }
    }

    res.json({ stocks: results });
  } catch (error) {
    console.error('Trending route error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch trending stocks' });
  }
});
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