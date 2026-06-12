const fs = require('fs');
const path = require('path');

const hbsPath = path.join(__dirname, 'src', 'hbs-templates', 'partials', 'footer.hbs');
const cssDir = path.join(__dirname, 'src', 'public', 'css');

// 1. Update footer.hbs
const newFooterHbs = `<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-content">
      <span class="footer-name">Vyshnav P C</span>
      <p class="footer-copy">© {{footer.year}} Vyshnav — All rights reserved</p>
      <p class="footer-tag">{{footer.tagline}}</p>
    </div>
    <div class="footer-map reveal">
      <iframe class="kannur-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125026.17511400262!2d75.29177218685149!3d11.87447746765715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba422b9b2aca753%3A0x380605a11ce24f6c!2sKannur%2C%20Kerala!5e0!3m2!1sen!2sin!4v1717904000000!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</footer>`;

fs.writeFileSync(hbsPath, newFooterHbs, 'utf8');
console.log('✅ Updated footer.hbs');

// 2. Update CSS files
const newCssRules = `
.footer-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.footer-map {
    width: 300px;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    border: 1px solid var(--border);
    background: var(--bg2);
}
.kannur-map {
    width: 100%;
    height: 100%;
    border: none;
    filter: grayscale(100%) invert(92%) hue-rotate(180deg) contrast(1.1);
    opacity: 0.8;
    transition: opacity 0.3s ease, filter 0.3s ease;
}
.footer-map:hover .kannur-map {
    opacity: 1;
    filter: grayscale(80%) invert(92%) hue-rotate(180deg) contrast(1.2);
}
@media (max-width: 600px) {
    .footer-inner {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 20px !important;
    }
    .footer-map {
        width: 100%;
        height: 180px;
    }
}
`;

const files = fs.readdirSync(cssDir);
files.forEach(file => {
    if (file.endsWith('.css')) {
        const filePath = path.join(cssDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // If it has .footer-inner, inject our new css
        if (content.includes('.footer-inner {') && !content.includes('.kannur-map')) {
            // make footer-inner align-items flex-end instead of center if we want
            content = content.replace(/align-items:\s*center;/g, 'align-items: flex-end;');
            
            // append the new css at the end of the file or after .footer-tag
            content += '\\n' + newCssRules;
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(\`✅ Injected map CSS into \${file}\`);
        }
    }
});

console.log('All done!');
