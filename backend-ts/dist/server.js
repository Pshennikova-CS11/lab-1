"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const migrate_1 = require("./db/migrate");
const PORT = 3001;
async function bootstrap() {
    await (0, migrate_1.runMigrations)();
    app_1.app.listen(PORT, () => {
        console.log(`TS server is running on http://localhost:${PORT}`);
    });
}
bootstrap().catch((err) => {
    console.error("Startup error:", err);
    process.exit(1);
});
