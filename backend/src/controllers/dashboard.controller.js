const { prisma } = require("../prisma");

async function summary(req, res, next) {
  try {
    const [totalBooks, issuedBooks, totalMembers, totalBorrowers, bookStats] = await Promise.all([
      prisma.book.count(),
      prisma.transaction.count({ where: { returnDate: null } }),
      prisma.member.count(),
      prisma.transaction.count(),
      prisma.transaction.groupBy({
        by: ["bookId"],
        _count: { bookId: true },
        orderBy: { _count: { bookId: "desc" } },
        take: 5
      })
    ]);

    const topBookIds = bookStats.map((x) => x.bookId);
    const books = topBookIds.length
      ? await prisma.book.findMany({ where: { id: { in: topBookIds } } })
      : [];
    const bookMap = new Map(books.map((b) => [b.id, b.title]));

    const borrowingChart = bookStats.map((x) => ({
      bookId: x.bookId,
      title: bookMap.get(x.bookId) || `Book ${x.bookId}`,
      count: x._count.bookId
    }));

    return res.json({ totalBooks, issuedBooks, totalMembers, totalBorrowers, borrowingChart });
  } catch (err) {
    return next(err);
  }
}

module.exports = { summary };

