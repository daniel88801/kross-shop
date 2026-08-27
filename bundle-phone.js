const fs = require("fs");
const path = require("path");

const root = __dirname;
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "js", "app.js"), "utf8");

html = html.replace(
  '<link rel="stylesheet" href="css/styles.css" />',
  `<style>\n${css}\n</style>`
);
html = html.replace('<script src="js/app.js"></script>', `<script>\n${js}\n</script>`);

html = html.replace(/<div class="phone-card" id="phone-card">[\s\S]*?<\/div>\s*<div class="promo">/, '<div class="promo">');

const images = fs.readdirSync(path.join(root, "images"));
for (const file of images) {
  const buf = fs.readFileSync(path.join(root, "images", file));
  const uri = `data:image/jpeg;base64,${buf.toString("base64")}`;
  html = html.split(`images/${file}`).join(uri);
}

const out = path.join(root, "kross-phone.html");
fs.writeFileSync(out, html);
console.log(`wrote ${out} (${Math.round(html.length / 1024)} KB)`);
