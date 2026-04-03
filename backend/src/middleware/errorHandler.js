const { ZodError } = require("zod");
const { Prisma } = require("@prisma/client");

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    const first = err.issues?.[0];
    return res.status(400).json({ message: first?.message || "Validation failed" });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "field";
      return res.status(409).json({ message: `Duplicate value for ${field}` });
    }
  }

  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  return res.status(status).json({ message });
}

module.exports = { errorHandler };

