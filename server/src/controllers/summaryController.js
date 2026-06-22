const { getMonthlySummary } = require("../services/summaryService");

const getMonthlySummaryController = async (req, res) => {
  try {
    const result = await getMonthlySummary(req.query.month);
    res.status(200).json({
      success: true,
      message: "Resumen mensual obtenido correctamente",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMonthlySummaryController,
};