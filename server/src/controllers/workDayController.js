const { processWorkDay } = require("../services/workDayService");

const createWorkDay = (req, res) => {
  try {
    const result = processWorkDay(req.body);

    res.status(200).json({
      success: true,
      message: "Jornada procesada correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createWorkDay,
};