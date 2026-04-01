const axios = require("axios");

const fetchStockData = async (symbol) => {

    try {

        const response = await axios.get(
            `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${process.env.TWELVE_API_KEY}`
        );

        return {
            symbol,
            close: response.data.price
        };

    } catch (error) {

        return null;
    }
};

module.exports = { fetchStockData };