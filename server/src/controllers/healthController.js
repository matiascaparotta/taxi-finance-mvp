const getHealthStatus = (req, res) => {
    res.json({
      status: "ok",
      message: "TaxFin API running",
    });
  };
  
  module.exports = {
    getHealthStatus,
  };
