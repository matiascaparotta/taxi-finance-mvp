const {
  getTripWorkDayStatus,
} = require("../repositories/workDayStatusRepository");

const assertTripBelongsToOpenWorkDay = async (
  tripId,
  getStatus = getTripWorkDayStatus
) => {
  const status = await getStatus(tripId);

  if (!status) {
    throw new Error("Viaje no encontrado");
  }

  if (status !== "OPEN") {
    throw new Error(
      "No se pueden modificar viajes de una jornada cerrada"
    );
  }
};

module.exports = {
  assertTripBelongsToOpenWorkDay,
};
