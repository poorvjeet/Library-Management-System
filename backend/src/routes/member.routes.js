const express = require("express");
const { auth } = require("../middleware/auth");
const { listMembers, createMember } = require("../controllers/member.controller");

const router = express.Router();

router.get("/members", auth, listMembers);
router.post("/members", auth, createMember);
router.put("/members/:id", auth, updateMember);
router.delete("/members/:id", auth, deleteMember);

module.exports = { memberRoutes: router };

