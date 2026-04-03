const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const users = [
    { name: "Admin Demo", email: "admin@college.com", password },
    { name: "Student One", email: "student1@college.com", password },
    { name: "Student Two", email: "student2@college.com", password }
  ];

  const books = [
    { title: "Data Structures", category: "Technology", author: "S. Lipschutz", total: 5, amountInStock: 5, price: 450, status: "Available" },
    { title: "Operating Systems", category: "Technology", author: "Galvin", total: 4, amountInStock: 4, price: 500, status: "Available" },
    { title: "Computer Networks", category: "Technology", author: "Tanenbaum", total: 3, amountInStock: 3, price: 520, status: "Available" },
    { title: "Database System Concepts", category: "Technology", author: "Korth", total: 6, amountInStock: 6, price: 620, status: "Available" },
    { title: "Clean Code", category: "Programming", author: "Robert C. Martin", total: 2, amountInStock: 2, price: 399, status: "Available" }
  ];
  const members = [
    { name: "Jean", memberCode: "26346", address: "Grade 10", phone: "092122345" },
    { name: "Lisa", memberCode: "246246", address: "Grade 8", phone: "092384953" },
    { name: "Leo", memberCode: "36366", address: "Grade 12, class J7", phone: "092847000" }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password: user.password },
      create: user
    });
  }

  for (const book of books) {
    const existing = await prisma.book.findFirst({
      where: { title: book.title, author: book.author }
    });

    if (!existing) {
      await prisma.book.create({ data: book });
    }
  }

  for (const member of members) {
    await prisma.member.upsert({
      where: { memberCode: member.memberCode },
      update: member,
      create: member
    });
  }

  console.log("Seed complete.");
  console.log("Demo login password for all users: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

