const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/song', (req, res) => {
  // For simplicity, we use a hardcoded song. In a real app, you might fetch this from a database.
  res.json({ song: 'Imagine' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
