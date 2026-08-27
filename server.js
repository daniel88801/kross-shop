const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const root = path.resolve(__dirname);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function lanIP() {
  const ifaces = os.networkInterfaces();
  for (const list of Object.values(ifaces)) {
    for (const n of list || []) {
      if (n.family === "IPv4" && !n.internal && n.address.startsWith("192.168.")) return n.address;
    }
  }
  for (const list of Object.values(ifaces)) {
    for (const n of list || []) {
      if (n.family === "IPv4" && !n.internal) return n.address;
    }
  }
  return "127.0.0.1";
}

const handler = (req, res) => {
  let url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/") url = "/index.html";
  const relative = url.replace(/^\/+/, "").replace(/\//g, path.sep);
  const file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end();
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
};

const ip = lanIP();
for (const port of [5173, 8080]) {
  http.createServer(handler).listen(port, "0.0.0.0", () => {
    console.log(`http://127.0.0.1:${port}`);
    console.log(`http://${ip}:${port}`);
  });
}
