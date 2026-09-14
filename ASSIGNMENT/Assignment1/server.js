const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'students.json');

function readStudents() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.writeFileSync(DATA_FILE, '[]');
      return [];
    }
    throw error;
  }
}

function sendHtml(response, statusCode, html) {
  response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(html);
}

function page(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Records</title>
  <style>
    :root { color-scheme: light; font-family: Georgia, 'Times New Roman', serif; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; color: #19324a; background: #f4f0e8; }
    header { padding: 42px max(24px, calc((100% - 980px) / 2)); background: #19324a; color: #fffdf7; }
    header p { margin: 8px 0 0; color: #bed9d5; font-family: Arial, sans-serif; }
    main { width: min(980px, calc(100% - 48px)); margin: 42px auto; }
    h1, h2 { margin-top: 0; font-weight: 500; letter-spacing: 0; }
    .panel { padding: 30px; background: #fffdf7; border: 1px solid #d6cdbd; box-shadow: 10px 10px 0 #d9e8e3; }
    form { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    label { display: grid; gap: 8px; font-family: Arial, sans-serif; font-size: 0.85rem; font-weight: 700; }
    input { width: 100%; padding: 12px; border: 1px solid #aab8b4; background: #fff; color: #19324a; font: inherit; }
    input:focus { outline: 3px solid #bed9d5; border-color: #19324a; }
    button { grid-column: 1 / -1; justify-self: start; padding: 13px 24px; border: 0; background: #d9684b; color: #fff; font: 700 0.9rem Arial, sans-serif; cursor: pointer; }
    button:hover { background: #b94f36; }
    a { color: #b94f36; font-family: Arial, sans-serif; font-weight: 700; }
    .notice { margin-bottom: 24px; padding: 14px 16px; background: #d9e8e3; font-family: Arial, sans-serif; }
    table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
    th, td { padding: 14px 10px; border-bottom: 1px solid #d6cdbd; text-align: left; }
    th { color: #b94f36; font-size: 0.8rem; text-transform: uppercase; }
    @media (max-width: 640px) { main { width: min(100% - 28px, 980px); margin: 28px auto; } .panel { padding: 20px; } form { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header><h1>Student Records</h1><p>A simple register for keeping every learner in view.</p></header>
  <main>${content}</main>
</body>
</html>`;
}

function formPage(message = '') {
  const notice = message ? `<div class="notice">${message}</div>` : '';
  return page(`${notice}
<section class="panel">
  <h2>Add a student</h2>
  <form method="POST" action="/students">
    <label>Student Name <input name="name" type="text" required></label>
    <label>Roll Number <input name="rollNumber" type="text" required></label>
    <label>Course <input name="course" type="text" required></label>
    <label>Email <input name="email" type="email" required></label>
    <button type="submit">Add Student</button>
  </form>
  <p><a href="/students">View all student records</a></p>
</section>`);


}

function studentsPage() {
  const students = readStudents();
  const rows = students.length
    ? students.map((student) => `<tr><td>${student.name}</td><td>${student.rollNumber}</td><td>${student.course}</td><td>${student.email}</td></tr>`).join('')
    : '<tr><td colspan="4">No student records yet.</td></tr>';

  return page(`<section class="panel">
  <h2>Student records</h2>
  <table>
    <thead><tr><th>Name</th><th>Roll Number</th><th>Course</th><th>Email</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p><a href="/">Add another student</a></p>
</section>`);
}

function handleStudentSubmission(request, response) {
  let body = '';
  request.on('data', (chunk) => { body += chunk; });
  request.on('end', () => {
    const formData = new URLSearchParams(body);
    const student = {
      name: formData.get('name')?.trim(),
      rollNumber: formData.get('rollNumber')?.trim(),
      course: formData.get('course')?.trim(),
      email: formData.get('email')?.trim()
    };

    if (Object.values(student).some((value) => !value)) {
      sendHtml(response, 400, formPage('Please complete every field before submitting.'));
      return;
    }

    try {
      const students = readStudents();
      students.push(student);
      fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
      response.writeHead(303, { Location: '/students' });
      response.end();
    } catch (error) {
      console.error(error);
      sendHtml(response, 500, formPage('The record could not be saved.'));
    }
  });
}

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    sendHtml(response, 200, formPage());
    return;
  }

  if (request.method === 'GET' && request.url === '/students') {
    try {
      sendHtml(response, 200, studentsPage());
    } catch (error) {
      console.error(error);
      sendHtml(response, 500, page('<section class="panel"><h2>Unable to load records</h2></section>'));
    }
    return;
  }

  if (request.method === 'POST' && request.url === '/students') {
    handleStudentSubmission(request, response);
    return;
  }

  sendHtml(response, 404, page('<section class="panel"><h2>Page not found</h2><p><a href="/">Return to the form</a></p></section>'));
});

server.listen(PORT, () => {
  console.log(`Student Records server running at http://localhost:${PORT}`);
});