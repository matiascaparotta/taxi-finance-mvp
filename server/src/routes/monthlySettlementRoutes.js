const express = require("express");
const controller = require("../controllers/monthlySettlementController");

const router = express.Router();

router.get("/", controller.listMonthlySettlements);
router.get("/:month", controller.getMonthlySettlement);
router.put("/:month/settings", controller.updateMonthlySettings);
router.post("/:month/close", controller.closeMonthlySettlement);

module.exports = router;
