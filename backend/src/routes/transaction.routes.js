const express = require("express");
const { auth } = require("../middleware/auth");
const { issueBook, returnBook, listIssued, listBorrowers } = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/issue", auth, issueBook);
router.post("/return", auth, returnBook);
router.get("/issued", auth, listIssued);
router.get("/borrowers", auth, listBorrowers);

module.exports = { transactionRoutes: router };

