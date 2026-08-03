import test from "node:test";
import assert from "node:assert/strict";

import {
  getUserInitials,
  getUserNavigation,
  getUserRoleLabel,
  isOwnerUser,
} from "../src/utils/userNavigation.js";

test("personaliza la identidad visible del conductor", () => {
  const user = {
    displayName: "Matías Caparotta",
    roles: { isOwner: false, isDriver: true },
  };

  assert.equal(isOwnerUser(user), false);
  assert.equal(getUserRoleLabel(user), "Conductor");
  assert.equal(getUserInitials(user.displayName), "MC");
  assert.deepEqual(
    getUserNavigation(user).map((item) => item.label),
    ["Inicio", "Mi jornada", "Mensual", "Historial"]
  );
  assert.equal(
    getUserNavigation(user).find((item) => item.id === "work-day").to,
    "/my-work-day"
  );
});

test("añade la gestión de conductores al propietario", () => {
  const user = {
    displayName: "José Revilla",
    roles: { isOwner: true, isDriver: true },
  };

  assert.equal(isOwnerUser(user), true);
  assert.equal(getUserRoleLabel(user), "Propietario");
  assert.equal(getUserInitials(user.displayName), "JR");
  assert.deepEqual(
    getUserNavigation(user).map((item) => item.label),
    ["Inicio", "Mi jornada", "Mis conductores", "Mensual", "Historial"]
  );
});

test("simplifica la navegación del conductor asalariado", () => {
  const user = {
    displayName: "Alberto Caparotta",
    organizationName: "Lic1315",
    roles: { isOwner: false, isDriver: true },
  };

  assert.equal(getUserRoleLabel(user), "Conductor asalariado");
  assert.deepEqual(
    getUserNavigation(user).map((item) => item.label),
    ["Mi jornada", "Mensual", "Historial", "Configuración"]
  );
});

test("conserva una identidad segura si falta el usuario", () => {
  assert.equal(getUserInitials(), "TF");
  assert.equal(getUserRoleLabel(null), "Usuario");
});
