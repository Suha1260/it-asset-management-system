const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Demo data is stored in memory. It resets whenever the server restarts.
let assets = [
  { id: 1, name: "Office Laptop", type: "Laptop", serialNumber: "LT-1001", assignedTo: "IT Team", status: "Available" },
  { id: 2, name: "Network Printer", type: "Printer", serialNumber: "PR-2001", assignedTo: "Admin", status: "In Use" }
];
let nextId = 3;

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/assets", (req, res) => res.json(assets));

app.post("/api/assets", (req, res) => {
  const { name, type, serialNumber, assignedTo, status } = req.body;
  if (![name, type, serialNumber].every(v => typeof v === "string" && v.trim())) {
    return res.status(400).json({ error: "name, type, and serialNumber are required" });
  }
  if (assets.some(a => a.serialNumber.toLowerCase() === serialNumber.trim().toLowerCase())) {
    return res.status(409).json({ error: "Serial number already exists" });
  }
  const asset = {
    id: nextId++,
    name: name.trim(),
    type: type.trim(),
    serialNumber: serialNumber.trim(),
    assignedTo: (assignedTo || "").trim(),
    status: status || "Available"
  };
  assets.push(asset);
  res.status(201).json(asset);
});

app.put("/api/assets/:id", (req, res) => {
  const id = Number(req.params.id);
  const asset = assets.find(a => a.id === id);
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  const { name, type, serialNumber, assignedTo, status } = req.body;
  if (serialNumber && assets.some(a => a.id !== id && a.serialNumber.toLowerCase() === serialNumber.trim().toLowerCase())) {
    return res.status(409).json({ error: "Serial number already exists" });
  }
  Object.assign(asset, {
    name: name === undefined ? asset.name : String(name).trim(),
    type: type === undefined ? asset.type : String(type).trim(),
    serialNumber: serialNumber === undefined ? asset.serialNumber : String(serialNumber).trim(),
    assignedTo: assignedTo === undefined ? asset.assignedTo : String(assignedTo).trim(),
    status: status === undefined ? asset.status : String(status)
  });
  res.json(asset);
});

app.delete("/api/assets/:id", (req, res) => {
  const id = Number(req.params.id);
  const oldLength = assets.length;
  assets = assets.filter(a => a.id !== id);
  if (assets.length === oldLength) return res.status(404).json({ error: "Asset not found" });
  res.status(204).end();
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => console.log(`IT Asset Management running on port ${PORT}`));
}
module.exports = app;
