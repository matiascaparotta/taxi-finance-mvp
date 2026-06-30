const {
  createWorkDayService,
  getWorkDaysService,
  getOpenWorkDayService,
  closeWorkDayService,
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
const getOpenWorkDay = async (req, res) => {
  try {
    const result = await getOpenWorkDayService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const closeWorkDay = async (req, res) => {
  try {
    const result = await closeWorkDayService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Jornada cerrada correctamente",
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
  getAllWorkDays,
  getOpenWorkDay,
  closeWorkDay,
};