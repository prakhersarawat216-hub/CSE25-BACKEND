import express from "express";
import https from "node:https";
import fs from "node:fs";

const app = express();
app.use(express.json());

let users = [
  {
    id: 1,
    name: "A",
    email: "A@abes.ac.in",
  },
  {
    id: 2,
    name: "B",
    email: "B@abes.ac.in",
  },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const user = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };

  users.push(user);
  res.json(user);
});

const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost-cert.pem"),
};

https.createServer(options, app).listen(8443, () => {
  console.log("Server is running on https://localhost:8443");
});