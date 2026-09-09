import express from "express";
import fs from fs;
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    fs.readFile("./pages/index"