const bcrypt = require("bcryptjs");
const { prisma } = require("../prisma");
const { signToken } = require("../utils/jwt");
const { registerSchema, loginSchema } = require("../validators/auth.validators");

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };

