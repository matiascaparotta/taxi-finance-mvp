const {
  createWorkDayService,
  getWorkDaysService,
} = require("../services/workDayService");

const createWorkDay = async (req, res) => {
  try {
    const result = await createWorkDayService(req.body);

    res.status(201).json({
      success: true,
      message: "Jornada guardada correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllWorkDays = async (req, res) => {
  try {
    const result = await getWorkDaysService();

    res.status(200).json({
      success: true,
      message: "Jornadas obtenidas correctamente",
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
  createWorkDay,
  getAllWorkDays,
};