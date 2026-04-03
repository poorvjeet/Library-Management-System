const { prisma } = require("../prisma");
const { createBookSchema } = require("../validators/book.validators");

async function listBooks(req, res, next) {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const q = (req.query.q || "").toString().trim();

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { author: { contains: q, mode: "insensitive" } },
                { category: { contains: q, mode: "insensitive" } }
              ]
            }
          : undefined,
        orderBy: { id: "desc" },
        skip,
        take: limit
      }),
      prisma.book.count({
        where: q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { author: { contains: q, mode: "insensitive" } },
                { category: { contains: q, mode: "insensitive" } }
              ]
            }
          : undefined
      })
    ]);

    return res.json({ books, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    return next(err);
  }
}

async function createBook(req, res, next) {
  try {
    const data = createBookSchema.parse(req.body);
    const total = data.total;
    const book = await prisma.book.create({
      data: {
        title: data.title,
        category: data.category,
        author: data.author,
        coverUrl: data.coverUrl || null,
        total,
        amountInStock: total,
        price: data.price,
        status: total > 0 ? "Available" : "Unavailable"
      }
    });
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const data = createBookSchema.parse(req.body);
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book) return res.status(404).json({ message: "Book not found" });
    
    const total = data.total || book.total;
    const updated = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        amountInStock: total,
        status: total > 0 ? "Available" : "Unavailable"
      }
    });
    return res.json({ book: updated });
  } catch (err) {
    return next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.amountInStock < book.total) return res.status(400).json({ message: "Cannot delete - books issued" });
    await prisma.book.delete({ where: { id: parseInt(id) } });
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listBooks, createBook, updateBook, deleteBook };

