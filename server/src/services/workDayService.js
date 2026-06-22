const processWorkDay = (workDayData) => {
    const { startKm, endKm, cash, card, fuelOwn } = workDayData;
  
    if (endKm < startKm) {
      throw new Error("El kilometraje final no puede ser menor que el inicial");
    }
  
    const workedKm = endKm - startKm;
    const totalGenerated = cash + card;
  
    return {
      workedKm,
      totalGenerated,
      fuelOwn,
    };
  };
  
  module.exports = {
    processWorkDay,
  };