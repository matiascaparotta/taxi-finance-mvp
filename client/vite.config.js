import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

function taxFinServiceWorkerVersion() {
  const buildVersion =
    process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 12) ||
    Date.now().toString(36);

  return {
    name: "taxfin-service-worker-version",
    closeBundle() {
      const serviceWorkerPath = path.resolve("dist/sw.js");
      const source = fs.readFileSync(serviceWorkerPath, "utf8");

      fs.writeFileSync(
        serviceWorkerPath,
        source.replaceAll("__TAXFIN_BUILD_VERSION__", buildVersion)
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), taxFinServiceWorkerVersion()],
});
