const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv").config();
const express = require("express");
const path = require("path");

const port = process.env.PORT || 5000;
const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create database directory and project.json if they don't exist
const dbDir = path.join(__dirname, "database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(path.join(dbDir, "project.json"), "[]", "utf8");
}

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

const projectRoutes = require("./routes/route");
app.use("/api/projects", projectRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
