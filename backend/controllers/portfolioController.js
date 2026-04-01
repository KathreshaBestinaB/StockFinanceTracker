const Portfolio = require("../models/Portfolio");


// ADD STOCK
const addStock = async (req, res) => {

  try {

    const { symbol, buyPrice, quantity } = req.body;

    if (!symbol || !buyPrice || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const stock = new Portfolio({
      symbol,
      buyPrice,
      quantity
    });

    await stock.save();

    res.json({
      message: "Stock added successfully",
      stock
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: error.message });

  }
};



// GET PORTFOLIO
const getPortfolio = async (req, res) => {

  try {

    const portfolio = await Portfolio.find();

    res.json(portfolio);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};



// DELETE STOCK
const deleteStock = async (req, res) => {

  try {

    await Portfolio.findByIdAndDelete(req.params.id);

    res.json({ message: "Stock deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};



// SUMMARY
const getSummary = async (req, res) => {

  try {

    const portfolio = await Portfolio.find();

    let totalInvestment = 0;
    let currentValue = 0;

    portfolio.forEach(stock => {

      totalInvestment += stock.buyPrice * stock.quantity;
      currentValue += stock.buyPrice * stock.quantity;

    });

    res.json({
      totalInvestment,
      currentValue,
      profitLoss: currentValue - totalInvestment
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};



module.exports = {
  addStock,
  getPortfolio,
  deleteStock,
  getSummary
};