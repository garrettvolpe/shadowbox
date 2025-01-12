const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3001;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to list audio files
app.get('/audio-files', (req, res) => {
    const audioDir = path.join(__dirname, 'public', 'audio');
    const folders = ['basics', 'combos', 'advanced'];
    const files = {};

    folders.forEach(folder => {
        const folderPath = path.join(audioDir, folder);
        if (fs.existsSync(folderPath)) {
            files[folder] = fs.readdirSync(folderPath).filter(file => file.endsWith('.mp3'));
        } else {
            files[folder] = [];
        }
    });

    res.json(files);
});

// Endpoint to serve config.html
app.get('/config', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'config.html'));
}); 

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});