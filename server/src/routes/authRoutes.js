const express = require("express");

const {
  changePassword,
  getSession,
  login,
  logout,
} = require("../controllers/authController");
const {
  requireAuthentication,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/session", getSession);
router.post("/login", login);
router.post("/logout", logout);
router.post(
  "/change-password",
  requireAuthentication,
  changePassword
);

module.exports = router;
