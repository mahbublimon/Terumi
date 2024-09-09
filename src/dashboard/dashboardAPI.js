import express from "express"; // Add this line
import path from "path";
import { fileURLToPath } from "url";

export function setupDashboard(app, botStats) {
    // Serve static files (HTML, CSS, JS)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Ensure that the public directory is correctly served
    app.use(express.static(path.join(__dirname, "public")));

    // API to get bot statistics
    app.get("/api/stats", (req, res) => {
        res.json(botStats);
    });
}
