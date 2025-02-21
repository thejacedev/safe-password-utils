const fs = require('fs');
const path = require('path');

// Copy JSON files to dist
const dataDir = path.join(__dirname, '../lib/data');
const distCjsDataDir = path.join(__dirname, '../dist/cjs/data');
const distEsmDataDir = path.join(__dirname, '../dist/esm/data');

// Create directories if they don't exist
fs.mkdirSync(distCjsDataDir, { recursive: true });
fs.mkdirSync(distEsmDataDir, { recursive: true });

// Copy JSON files
fs.readdirSync(dataDir)
  .filter(file => file.endsWith('.json'))
  .forEach(file => {
    fs.copyFileSync(
      path.join(dataDir, file),
      path.join(distCjsDataDir, file)
    );
    fs.copyFileSync(
      path.join(dataDir, file),
      path.join(distEsmDataDir, file)
    );
  });

// Add package.json to ESM directory to ensure Node.js treats it as ESM
fs.writeFileSync(
  path.join(__dirname, '../dist/esm/package.json'),
  JSON.stringify({ type: 'module' }, null, 2)
); 