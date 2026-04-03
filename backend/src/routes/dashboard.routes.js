const express = require("express");
const { auth } = require("../middleware/auth");
const { summary } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/dashboard/summary", auth, summary);

module.exports = { dashboardRoutes: router };

