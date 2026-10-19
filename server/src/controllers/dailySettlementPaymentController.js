const {
  registerDailySettlementPayment,
} = require("../services/dailySettlementPaymentService");
const {
  registerDailySettlementAdjustment,
} = require("../services/dailySettlementAdjustmentService");

const registerPayment = async (req, res) => {
  try {
    const data = await registerDailySettlementPayment(req.body, req.auth);
    res.status(201).json({
      success: true,
      message: "Pago registrado correctamente",
      data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const registerAdjustment = async (req, res) => {
  try {
    const data = await registerDailySettlementAdjustment(req.body, req.auth);
    res.status(201).json({
      success: true,
      message: "Ajuste registrado correctamente",
      data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { registerAdjustment, registerPayment };
