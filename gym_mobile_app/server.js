const express = require('express');
const path = require('path');
const app = express();

// Try both possible output directories
const distPath = path.join(__dirname, 'dist');
const webBuildPath = path.join(__dirname, 'web-build');

// Check which one exists and use it
const staticPath = require('fs').existsSync(distPath) ? distPath : webBuildPath;

console.log(`Serving from: ${staticPath}`);
app.use(express.static(staticPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));