PRAGMA foreign_keys=OFF;

-- 1) Create Member table (new)
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "memberCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure unique/indexes for Member
CREATE UNIQUE INDEX "Member_memberCode_key" ON "Member"("memberCode");
CREATE INDEX "Member_name_idx" ON "Member"("name");
CREATE INDEX "Member_memberCode_idx" ON "Member"("memberCode");

-- 2) Rebuild Book table with new columns
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "author" TEXT NOT NULL,
    "coverUrl" TEXT,
    "total" INTEGER NOT NULL DEFAULT 0,
    "amountInStock" INTEGER NOT NULL DEFAULT 0,
    "price" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "new_Book" ("id","title","category","author","coverUrl","total","amountInStock","price","status","createdAt","updatedAt")
SELECT
  "id",
  "title",
  'General',
  "author",
  NULL,
  "availableQuantity",
  "availableQuantity",
  0,
  CASE WHEN "availableQuantity" > 0 THEN 'Available' ELSE 'Unavailable' END,
  "createdAt",
  "createdAt"
FROM "Book";

DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";

CREATE INDEX "Book_title_idx" ON "Book"("title");
CREATE INDEX "Book_author_idx" ON "Book"("author");
CREATE INDEX "Book_category_idx" ON "Book"("category");

-- 3) Convert existing users into members (for transaction mapping)
INSERT INTO "Member" ("id","name","memberCode","address","phone","createdAt","updatedAt")
SELECT
  "id",
  "name",
  'U-' || "id",
  'N/A',
  'N/A',
  "createdAt",
  "createdAt"
FROM "User"
WHERE NOT EXISTS (
  SELECT 1 FROM "Member" m WHERE m."id" = "User"."id"
);

-- 4) Rebuild Transaction table with memberId + note + timestamps
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "memberId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "note" TEXT,
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Transaction" ("id","memberId","bookId","note","issueDate","returnDate","createdAt","updatedAt")
SELECT
  "id",
  "userId",
  "bookId",
  NULL,
  "issueDate",
  "returnDate",
  "issueDate",
  COALESCE("returnDate", "issueDate")
FROM "Transaction";

DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";

CREATE INDEX "Transaction_memberId_idx" ON "Transaction"("memberId");
CREATE INDEX "Transaction_bookId_idx" ON "Transaction"("bookId");
CREATE INDEX "Transaction_returnDate_idx" ON "Transaction"("returnDate");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

