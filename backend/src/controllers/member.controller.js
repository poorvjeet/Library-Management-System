const { prisma } = require("../prisma");
const { createMemberSchema } = require("../validators/member.validators");

async function listMembers(req, res, next) {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        orderBy: { id: "desc" },
        skip,
        take: limit
      }),
      prisma.member.count()
    ]);

    return res.json({ members, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    return next(err);
  }
}

async function createMember(req, res, next) {
  try {
    const data = createMemberSchema.parse(req.body);
    const member = await prisma.member.create({ data });
    return res.status(201).json({ member });
  } catch (err) {
    return next(err);
  }
}

async function updateMember(req, res, next) {
  try {
    const { id } = req.params;
    const data = createMemberSchema.parse(req.body);
    const member = await prisma.member.findUnique({ where: { id: parseInt(id) } });
    if (!member) return res.status(404).json({ message: "Member not found" });
    
    const updated = await prisma.member.update({
      where: { id: parseInt(id) },
      data
    });
    return res.json({ member: updated });
  } catch (err) {
    return next(err);
  }
}

async function deleteMember(req, res, next) {
  try {
    const { id } = req.params;
    // Check active transactions
    const active = await prisma.transaction.count({
      where: { memberId: parseInt(id), returnDate: null }
    });
    if (active > 0) return res.status(400).json({ message: "Cannot delete - active borrows" });
    
    await prisma.member.delete({ where: { id: parseInt(id) } });
    return res.json({ message: "Member deleted" });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listMembers, createMember, updateMember, deleteMember };

