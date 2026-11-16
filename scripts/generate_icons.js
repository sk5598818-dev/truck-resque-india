const fs = require('fs');
const path = require('path');

// 1x1 transparent/orange pixel base64
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buf = Buffer.from(pngBase64, 'base64');

const dir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'icon-192.png'), buf);
fs.writeFileSync(path.join(dir, 'icon-512.png'), buf);
console.log('PNG Icons successfully generated in public/icons/');
