const fs = require('fs');
const path = require('path');

const mainPages = JSON.parse(fs.readFileSync('clean_pages.json', 'utf8'));
const blogPages = JSON.parse(fs.readFileSync('clean_blogs.json', 'utf8'));

let allUrls = mainPages.map(p => p['Page URL']);
allUrls.push('/blog/');
blogPages.forEach(b => allUrls.push(b['Page URL']));

console.log(`=== STARTING VERIFICATION FOR ${allUrls.length} PAGES ===`);

let checkedLinks = 0;
let checkedImages = 0;
let errorCount = 0;

allUrls.forEach(url => {
  let filePath = '';
  if (url === '/') {
    filePath = 'index.html';
  } else {
    const dir = url.replace(/^\/+|\/+$/g, '');
    filePath = path.join(dir, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: File missing for ${url} -> ${filePath}`);
    errorCount++;
    return;
  }

  const stat = fs.statSync(filePath);
  if (stat.size < 5000) {
    console.error(`ERROR: File too small (${stat.size} bytes) for ${filePath}`);
    errorCount++;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Check internal links
  const linkMatches = [...html.matchAll(/href="(\/[^"#]*)"/g)];
  linkMatches.forEach(m => {
    checkedLinks++;
    const targetUrl = m[1];
    if (targetUrl === '/' || targetUrl.startsWith('/assets/')) {
      if (targetUrl.startsWith('/assets/')) {
        const assetPath = path.join(__dirname, targetUrl);
        if (!fs.existsSync(assetPath)) {
          console.error(`BROKEN ASSET in ${filePath}: ${targetUrl}`);
          errorCount++;
        }
      }
      return;
    }
    const targetDir = targetUrl.replace(/^\/+|\/+$/g, '');
    const targetFile = path.join(__dirname, targetDir, 'index.html');
    if (!fs.existsSync(targetFile)) {
      console.error(`BROKEN LINK in ${filePath}: ${targetUrl} -> ${targetFile}`);
      errorCount++;
    }
  });

  // Check images
  const imgMatches = [...html.matchAll(/src="(\/assets\/images\/[^"]+)"/g)];
  imgMatches.forEach(m => {
    checkedImages++;
    const imgSrc = m[1];
    const imgPath = path.join(__dirname, imgSrc);
    if (!fs.existsSync(imgPath)) {
      console.error(`MISSING IMAGE in ${filePath}: ${imgSrc}`);
      errorCount++;
    }
  });
});

console.log(`Verification Complete:`);
console.log(`  Total Pages Checked: ${allUrls.length}`);
console.log(`  Internal Links Checked: ${checkedLinks}`);
console.log(`  Images Checked: ${checkedImages}`);
console.log(`  Errors Found: ${errorCount}`);

if (errorCount === 0) {
  console.log('SUCCESS: All 27 pages, all links, and all images verified with 0 errors!');
} else {
  process.exit(1);
}