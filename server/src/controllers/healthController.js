const getHealthStatus = (req, res) => {
    res.json({
      status: "ok",
      message: "Lic249 API running",
    });
  };
  
  module.exports = {
    getHealthStatus,
  };