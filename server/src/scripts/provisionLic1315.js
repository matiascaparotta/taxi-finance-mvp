const pool = require("../config/database");
const {
  provisionOrganization,
} = require("../services/organizationSetupService");

const LIC1315_SETUP = {
  organization: {
    name: "Lic1315",
    slug: "lic1315",
  },
  users: [
    {
      username: "alberto.caparotta",
      displayName: "Alberto Caparotta",
      isOwner: true,
      isDriver: true,
      fuelCalculationMode: "ACTUAL_LOAD",
    },
  ],
  vehicle: {
    name: "Taxi Lic1315",
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
    const result = await provisionOrganization(LIC1315_SETUP);
    printResult(result);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`No se pudo preparar Lic1315: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  LIC1315_SETUP,
  printResult,
  run,
};
