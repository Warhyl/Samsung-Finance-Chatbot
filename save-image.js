// This script helps save the preview image
// You can use this as reference to manually download and save the image

const fs = require('fs');
const https = require('https');
const url = 'https://your-source-url-for-the-image.png'; // Replace with the actual image URL

// Download the image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

// Usage instructions
console.log('Instructions:');
console.log('1. Save the image from the message as "sf-preview.png" in your project directory');
console.log('2. Deploy to Vercel to update the preview image');
console.log('');
console.log('If you want to download programmatically:');
console.log('1. Replace the URL in this script with the actual image URL');
console.log('2. Run: node save-image.js');

// Uncomment to download (after replacing the URL)
/*
downloadImage(url, 'sf-preview.png')
  .then(filepath => {
    console.log(`Image downloaded to ${filepath}`);
  })
  .catch(error => {
    console.error('Error downloading image:', error);
  });
*/ 