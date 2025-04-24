// This is a simple Node.js script to convert SVG to PNG if needed
// Install dependencies first: npm install sharp

const sharp = require('sharp');
const fs = require('fs');

// Read the SVG file
const svgBuffer = fs.readFileSync('preview-image.svg');

// Convert to PNG with sharp
sharp(svgBuffer)
  .png()
  .toFile('preview-image.png')
  .then(() => {
    console.log('Successfully converted SVG to PNG');
  })
  .catch(err => {
    console.error('Error converting file:', err);
  }); 