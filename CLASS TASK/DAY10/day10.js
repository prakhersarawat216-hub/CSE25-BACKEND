import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  if (req.url === "/") {
    res.end("<h1>HOME PAGE</h1>");
  } else if (req.url === "/about") {
    res.end("<h1>ABOUT PAGE</h1>");
  } else if (req.url === "/contact") {
    res.end("<h1>CONTACT PAGE</h1>");
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>404 - Page Not Found</h1>");
  }
});

server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});