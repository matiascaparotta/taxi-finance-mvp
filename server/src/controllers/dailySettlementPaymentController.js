const {
  registerDailySettlementPayment,
} = require("../services/dailySettlementPaymentService");

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

module.exports = { registerPayment };
