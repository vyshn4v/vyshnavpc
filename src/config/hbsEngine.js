import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "node:url";
const file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(file_name);
import { create } from "express-handlebars";
export default function initializeHbsEngine(express, app) {
  const hbs = create({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "../hbs-templates", "layouts"),
    partialsDir: path.join(__dirname, "../hbs-templates", "partials"),
    helpers: {
      // json: function (value) {
      //   return JSON.stringify(value);
      // },
      slugify: (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      isGithubUrl: (url) => url && url.includes("github.com"),
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
      // times: function (n, options) {
      //   let result = "";
      //   for (let i = 0; i < n; i++) result += options.fn(i);
      //   return result;
      // },
      // renderArt: function (art) {
      //   return new Handlebars.SafeString(renderArtFn(art));
      // },
      // fmtDate: function (iso) {
      //   return new Date(iso).toLocaleDateString("en-GB", {
      //     month: "short",
      //     year: "numeric",
      //   });
      // },
      // lowerCase: function (str) {
      //   return (str || "").toLowerCase();
      // },
      // eq: function (a, b) {
      //   return a === b;
      // },
      // skillIcon: function (name, color) {
      //   return new Handlebars.SafeString(skillIcon(name, color));
      // },
    },
  });
  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "../hbs-templates/layouts"));
  app.use(express.static(path.join(__dirname, "../public")));
  
  // Expose env variables globally to all handlebars templates
  app.locals.siteEmail = process.env.MAIL_TO || "vyshnavpcnaravoor@gmail.com";
}
