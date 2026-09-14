const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (_req, res) => {
  res.json({ status: 'online', service: 'portfolio' });
});

const server = app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing server or run with PORT=3001.`);
    process.exit(1);
  }

  throw error;
});
