const assert = require("node:assert/strict");
const test = require("node:test");
const { requireAlbertoScope } = require("../src/services/driverSettingsService");

test("limita la configuración al conductor asalariado de Lic1315", () => {
  assert.deepEqual(requireAlbertoScope({ accessMode: "user", organizationName: "Lic1315", organizationId: 2, userId: 3, roles: { isOwner: false, isDriver: true } }), { organizationId: 2, userId: 3 });
  assert.throws(() => requireAlbertoScope({ accessMode: "user", organizationName: "Lic249", roles: { isOwner: false, isDriver: true } }), /perfil asalariado/);
  assert.throws(() => requireAlbertoScope({ accessMode: "user", organizationName: "Lic1315", roles: { isOwner: true, isDriver: true } }), /perfil asalariado/);
});
