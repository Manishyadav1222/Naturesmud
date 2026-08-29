const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const uploadDir = 'C:\\\\Users\\\\manish yadav\\\\.gemini\\\\antigravity-ide\\\\brain\\\\3372673c-9387-47f0-ac33-e0ddaa425ec3\\\\.tempmediaStorage';
const files = fs.readdirSync(uploadDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

async function scan() {
  for (const file of files) {
    const fullPath = path.join(uploadDir, file);
    console.log(`Scanning ${file}...`);
    const { data: { text } } = await Tesseract.recognize(fullPath, 'eng');
    const firstFewLines = text.split('\n').filter(l => l.trim().length > 0).slice(0, 10).join(' | ');
    console.log(`-> ${firstFewLines}\n`);
  }
}

scan();
