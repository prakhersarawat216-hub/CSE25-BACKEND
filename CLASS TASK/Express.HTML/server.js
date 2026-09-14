import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = 3000;
const pagesDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "pages");

app.use(express.urlencoded({ extended: false }));

const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;"
}[character]));

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(pagesDirectory, "styles.css"));
});

const servePage = (pageName) => (req, res) => {
  const pagePath = path.join(pagesDirectory, pageName);

  fs.readFile(pagePath, "utf8", (error, html) => {
    if (error) {
      return res.status(500).send("Unable to load the page.");
    }

    res.type("html").send(html);
  });
};

app.get("/", servePage("index.html"));
app.get("/about", servePage("about.html"));
app.get("/contact", servePage("contact.html"));

app.post("/contact", (req, res) => {
  const { name, email, project } = req.body;

  if (!name?.trim() || !email?.trim() || !project?.trim()) {
    return res.status(400).send("Please complete your name, email, and project details.");
  }

  const safeName = escapeHtml(name.trim());
  console.log(`New enquiry from ${name.trim()} <${email.trim()}>`);
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles.css" />
    <title>Thank You | Northstar Studio</title>
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="/" aria-label="Northstar Studio home"><span class="brand-mark">N</span> Northstar Studio</a>
    </header>
    <main>
      <section class="page-hero">
        <p class="eyebrow">Message received</p>
        <h1>Thanks, ${safeName}.</h1>
        <p class="lead">We have your note and will be in touch soon. In the meantime, take another look around the studio.</p>
        <a class="button" href="/">Back to home <span aria-hidden="true">&nbsp;↗</span></a>
      </section>
    </main>
  </body>
</html>`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
