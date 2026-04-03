const { z } = require("zod");

const createBookSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  author: z.string().min(1),
  coverUrl: z.string().url().optional().or(z.literal("")),
  total: z.coerce.number().int().min(0),
  price: z.coerce.number().nonnegative()
});

module.exports = { createBookSchema };

