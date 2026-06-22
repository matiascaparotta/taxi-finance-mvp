const pool = require("./database");

const testConnection = async () => {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS database_name");

    console.log("Database connected successfully");
    console.log(rows[0]);

    process.exit(0);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error.message);

    process.exit(1);
  }
};

testConnection();