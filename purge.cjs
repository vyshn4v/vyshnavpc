const fs = require('fs');
const path = require('path');

function getFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file, ext));
    } else if (file.endsWith(ext)) {
      results.push(file);
    }
  }
  return results;
}

const hbsFiles = getFiles('src/hbs-templates', '.hbs');
const jsFiles = getFiles('src/public/js', '.js');
const dbFile = ['updated_profile.json'];

let allWords = new Set();

function extractWords(file) {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  // Match any valid CSS class name characters
  const words = content.match(/[a-zA-Z0-9_-]+/g);
  if (words) {
    words.forEach(w => allWords.add(w));
  }
}

hbsFiles.forEach(extractWords);
jsFiles.forEach(extractWords);
dbFile.forEach(extractWords);

// We must also keep global tags and pseudo classes
const whitelist = new Set(['html', 'body', 'a', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'p', 'span', 'div', 'img', 'svg', 'path', 'button', 'input', 'textarea', 'nav', 'header', 'footer', 'section', 'article', 'main', 'strong', 'em', 'code', 'pre', 'hover', 'focus', 'active', 'before', 'after', 'root', 'nth-child', 'first-child', 'last-child', 'dark']);

// Read CSS
const cssFile = 'src/public/css/post.css';
let css = fs.readFileSync(cssFile, 'utf8');

// A very naive CSS parser: split by '}'
const blocks = css.split('}');
let newCss = '';

let removedCount = 0;

for (let block of blocks) {
  if (!block.trim()) continue;
  
  // separate selector from body
  const parts = block.split('{');
  if (parts.length < 2) {
    newCss += block + '}';
    continue;
  }
  
  const selectors = parts[0];
  const body = parts.slice(1).join('{');
  
  // Check if it's a media query or keyframes
  if (selectors.includes('@media') || selectors.includes('@keyframes')) {
    newCss += block + '}';
    continue;
  }

  // Extract all class names from selector (.classname)
  const classMatches = selectors.match(/\.([a-zA-Z0-9_-]+)/g);
  
  let isUsed = true;
  if (classMatches) {
    // A rule is used if ALL of its required classes are found? 
    // Actually, to be safe, if ANY class in the selector is NOT in the codebase, the rule is probably unused.
    // Wait, what about .card.active ? If 'card' is used and 'active' is used, it's kept.
    for (let cls of classMatches) {
      const className = cls.substring(1); // remove '.'
      if (!allWords.has(className) && !whitelist.has(className)) {
        isUsed = false;
        break;
      }
    }
  }
  
  if (isUsed) {
    newCss += block + '}';
  } else {
    removedCount++;
    // console.log('Removed:', selectors.trim());
  }
}

fs.writeFileSync(cssFile, newCss);
console.log('Removed', removedCount, 'unused CSS rules from premium-theme.css');
