const fs = require("node:fs/promises");
const path = require("node:path");

const mysql = require("mysql2/promise");
require("dotenv").config();

const migrationsDirectory = path.resolve(
  __dirname,
  "../../database/migrations"
);

const getMigrationFiles = async () => {
  const entries = await fs.readdir(migrationsDirectory);

  return entries
    .filter((entry) => /^\d{3}_[a-z0-9_]+\.sql$/.test(entry))
    .sort();
};

const migrateDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (name)
      )
    `);

    const [appliedRows] = await connection.query(
      "SELECT name FROM schema_migrations"
    );
    const appliedMigrations = new Set(
      appliedRows.map((row) => row.name)
    );
    const migrationFiles = await getMigrationFiles();

    for (const migrationFile of migrationFiles) {
      if (appliedMigrations.has(migrationFile)) {
        continue;
      }

      const sql = await fs.readFile(
        path.join(migrationsDirectory, migrationFile),
        "utf8"
      );

      await connection.query(sql);
      await connection.query(
        "INSERT INTO schema_migrations (name) VALUES (?)",
        [migrationFile]
      );

      console.log(`Applied migration: ${migrationFile}`);
    }

    console.log("Database migrations are up to date");
  } finally {
    await connection.end();
  }
};

if (require.main === module) {
  migrateDatabase().catch((error) => {
    console.error(`Database migration failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  getMigrationFiles,
  migrateDatabase,
};
