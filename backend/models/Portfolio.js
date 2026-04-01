const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  symbol: {
    type: String,
    required: true
  },

  buyPrice: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  }

});

module.exports = mongoose.model("Portfolio", portfolioSchema);