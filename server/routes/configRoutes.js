const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const configPath = path.join(__dirname, "..", "config.json");

// GET /api/config => Return current config.json
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    const json = JSON.parse(data);
    return res.json(json);
  } catch (err) {
    console.error("Error reading config.json:", err);
    return res.status(500).json({ error: "Failed to read config" });
  }
});

// PUT /api/config => Update config.json
// (In production, you'd add authentication for admin!)
router.put("/", (req, res) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2), "utf-8");
    return res.json({ message: "Configuration updated successfully" });
  } catch (err) {
    console.error("Error writing config.json:", err);
    return res.status(500).json({ error: "Failed to update config" });
  }
});

module.exports = router;
