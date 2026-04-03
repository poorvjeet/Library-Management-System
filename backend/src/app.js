const express = require("express");
const cors = require("cors");
const { authRoutes } = require("./routes/auth.routes");
const { bookRoutes } = require("./routes/book.routes");
const { memberRoutes } = require("./routes/member.routes");
const { transactionRoutes } = require("./routes/transaction.routes");
const { dashboardRoutes } = require("./routes/dashboard.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: false
  })
);
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use(authRoutes);
app.use(bookRoutes);
app.use(memberRoutes);
app.use(transactionRoutes);
app.use(dashboardRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// global error handler
app.use(errorHandler);

module.exports = { app };

