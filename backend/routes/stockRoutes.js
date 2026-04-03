const express = require("express");
const axios = require("axios");
const router = express.Router();

// Use only 10 stocks for ticker
const tickerSymbols = [
  "AAPL",
  "TSLA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "META",
  "NFLX",
  "AMD",
  "BABA"
];

// cache
let tickerCache = {
  batch1: [],
  batch2: [],
  batch1FetchedAt: 0,
  batch2FetchedAt: 0
};

const TWO_MINUTES = 2 * 60 * 1000;
const ONE_MINUTE_DELAY = 65 * 1000;

async function fetchQuote(symbol) {
  const response = await axios.get(
    `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.STOCK_API_KEY}`
  );

  if (!response.data || response.data.status === "error") {
    throw new Error(response.data?.message || `Failed to fetch ${symbol}`);
  }

  return {
    symbol: response.data.symbol,
    price: Number(response.data.close),
    change: Number(response.data.change)
  };
}

async function fetchBatch(symbols) {
  const results = [];

  for (const symbol of symbols) {
    try {
      const data = await fetchQuote(symbol);
      results.push(data);
    } catch (error) {
      console.log(`Ticker fetch failed for ${symbol}:`, error.message);
    }
  }

  return results;
}

// ticker endpoint
router.get("/ticker", async (req, res) => {
  try {
    const now = Date.now();

    const first8 = tickerSymbols.slice(0, 8);
    const remaining2 = tickerSymbols.slice(8, 10);

    // fetch first batch immediately if empty or expired
    if (
      tickerCache.batch1.length === 0 ||
      now - tickerCache.batch1FetchedAt > TWO_MINUTES
    ) {
      console.log("Refreshing ticker batch 1...");
      tickerCache.batch1 = await fetchBatch(first8);
      tickerCache.batch1FetchedAt = now;

      // reset second batch whenever first batch refreshes
      tickerCache.batch2 = [];
      tickerCache.batch2FetchedAt = 0;
    }

    // fetch second batch only after ~1 minute from first batch fetch
    if (
      remaining2.length > 0 &&
      now - tickerCache.batch1FetchedAt > ONE_MINUTE_DELAY &&
      (
        tickerCache.batch2.length === 0 ||
        now - tickerCache.batch2FetchedAt > TWO_MINUTES
      )
    ) {
      console.log("Refreshing ticker batch 2...");
      tickerCache.batch2 = await fetchBatch(remaining2);
      tickerCache.batch2FetchedAt = now;
    }

    const combined = [...tickerCache.batch1, ...tickerCache.batch2];

    res.json({
      count: combined.length,
      data: combined
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching ticker data",
      error: error.message
    });
  }
});

// trending
router.get("/trending", async (req, res) => {
  try {
    const symbols = ["AAPL", "TSLA", "NVDA", "AMZN", "MSFT"];
    const results = [];

    for (const symbol of symbols) {
      try {
        const response = await axios.get("https://api.twelvedata.com/quote", {
          params: {
            symbol,
            apikey: process.env.STOCK_API_KEY
          }
        });

        console.log(symbol, response.data);

        if (!response.data || response.data.status === "error") {
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
    console.error("Trending route error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch trending stocks" });
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

// chart data
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

// current stock quote
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