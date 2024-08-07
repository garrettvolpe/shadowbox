const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/audio-files', (req, res) => {
  const audioDir = path.join(__dirname, 'public', 'audio');
  fs.readdir(audioDir, (err, files) => {
    if (err) {
      res.status(500).send('Error reading audio files');
    } else {
      const audioFiles = files.filter(file => path.extname(file) === '.mp3');
      res.json(audioFiles);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
