const {
  createWorkDayService,
  getWorkDaysService,
  getOpenWorkDayService,
  getLatestClosedWorkDayService,
  closeWorkDayService,
  getWorkDayByIdService,
  deleteWorkDayService,
} = require("../services/workDayService");

const createWorkDay = async (req, res) => {
  try {
    const result = await createWorkDayService(req.body, req.auth);

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
    const result = await getWorkDaysService(req.auth);

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
const getWorkDayById = async (req, res) => {
  try {
    const result = await getWorkDayByIdService(req.params.id, req.auth);

    res.status(200).json({
      success: true,
      message: "Jornada obtenida correctamente",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
const getOpenWorkDay = async (req, res) => {
  try {
    const result = await getOpenWorkDayService(req.auth);

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
const getLatestClosedWorkDay = async (req, res) => {
  try {
    const result = await getLatestClosedWorkDayService(req.auth);

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
    const result = await closeWorkDayService(req.params.id, req.body, req.auth);

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
const deleteWorkDay = async (req, res) => {
  try {
    const result = await deleteWorkDayService(req.params.id, req.auth);

    res.status(200).json({
      success: true,
      message: "Jornada eliminada correctamente",
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
  getLatestClosedWorkDay,
  closeWorkDay,
  getWorkDayById,
  deleteWorkDay,
};
