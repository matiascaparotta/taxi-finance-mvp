const crypto = require("node:crypto");
const fs = require("node:fs");
const fsPromises = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const mysql = require("mysql2/promise");

require("dotenv").config();

const BACKUP_TABLES = [
  "organizations",
  "users",
  "organization_memberships",
  "commission_companies",
  "vehicles",
  "work_days",
  "trips",
  "correction_audit_logs",
  "monthly_work_day_imports",
  "monthly_settlements",
  "monthly_settlement_audit_logs",
];

const formatTimestamp = (date) =>
  date.toISOString().replace(/[:.]/g, "-");

const createClientConfig = () => {
  const requiredVariables = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "DB_PORT",
  ];
  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Faltan variables de base de datos: ${missingVariables.join(", ")}`
    );
  }

  return [
    "[client]",
    `host=${process.env.DB_HOST}`,
    `user=${process.env.DB_USER}`,
    `password=${process.env.DB_PASSWORD}`,
    `port=${process.env.DB_PORT}`,
    "",
  ].join("\n");
};

const calculateChecksum = async (filePath) => {
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(filePath);

  for await (const chunk of stream) {
    hash.update(chunk);
  }

  return hash.digest("hex");
};

const getExistingBackupTables = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  try {
    const [rows] = await connection.query(
      `
      SELECT table_name AS tableName
      FROM information_schema.tables
      WHERE table_schema = ?
        AND table_name IN (?)
      `,
      [process.env.DB_NAME, BACKUP_TABLES]
    );
    const existingTables = new Set(
      rows.map((row) => row.tableName)
    );

    return BACKUP_TABLES.filter((table) =>
      existingTables.has(table)
    );
  } finally {
    await connection.end();
  }
};

const runDump = async (configPath, outputPath, tables) => {
  const output = fs.createWriteStream(outputPath, {
    mode: 0o600,
  });

  const args = [
    `--defaults-extra-file=${configPath}`,
    "--single-transaction",
    "--no-create-info",
    "--skip-triggers",
    "--order-by-primary",
    "--skip-comments",
    "--set-gtid-purged=OFF",
    process.env.DB_NAME,
    ...tables,
  ];

  const dump = spawn("mysqldump", args, {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let errorOutput = "";

  dump.stdout.pipe(output);
  dump.stderr.on("data", (chunk) => {
    errorOutput += chunk.toString();
  });

  const dumpFinished = new Promise((resolve, reject) => {
    dump.on("error", reject);
    dump.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          errorOutput.trim() ||
            `mysqldump finalizó con código ${code}`
        )
      );
    });
  });
  const outputFinished = new Promise((resolve, reject) => {
    output.on("finish", resolve);
    output.on("error", reject);
  });

  await Promise.all([dumpFinished, outputFinished]);
};

const backupDatabase = async () => {
  const backupDirectory = path.resolve(
    process.env.BACKUP_DIR ||
      path.join(__dirname, "../../backups")
  );
  const temporaryDirectory = await fsPromises.mkdtemp(
    path.join(os.tmpdir(), "lic249-backup-")
  );
  const configPath = path.join(temporaryDirectory, "mysql-client.cnf");
  const timestamp = formatTimestamp(new Date());
  const backupName = `lic249-${timestamp}.sql`;
  const temporaryBackupPath = path.join(
    temporaryDirectory,
    backupName
  );
  const finalBackupPath = path.join(backupDirectory, backupName);

  try {
    await fsPromises.mkdir(backupDirectory, {
      recursive: true,
      mode: 0o700,
    });
    await fsPromises.writeFile(configPath, createClientConfig(), {
      mode: 0o600,
    });
    const existingTables = await getExistingBackupTables();
    await runDump(
      configPath,
      temporaryBackupPath,
      existingTables
    );

    const stats = await fsPromises.stat(temporaryBackupPath);

    if (stats.size === 0) {
      throw new Error("El respaldo generado está vacío");
    }

    const checksum = await calculateChecksum(temporaryBackupPath);

    await fsPromises.rename(temporaryBackupPath, finalBackupPath);
    await fsPromises.chmod(finalBackupPath, 0o600);
    await fsPromises.writeFile(
      `${finalBackupPath}.sha256`,
      `${checksum}  ${backupName}\n`,
      { mode: 0o600 }
    );

    console.log(`Backup created: ${finalBackupPath}`);
    console.log(`SHA-256: ${checksum}`);

    return {
      backupPath: finalBackupPath,
      checksum,
    };
  } finally {
    await fsPromises.rm(temporaryDirectory, {
      recursive: true,
      force: true,
    });
  }
};

if (require.main === module) {
  backupDatabase().catch((error) => {
    console.error(`Database backup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  BACKUP_TABLES,
  backupDatabase,
  calculateChecksum,
};
