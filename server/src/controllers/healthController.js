const getHealthStatus = (req, res) => {
    res.json({
      status: "ok",
      message: "Taxi Finance API running",
    });
  };
  
  module.exports = {
    getHealthStatus,
  };