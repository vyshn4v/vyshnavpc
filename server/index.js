// importing necessary modules
import express from "express";
import { create } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

// importing the portfolio data
import portfolio from "./data/portfolio.js";

// __dirname is not available in ES modules, so we need to create it manually
const file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(file_name);

// creating an instance of express
const app = express();
const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "hbs-templates", "layouts"),
  partialsDir: path.join(__dirname, "hbs-templates", "partials"),
  helpers: {
    json: (value) => JSON.stringify(value),
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
});

// setting up the static files directory
app.use(express.static(path.join(__dirname, "public")));
// setting up the view engine and views directory
app.get("/", (req, res) => {
  const clientData = {
    email: portfolio.personal.email,
    skillCategories: portfolio.skills.categories,
  };
  res.render("landing-page", {
    ...portfolio,
    skillsJSON: JSON.stringify(clientData),
  });
});
app.get("/blogs", (req, res) => {
  const clientData = {
    email: portfolio.personal.email,
    skillCategories: portfolio.skills.categories,
  };
  res.render("blogs", {
    ...portfolio,
    skillsJSON: JSON.stringify(clientData),
  });
});
// handling 404 errors for undefined routes
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" });
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "hbs-templates/layouts"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
