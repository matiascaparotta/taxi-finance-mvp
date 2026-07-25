const pool = require("../config/database");
const {
  assignExistingWorkDays,
} = require("../services/workDayOwnershipService");

const MATIAS_ASSIGNMENT = {
  organizationSlug: "lic249",
  username: "mati.caparotta",
  vehicleName: "Taxi Lic249",
};

const run = async () => {
  try {
    const result = await assignExistingWorkDays(
      MATIAS_ASSIGNMENT
    );

    if (result.assigned > 0) {
      console.log(
        `${result.assigned} jornadas asignadas a mati.caparotta`
      );
      return;
    }

    console.log(
      `${result.alreadyAssigned} jornadas ya estaban asignadas a mati.caparotta`
    );
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`No se pudieron asignar las jornadas: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  MATIAS_ASSIGNMENT,
  run,
};
