const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = __dirname;
const targets = fs.readdirSync(root)
  .filter((f) => f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.js') || f.endsWith('.css'))
  .filter((f) => !f.endsWith('.min.js') && !f.endsWith('.min.css')) // Skip minified source
  .filter((f) => !f.endsWith('.js') || f.includes('min')) // Only minified JS
  .filter((f) => f === 'app.min.js' || f === 'styles.min.css' || f === 'questions-data.min.js' || f === 'simulation-theme.css' || f.endsWith('.html'))
  .map((f) => path.join(root, f));

const gzip = (buf) => zlib.gzipSync(buf, { level: 9 });
const brotli = (buf) => zlib.brotliCompressSync(buf, {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
  },
});

let totalIn = 0;
let totalGz = 0;
let totalBr = 0;

for (const file of targets) {
  const data = fs.readFileSync(file);
  totalIn += data.length;
  const gz = gzip(data);
  const br = brotli(data);
  fs.writeFileSync(file + '.gz', gz);
  fs.writeFileSync(file + '.br', br);
  totalGz += gz.length;
  totalBr += br.length;
}

console.log(`Compressed ${targets.length} files`);
console.log(`Total input: ${(totalIn/1024).toFixed(1)} KB`);
console.log(`Total gzip: ${(totalGz/1024).toFixed(1)} KB`);
console.log(`Total brotli: ${(totalBr/1024).toFixed(1)} KB`);
