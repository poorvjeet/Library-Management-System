const { prisma } = require("../prisma");
const { issueSchema, returnSchema } = require("../validators/transaction.validators");

async function issueBook(req, res, next) {
  try {
    const data = issueSchema.parse(req.body);

    const book = await prisma.book.findUnique({ where: { id: data.bookId } });
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.amountInStock <= 0) return res.status(400).json({ message: "Book not available" });

    const member = await prisma.member.findUnique({ where: { id: data.memberId } });
    if (!member) return res.status(404).json({ message: "Member not found" });

    // simple rule: issue only if member doesn't already have active same book
    const active = await prisma.transaction.findFirst({
      where: { memberId: data.memberId, bookId: data.bookId, returnDate: null }
    });
    if (active) return res.status(400).json({ message: "This book is already issued to this member" });

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: { memberId: data.memberId, bookId: data.bookId, note: data.note || null }
      });
      const updatedBook = await tx.book.update({
        where: { id: data.bookId },
        data: { amountInStock: { decrement: 1 } }
      });
      if (updatedBook.amountInStock <= 0) {
        await tx.book.update({
          where: { id: data.bookId },
          data: { status: "Unavailable" }
        });
      }
      return transaction;
    });

    return res.status(201).json({ transaction: result });
  } catch (err) {
    return next(err);
  }
}

async function returnBook(req, res, next) {
  try {
    const data = returnSchema.parse(req.body);

    const txn = await prisma.transaction.findUnique({ where: { id: data.transactionId } });
    if (!txn) return res.status(404).json({ message: "Transaction not found" });
    if (txn.returnDate) return res.status(400).json({ message: "Book already returned" });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id: data.transactionId },
        data: { returnDate: new Date() }
      });
      const updatedBook = await tx.book.update({
        where: { id: txn.bookId },
        data: { amountInStock: { increment: 1 } }
      });
      if (updatedBook.amountInStock > 0) {
        await tx.book.update({
          where: { id: txn.bookId },
          data: { status: "Available" }
        });
      }
      return updated;
    });

    // optional fine calculation (simple): 14 days allowed, Rs. 2/day after that
    const issueTime = new Date(result.issueDate).getTime();
    const nowTime = new Date(result.returnDate).getTime();
    const days = Math.floor((nowTime - issueTime) / (1000 * 60 * 60 * 24));
    const allowedDays = 14;
    const finePerDay = 2;
    const fine = days > allowedDays ? (days - allowedDays) * finePerDay : 0;

    return res.json({ transaction: result, fine, daysBorrowed: days });
  } catch (err) {
    return next(err);
  }
}

async function listIssued(req, res, next) {
  try {
    const issued = await prisma.transaction.findMany({
      where: { returnDate: null },
      orderBy: { issueDate: "desc" },
      include: {
        member: true,
        book: true
      }
    });
    return res.json({ issued });
  } catch (err) {
    return next(err);
  }
}

async function listBorrowers(req, res, next) {
  try {
    const borrowers = await prisma.transaction.findMany({
      orderBy: { issueDate: "desc" },
      include: { member: true, book: true }
    });
    return res.json({ borrowers });
  } catch (err) {
    return next(err);
  }
}

module.exports = { issueBook, returnBook, listIssued, listBorrowers };

