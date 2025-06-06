const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/controller");
const multer = require("../middleware/multer");

router.get("/", getAllProjects);
router.post("/", multer.single("image"), createProject);
router.get("/:id", getProjectById);
router.put("/:id", multer.single("image"), updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
