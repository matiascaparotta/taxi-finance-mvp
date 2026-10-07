const crypto = require("node:crypto");
require("dotenv").config();
const pool = require("../config/database");
const { hashPassword } = require("../services/authService");

const generateTemporaryPassword = () => crypto.randomBytes(12).toString("base64url");

const activateUser = async (username, suppliedPassword) => {
  if (!username) throw new Error("Indica el usuario que quieres activar");
  const temporaryPassword = suppliedPassword || generateTemporaryPassword();
  const [result] = await pool.query(
    "UPDATE users SET password_hash = ?, is_active = TRUE WHERE username = ?",
    [hashPassword(temporaryPassword), username.toLowerCase()]
  );
  if (result.affectedRows !== 1) throw new Error(`No se encontró el usuario ${username}`);
  return { username: username.toLowerCase(), temporaryPassword };
};

if (require.main === module) {
  const [username, password] = process.argv.slice(2);
  activateUser(username, password)
    .then((result) => {
      console.log(`Usuario activado: ${result.username}`);
      console.log(`Contraseña temporal: ${result.temporaryPassword}`);
    })
    .catch((error) => {
      console.error(`No se pudo activar el usuario: ${error.message}`);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}

module.exports = { activateUser, generateTemporaryPassword };
