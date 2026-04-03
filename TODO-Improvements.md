# Improvement Tasks Progress

## Tasks 1-2: COMPLETE ✅

**1. DELETE Endpoints**
- `DELETE /books/:id` - Can't delete issued books
- `DELETE /members/:id` - Can't delete active borrowers

**2. Pagination**
- `GET /books?page=1&limit=10&q=search`
- `GET /members?page=1&limit=10`

**Next**: Frontend pagination UI + tests

**Status**: Backend ready! `npx prisma generate && npm run dev`
