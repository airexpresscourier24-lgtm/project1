const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\rakesh\\.gemini\\antigravity-ide\\brain\\7a67d6f5-0ecc-4ca8-853a-6ded3c120aef';
const destDir = path.join(__dirname, 'assets', 'images');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = [
    { src: 'media__1791554294850.jpg', dest: 'logo.jpg' },
    { src: 'hero_cargo_plane_1791554403945.png', dest: 'hero1.png' },
    { src: 'hero_global_delivery_1791554422711.png', dest: 'hero2.png' },
    { src: 'hero_air_freight_1791554440495.png', dest: 'hero3.png' },
    { src: 'hero_packaging_care_1791554461659.png', dest: 'hero4.png' }
];

files.forEach(item => {
    const srcPath = path.join(srcDir, item.src);
    const destPath = path.join(destDir, item.dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${item.src} -> ${item.dest}`);
    } else {
        console.log(`Source file not found: ${srcPath}`);
    }
});
