require("dotenv").config();

const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Lic249 API running on port ${PORT}`);
});
