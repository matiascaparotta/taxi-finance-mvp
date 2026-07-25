const {
  createDriverService,
  listDriversService,
  resetDriverPasswordService,
  updateDriverStatusService,
} = require("../services/driverManagementService");

const listDrivers = async (req, res) => {
  try {
    const drivers = await listDriversService(
      req.auth.organizationId
    );
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const result = await createDriverService(
      req.auth.organizationId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Conductor creado correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateDriverStatus = async (req, res) => {
  try {
    const result = await updateDriverStatusService(
      req.auth.organizationId,
      req.params.id,
      req.body.status
    );
    res.status(200).json({
      success: true,
      message: "Estado actualizado correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetDriverPassword = async (req, res) => {
  try {
    const result = await resetDriverPasswordService(
      req.auth.organizationId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Contraseña temporal generada correctamente",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDriver,
  listDrivers,
  resetDriverPassword,
  updateDriverStatus,
};
