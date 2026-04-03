const express = require("express");
const { auth } = require("../middleware/auth");
const { listBooks, createBook } = require("../controllers/book.controller");

const router = express.Router();

router.get("/books", auth, listBooks);
router.post("/books", auth, createBook);
router.put("/books/:id", auth, updateBook);
router.delete("/books/:id", auth, deleteBook);

module.exports = { bookRoutes: router };

