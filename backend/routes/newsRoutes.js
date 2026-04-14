const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');

const newsCache = new NodeCache({ stdTTL: 7200 });

function normalizeArticles(items = []) {
  return items.map((item) => ({
    title: item.title,
    description: item.description,
    source: item.source,
    published_at: item.published_at,
    url: item.url,
    image_url: item.image_url,
    sentiment: item.sentiment
  }));
}

function removeDuplicates(articles) {
  const seen = new Set();
  return articles.filter((article) => {
    const key = article.url || article.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// General market news for welcome page
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'general_news_9';
    const cachedNews = newsCache.get(cacheKey);

    if (cachedNews) {
      console.log('Serving from cache:', cacheKey);
      return res.json(cachedNews);
    }

    console.log('Fetching fresh news:', cacheKey);

    let allArticles = [];

    const firstResponse = await axios.get('https://api.marketaux.com/v1/news/all', {
      params: {
        api_token: process.env.MARKETAUX_API_KEY,
        language: 'en',
        limit: 10,
        countries: 'us,in,gb',
        page: 1
      }
    });

    allArticles = allArticles.concat(normalizeArticles(firstResponse.data.data));
    allArticles = removeDuplicates(allArticles);

    if (allArticles.length < 9) {
      const secondResponse = await axios.get('https://api.marketaux.com/v1/news/all', {
        params: {
          api_token: process.env.MARKETAUX_API_KEY,
          language: 'en',
          limit: 10,
          countries: 'us,in,gb',
          page: 2
        }
      });

      allArticles = allArticles.concat(normalizeArticles(secondResponse.data.data));
      allArticles = removeDuplicates(allArticles);
    }

    if (allArticles.length < 9) {
      const thirdResponse = await axios.get('https://api.marketaux.com/v1/news/all', {
        params: {
          api_token: process.env.MARKETAUX_API_KEY,
          language: 'en',
          limit: 10,
          countries: 'us,in,gb',
          page: 3
        }
      });

      allArticles = allArticles.concat(normalizeArticles(thirdResponse.data.data));
      allArticles = removeDuplicates(allArticles);
    }

    const result = {
      articles: allArticles.slice(0, 9)
    };

    newsCache.set(cacheKey, result, 7200);
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
      articles: normalizeArticles(response.data.data || [])
    };

    newsCache.set(cacheKey, result, 600);
    res.json(result);
  } catch (error) {
    console.error('Stock news error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch stock news' });
  }
});


module.exports = router;