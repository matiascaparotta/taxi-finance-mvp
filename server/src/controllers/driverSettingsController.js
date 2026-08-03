const service = require("../services/driverSettingsService");
const send = (res, operation) => operation.then((data) => res.json({ success: true, data })).catch((error) => res.status(400).json({ success: false, message: error.message }));

const getSettings = (req, res) => send(res, service.getDriverSettings(req.auth));
const updateSettings = (req, res) => send(res, service.updateDriverSettings(req.body, req.auth));
const createCompany = (req, res) => send(res, service.createCompany(req.body, req.auth));
const updateCompany = (req, res) => send(res, service.updateCompany(req.params.id, req.body, req.auth));

module.exports = { createCompany, getSettings, updateCompany, updateSettings };
