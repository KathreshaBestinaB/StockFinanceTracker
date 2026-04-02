const express = require("express");
const router = express.Router();

const Watchlist = require("../models/Watchlist");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { symbol, companyName } = req.body;

    const existing = await Watchlist.findOne({
      user: req.user.id,
      symbol
    });

    if (existing) {
      return res.status(400).json({
        message: "Stock already in watchlist"
      });
    }

    const item = new Watchlist({
      user: req.user.id,
      symbol,
      companyName
    });

    await item.save();

    res.json({
      message: "Added to watchlist",
      item
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Watchlist.find({
      user: req.user.id
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Watchlist item not found"
      });
    }

    res.json({
      message: "Removed from watchlist"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;