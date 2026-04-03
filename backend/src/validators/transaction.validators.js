const { z } = require("zod");

const issueSchema = z.object({
  memberId: z.coerce.number().int().positive(),
  bookId: z.coerce.number().int().positive(),
  note: z.string().optional()
});

const returnSchema = z.object({
  transactionId: z.coerce.number().int().positive()
});

module.exports = { issueSchema, returnSchema };

