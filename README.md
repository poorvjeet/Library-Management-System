# Library Management System (Mini Project)

Simple full-stack mini project for a college viva.  
The system manages **Books**, **Members**, and **Borrowers** with login, issue/return flow, and a dashboard.

## 1) Project Overview

This project is a practical Library Management System built for a 1-2 week college mini project timeline.  
It focuses on core operations:

- User login/register
- Book catalog management
- Member management
- Borrow/return tracking
- Dashboard summary with borrowing activity chart

## 2) Features List

### Main Features

- Total Borrowing Book chart (top borrowed books)
- Quick buttons
  - Add Book
  - Add Member
  - Add Borrower
- Library overview
  - Book gallery/table view
  - Borrower table view
- Navigation menu
  - Dashboard
  - Books
  - Members
  - Borrowers

### Must-Have Functional Features

- Login / Register (JWT auth)
- Add Book
- View Books
- Issue Book
- Return Book
- View Issued Books

### Optional Simple Features

- Search books
- Fine calculation on return

## 3) Simple Architecture

- **Frontend**: React + Tailwind UI, Axios for API calls
- **Backend**: Express REST APIs (controllers/routes/middleware)
- **Database**: Prisma ORM with SQLite (easy local setup)
- **Auth**: JWT token stored in `localStorage`

Flow: `React UI -> Axios -> Express API -> Prisma -> SQLite DB`

## 4) Folder Structure

```text
Library mangment/
  backend/
    prisma/
      schema.prisma
      seed.js
    src/
      controllers/
      middleware/
      routes/
      validators/
      app.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
      pages/
      lib/
      store/
      App.jsx
      main.jsx
    .env.example
    package.json
  README.md
```

## 5) Database Design

### Book Table

- `id` (unique)
- `title`
- `category`
- `author`
- `coverUrl`
- `total`
- `amountInStock` (auto updated on issue/return)
- `price`
- `status` (`Available` / `Unavailable`, auto updated)
- `createdAt`
- `updatedAt`

### Member Table

- `id` (unique)
- `name`
- `memberCode` (college/member ID)
- `address`
- `phone`
- `createdAt`
- `updatedAt`

### Borrower Table (`Transaction`)

- `id`
- `memberId` (linked to member)
- `bookId` (linked to book)
- `note`
- `issueDate`
- `returnDate`
- `createdAt`
- `updatedAt`

## 6) Backend APIs

Base URL: `http://localhost:4000`

### Auth

- `POST /register`
- `POST /login`

### Books

- `GET /books`
- `POST /books`

### Members

- `GET /members`
- `POST /members`

### Transactions / Borrowers

- `POST /issue`
- `POST /return`
- `GET /issued`
- `GET /borrowers`

### Dashboard

- `GET /dashboard/summary`

## 7) Frontend Pages

- `Login`
- `Register`
- `Dashboard`
- `Books`
- `Members`
- `Issue/Return`
- `Borrowers`

## 8) API Integration

- Axios instance in `frontend/src/lib/api.js`
- `VITE_API_BASE_URL` from `.env`
- JWT token attached automatically:
  - `Authorization: Bearer <token>`

## 9) How To Run

### Backend

```bash
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name member-book-borrower-update
npm run seed
npm run dev
```

Backend runs on `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Demo Credentials (after seed)

- `admin@college.com` / `password123`
- `student1@college.com` / `password123`
- `student2@college.com` / `password123`

## 10) Postman API Testing (Basic)

1. Register user: `POST /register`
2. Login: `POST /login`
3. Copy token from login response
4. Add header for protected routes:
   - `Authorization: Bearer <token>`
5. Test:
   - `POST /books`, `GET /books`
   - `POST /members`, `GET /members`
   - `POST /issue`, `POST /return`
   - `GET /issued`, `GET /borrowers`
   - `GET /dashboard/summary`

## Viva Questions and Answers (10)

1. **What problem does this project solve?**  
   It digitizes library work: book records, member records, and borrowing transactions.

2. **Why React for frontend?**  
   React provides reusable components and simple page routing for a clean UI.

3. **Why Express for backend?**  
   Express is lightweight and easy for building REST APIs quickly.

4. **Why Prisma ORM?**  
   Prisma simplifies database queries and schema management.

5. **Why SQLite for mini project?**  
   SQLite is easy to set up locally without extra DB server installation.

6. **How is authentication handled?**  
   Login returns a JWT token, and protected routes verify that token.

7. **How does issue flow work?**  
   A transaction is created and book stock (`amountInStock`) decreases.

8. **How does return flow work?**  
   Transaction return date is set and book stock increases.

9. **How is book status auto-managed?**  
   Status becomes `Unavailable` when stock is 0; otherwise `Available`.

10. **What is MVC here?**  
   Routes map endpoints, controllers handle business logic, and Prisma models manage DB data.

## Notes

- To switch to PostgreSQL later, update datasource in `backend/prisma/schema.prisma` and set `DATABASE_URL` in `.env`.
- For better production security, token storage can be moved to httpOnly cookies.

## Database Management (Important)

If you get errors like `column does not exist`:

```bash
cd backend
npx prisma generate
npm run db:deploy
npm run seed
```

If your local DB is heavily mismatched, do a clean rebuild:

```bash
cd backend
npm run db:reset
npm run seed
```

