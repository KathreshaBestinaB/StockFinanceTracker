const { fetchStockData } = require("../services/stockService");

const getStock = async (req, res) => {
    try {
        const symbol = req.params.symbol;

        const data = await fetchStockData(symbol);

        if (!data["Global Quote"]) {
            return res.status(404).json({
                message: "Stock not found"
            });
        }

        res.json(data["Global Quote"]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getStock };