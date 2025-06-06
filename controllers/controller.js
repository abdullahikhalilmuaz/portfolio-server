const fs = require("fs");
const path = require("path");

const projectFilePath = path.join(__dirname, "../database/project.json");

// Helper function to read projects
const readProjects = () => {
  try {
    const data = fs.readFileSync(projectFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading projects:", err);
    return [];
  }
};

// Helper function to write projects
const writeProjects = (projects) => {
  try {
    fs.writeFileSync(
      projectFilePath,
      JSON.stringify(projects, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error writing projects:", err);
    throw err;
  }
};

// Get all projects
const getAllProjects = (req, res) => {
  try {
    const projects = readProjects();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to load projects" });
  }
};

// Create a new project
const createProject = (req, res) => {
  try {
    const { description, hashtags, comments, githubLink, hostedLink } =
      req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const projects = readProjects();
    const newProject = {
      id: Date.now().toString(),
      description,
      hashtags: hashtags ? hashtags.split(",") : [],
      comments: comments ? JSON.parse(comments) : [],
      githubLink: githubLink || null,
      hostedLink: hostedLink || null,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    writeProjects(projects);

    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// Get a single project by ID
const getProjectById = (req, res) => {
  try {
    const projects = readProjects();
    const project = projects.find((p) => p.id === req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to get project" });
  }
};

// Update a project
const updateProject = (req, res) => {
  try {
    const { description, hashtags, comments, githubLink, hostedLink } =
      req.body;
    const projects = readProjects();
    const projectIndex = projects.findIndex((p) => p.id === req.params.id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = {
      ...projects[projectIndex],
      description: description || projects[projectIndex].description,
      hashtags: hashtags
        ? hashtags.split(",")
        : projects[projectIndex].hashtags,
      comments: comments
        ? JSON.parse(comments)
        : projects[projectIndex].comments,
      githubLink: githubLink || projects[projectIndex].githubLink,
      hostedLink: hostedLink || projects[projectIndex].hostedLink,
      updatedAt: new Date().toISOString(),
    };

    if (req.file) {
      // Delete old image if it exists
      if (projects[projectIndex].image) {
        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          projects[projectIndex].image.split("/uploads/")[1]
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedProject.image = `/uploads/${req.file.filename}`;
    }

    projects[projectIndex] = updatedProject;
    writeProjects(projects);

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// Delete a project
const deleteProject = (req, res) => {
  try {
    const projects = readProjects();
    const projectIndex = projects.findIndex((p) => p.id === req.params.id);

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete associated image if it exists
    if (projects[projectIndex].image) {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        projects[projectIndex].image.split("/uploads/")[1]
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    projects.splice(projectIndex, 1);
    writeProjects(projects);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
