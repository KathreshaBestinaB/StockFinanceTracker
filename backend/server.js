require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);

app.get("/", (req, res) => {
    res.send("Finance Tracker API Running");
});

const portfolioRoutes = require("./routes/portfolioRoutes");

app.use("/api/portfolio", portfolioRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});