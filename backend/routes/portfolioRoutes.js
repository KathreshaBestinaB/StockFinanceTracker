const express = require("express");
const router = express.Router();

const Portfolio = require("../models/Portfolio");
const authMiddleware = require("../middleware/authMiddleware");
const { fetchStockData } = require("../services/stockService");


// ADD STOCK
router.post("/", authMiddleware, async (req, res) => {

    try {

        console.log("REQ BODY:", req.body);
        console.log("REQ USER:", req.user);

        const { symbol, buyPrice, quantity } = req.body;

        const portfolio = new Portfolio({
            user: req.user.id,
            symbol,
            buyPrice,
            quantity
        });

        await portfolio.save();

        res.json({
            message: "Stock added",
            portfolio
        });

    } catch (error) {

        console.log("POST ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// GET PORTFOLIO
router.get("/", authMiddleware, async (req, res) => {

    try {

        console.log("USER ID:", req.user.id);

        const portfolio = await Portfolio.find({
            user: req.user.id
        });

        console.log("FOUND PORTFOLIO:", portfolio);

        let result = [];

        for (let stock of portfolio) {

            const liveData = await fetchStockData(stock.symbol);

            let currentPrice = 0;

            if (liveData && liveData.close) {
                currentPrice = parseFloat(liveData.close);
            }

            const investment = stock.buyPrice * stock.quantity;
            const currentValue = currentPrice * stock.quantity;
            const profitLoss = currentValue - investment;

            result.push({
                _id: stock._id,
                symbol: stock.symbol,
                buyPrice: stock.buyPrice,
                quantity: stock.quantity,
                currentPrice,
                investment,
                currentValue,
                profitLoss
            });
        }

        res.json(result);

    } catch (error) {

        console.log("GET ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// SUMMARY
router.get("/summary", authMiddleware, async (req, res) => {

    try {

        const portfolio = await Portfolio.find({
            user: req.user.id
        });

        let totalInvestment = 0;
        let totalCurrentValue = 0;

        for (let stock of portfolio) {

            const liveData = await fetchStockData(stock.symbol);

            let currentPrice = 0;

            if (liveData && liveData.close) {
                currentPrice = parseFloat(liveData.close);
            }

            const investment = stock.buyPrice * stock.quantity;
            const currentValue = currentPrice * stock.quantity;

            totalInvestment += investment;
            totalCurrentValue += currentValue;
        }

        const profitLoss = totalCurrentValue - totalInvestment;

        res.json({
            totalInvestment,
            totalCurrentValue,
            profitLoss
        });

    } catch (error) {

        console.log("SUMMARY ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const deletedStock = await Portfolio.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!deletedStock) {
            return res.status(404).json({
                message: "Stock not found"
            });
        }

        res.json({
            message: "Stock deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;