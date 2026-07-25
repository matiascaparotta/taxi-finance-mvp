const pool = require("../config/database");
const {
  provisionOrganization,
} = require("../services/organizationSetupService");

const LIC249_SETUP = {
  organization: {
    name: "Lic249",
    slug: "lic249",
  },
  users: [
    {
      username: "mati.caparotta",
      displayName: "Matías Caparotta",
      isOwner: false,
      isDriver: true,
      fuelCalculationMode: "ACTUAL_LOAD",
    },
    {
      username: "jose.revilla",
      displayName: "José Revilla",
      isOwner: true,
      isDriver: true,
      fuelCalculationMode: "ACTUAL_LOAD",
    },
  ],
  vehicle: {
    name: "Taxi Lic249",
    licensePlate: null,
  },
};

const printResult = (result) => {
  console.log(`Organización preparada: ${result.organization.name}`);
  console.log(`Vehículo preparado: ${result.vehicle.name}`);

  for (const user of result.users) {
    if (user.created) {
      console.log(`Usuario creado: ${user.username}`);
      console.log(
        `Contraseña temporal de ${user.username}: ${user.temporaryPassword}`
      );
      continue;
    }

    console.log(`Usuario existente conservado: ${user.username}`);
  }
};

const run = async () => {
  try {
    const result = await provisionOrganization(LIC249_SETUP);
    printResult(result);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`No se pudo preparar Lic249: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  LIC249_SETUP,
  printResult,
  run,
};
