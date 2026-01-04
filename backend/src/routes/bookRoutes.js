const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

/**
 * Health
 */
router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

/**
 * CREATE: Add a book
 * POST /api/books
 */
router.post("/books", async (req, res) => {
  try {
    const { title, author, category, publishedYear, availableCopies } = req.body;

    if (!title || !author || !category || publishedYear == null || availableCopies == null) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const book = await Book.create({
      title,
      author,
      category,
      publishedYear: Number(publishedYear),
      availableCopies: Number(availableCopies)
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * READ: All books
 * GET /api/books
 */
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * READ: Single book by id
 * GET /api/books/:id
 */
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "Invalid book id" });
  }
});

/**
 * READ: Filter by category
 * GET /api/books/category/:category
 */
router.get("/books/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const books = await Book.find({ category }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * READ: Published after year
 * GET /api/books/after/:year
 */
router.get("/books/after/:year", async (req, res) => {
  try {
    const year = Number(req.params.year);
    const books = await Book.find({ publishedYear: { $gt: year } }).sort({ publishedYear: -1 });
    res.json(books);
  } catch (err) {
    res.status(400).json({ message: "Year must be a number" });
  }
});

/**
 * UPDATE: Full update (edit)
 * PUT /api/books/:id
 */
router.put("/books/:id", async (req, res) => {
  try {
    const { title, author, category, publishedYear, availableCopies } = req.body;

    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        category,
        publishedYear: Number(publishedYear),
        availableCopies: Number(availableCopies)
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * UPDATE: Add copies
 * PATCH /api/books/:id/copies
 * body: { "addCopies": 2 }
 */
router.patch("/books/:id/copies", async (req, res) => {
  try {
    const addCopies = Number(req.body.addCopies);
    if (!Number.isFinite(addCopies) || addCopies <= 0) {
      return res.status(400).json({ message: "addCopies must be a positive number" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.availableCopies += addCopies;
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "Invalid request" });
  }
});

/**
 * UPDATE: Change category
 * PATCH /api/books/:id/category
 * body: { "category": "Science" }
 */
router.patch("/books/:id/category", async (req, res) => {
  try {
    const { category } = req.body;
    if (!category || !category.trim()) {
      return res.status(400).json({ message: "category is required" });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { category: category.trim() },
      { new: true, runValidators: true }
    );

    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "Invalid request" });
  }
});

/**
 * DELETE: Only if availableCopies == 0
 * DELETE /api/books/:id
 */
router.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies !== 0) {
      return res.status(400).json({ message: "Cannot delete unless availableCopies is 0." });
    }

    await Book.deleteOne({ _id: book._id });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid book id" });
  }
});

module.exports = router;
