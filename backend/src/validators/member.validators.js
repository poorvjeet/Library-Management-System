const { z } = require("zod");

const createMemberSchema = z.object({
  name: z.string().min(1),
  memberCode: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(5)
});

module.exports = { createMemberSchema };

