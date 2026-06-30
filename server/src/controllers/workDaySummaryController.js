const { getWorkDaySummaryService } = require("../services/workDaySummaryService");

const getWorkDaySummaryController = async (req, res) => {
  try {
    const { id } = req.params;

    const summary = await getWorkDaySummaryService(id);

    res.status(200).json({
      success: true,
      message: "Resumen de jornada obtenido correctamente",
      data: summary,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWorkDaySummaryController,
};