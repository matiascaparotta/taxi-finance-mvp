const service = require("../services/monthlySettlementService");

const sendError = (res, error) =>
  res.status(400).json({ success: false, message: error.message });

const getMonthlySettlement = async (req, res) => {
  try {
    const data = await service.buildMonthlySettlement(
      req.params.month,
      req.auth,
      req.query.driverUserId
    );
    res.json({ success: true, data });
  } catch (error) {
    sendError(res, error);
  }
};

const listMonthlySettlements = async (req, res) => {
  try {
    const data = await service.listMonthlySettlements(
      req.query.year,
      req.auth,
      req.query.driverUserId
    );
    res.json({ success: true, data });
  } catch (error) {
    sendError(res, error);
  }
};

const updateMonthlySettings = async (req, res) => {
  try {
    const data = await service.updateMonthlySettings(
      req.params.month,
      req.body,
      req.auth,
      req.query.driverUserId
    );
    res.json({
      success: true,
      message: "Datos mensuales actualizados",
      data,
    });
  } catch (error) {
    sendError(res, error);
  }
};

const closeMonthlySettlement = async (req, res) => {
  try {
    const data = await service.closeMonthlySettlement(
      req.params.month,
      req.body,
      req.auth
    );
    res.json({ success: true, message: "Liquidación cerrada", data });
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  closeMonthlySettlement,
  getMonthlySettlement,
  listMonthlySettlements,
  updateMonthlySettings,
};
