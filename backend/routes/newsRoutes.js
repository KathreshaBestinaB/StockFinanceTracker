const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');

const newsCache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

// General market news
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'general_news';
const cachedNews = newsCache.get(cacheKey);

if (cachedNews) {
  console.log('Serving from cache:', cacheKey);
  return res.json(cachedNews);
}

console.log('Fetching fresh news:', cacheKey);

    const response = await axios.get('https://api.marketaux.com/v1/news/all', {
      params: {
        api_token: process.env.MARKETAUX_API_KEY,
        language: 'en',
        limit: 8
      }
    });

    const result = {
      articles: (response.data.data || []).map((item) => ({
        title: item.title,
        description: item.description,
        source: item.source,
        published_at: item.published_at,
        url: item.url,
        image_url: item.image_url,
        sentiment: item.sentiment
      }))
    };

    newsCache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('General news error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch general news' });
  }

  
});

// Symbol-based stock news
router.get('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
const cacheKey = `stock_news_${symbol}`;
const cachedNews = newsCache.get(cacheKey);

if (cachedNews) {
  console.log('Serving from cache:', cacheKey);
  return res.json(cachedNews);
}

console.log('Fetching fresh news:', cacheKey);
    const response = await axios.get('https://api.marketaux.com/v1/news/all', {
      params: {
        api_token: process.env.MARKETAUX_API_KEY,
        symbols: symbol,
        language: 'en',
        limit: 8
      }
    });

    const result = {
      symbol,
      articles: (response.data.data || []).map((item) => ({
        title: item.title,
        description: item.description,
        source: item.source,
        published_at: item.published_at,
        url: item.url,
        image_url: item.image_url,
        sentiment: item.sentiment
      }))
    };

    newsCache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Stock news error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch stock news' });
  }
});

module.exports = router;