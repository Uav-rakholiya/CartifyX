// contrast-audit.js
// Simple, dependency-free color contrast auditor for frontend/src
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'src');
const OUT_REPORT = path.join(__dirname, '..', 'contrast-report.json');
const OUT_SUGGEST = path.join(__dirname, '..', 'contrast-suggestions.json');

function walk(dir, exts, files=[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, exts, files);
    else if (exts.includes(path.extname(e.name).toLowerCase())) files.push(full);
  }
  return files;
}

function extractCSSBlocks(text) {
  // crude: capture braces content
  const blocks = [];
  const re = /([^{]+)\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(text))) {
    blocks.push({selector: m[1].trim(), body: m[2].trim()});
  }
  return blocks;
}

function findInlineStyles(text) {
  const res = [];
  const re = /style\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) {
    res.push(m[1]);
  }
  return res;
}

function findColorsInString(s) {
  const colors = [];
  const hex = /#([0-9a-fA-F]{3,8})\b/g;
  const func = /(rgba?|hsla?)\([^\)]+\)/g;
  let m;
  while ((m = hex.exec(s))) colors.push(m[0]);
  while ((m = func.exec(s))) colors.push(m[0]);
  return colors;
}

function parseDeclarations(body) {
  const decl = {};
  const lines = body.split(/;\s*/);
  for (let l of lines) {
    l = l.trim();
    if (!l) continue;
    const parts = l.split(/:\s*/);
    if (parts.length>=2) {
      const k = parts[0].toLowerCase();
      const v = parts.slice(1).join(':');
      decl[k] = v.trim();
    }
  }
  return decl;
}

// color utilities
function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length===3) hex = hex.split('').map(c=>c+c).join('');
  if (hex.length===6) {
    return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16),1];
  }
  if (hex.length===8) {
    return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16), parseInt(hex.slice(6,8),16)/255];
  }
  return null;
}

function parseColor(str) {
  str = str.trim();
  if (str.startsWith('#')) return hexToRgb(str);
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(',').map(p=>p.trim());
    const r = parseFloat(parts[0]);
    const g = parseFloat(parts[1]);
    const b = parseFloat(parts[2]);
    const a = parts[3] ? parseFloat(parts[3]) : 1;
    return [r,g,b,a];
  }
  // not handling hsl for brevity
  return null;
}

function srgbToLin(c) {
  c = c/255;
  return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
}

function lum(rgb) {
  const r = srgbToLin(rgb[0]);
  const g = srgbToLin(rgb[1]);
  const b = srgbToLin(rgb[2]);
  return 0.2126*r + 0.7152*g + 0.0722*b;
}

function contrastRatio(fg, bg) {
  if (!fg || !bg) return null;
  const L1 = lum(fg);
  const L2 = lum(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixColors(c1, c2, t){
  // c1 and c2 are [r,g,b,a]
  return [
    Math.round(c1[0]*(1-t) + c2[0]*t),
    Math.round(c1[1]*(1-t) + c2[1]*t),
    Math.round(c1[2]*(1-t) + c2[2]*t),
    c1[3]*(1-t) + c2[3]*t
  ];
}

function findBestForeground(fg, bg, target=4.5){
  // try mixing fg towards white and black
  const white = [255,255,255,1];
  const black = [0,0,0,1];
  for (let i=0;i<=100;i++){
    const t = i/100;
    const cand = mixColors(fg, white, t);
    if (contrastRatio(cand,bg) >= target) return cand;
  }
  for (let i=0;i<=100;i++){
    const t = i/100;
    const cand = mixColors(fg, black, t);
    if (contrastRatio(cand,bg) >= target) return cand;
  }
  return null;
}

function rgbToHex(rgb){
  return '#'+[0,1,2].map(i=>('0'+Math.round(rgb[i]).toString(16)).slice(-2)).join('');
}

function audit() {
  const exts = ['.css','.scss','.html','.svg'];
  const files = walk(ROOT, exts);
  const items = [];
  for (const f of files) {
    const txt = fs.readFileSync(f,'utf8');
    // CSS blocks
    const blocks = extractCSSBlocks(txt);
    for (const b of blocks) {
      const decl = parseDeclarations(b.body);
      const colorStr = decl['color'] || decl['--color'] || decl['--theme-primary'] || null;
      const bgStr = decl['background-color'] || decl['background'] || decl['background-image'] ? (decl['background-color'] || decl['background']) : null;
      const colors = findColorsInString(b.body);
      let fg=null, bg=null;
      if (colorStr) fg = parseColor(colorStr) || null;
      if (!fg && colors.length>0) {
        // pick first color as fg heuristic
        fg = parseColor(colors[0]) || null;
      }
      if (bgStr) bg = parseColor(bgStr) || null;
      if (!bg && colors.length>1) bg = parseColor(colors[1]) || null;
      if (fg && bg) {
        const ratio = contrastRatio(fg,bg);
        items.push({file: f, selector: b.selector, fg: fg, bg:bg, ratio: +(ratio||0).toFixed(2)});
      }
    }

    // inline styles
    const inline = findInlineStyles(txt);
    for (const s of inline) {
      const decl = parseDeclarations(s);
      const fg = decl['color']?parseColor(decl['color']):null;
      const bg = (decl['background-color']||decl['background'])? parseColor(decl['background-color']||decl['background']):null;
      if (fg && bg) {
        const ratio = contrastRatio(fg,bg);
        items.push({file:f, selector:'[inline style]', fg, bg, ratio: +(ratio||0).toFixed(2)});
      }
    }
  }

  // filter failures
  const failures = items.filter(it=>it.ratio < 4.5);
  // create suggestions
  const suggestions = failures.map(it=>{
    const best = findBestForeground(it.fg, it.bg, 4.5);
    return {
      file: it.file,
      selector: it.selector,
      currentFg: rgbToHex(it.fg),
      bg: rgbToHex(it.bg),
      ratio: it.ratio,
      suggestedFg: best? rgbToHex(best) : null
    };
  });

  fs.writeFileSync(OUT_REPORT, JSON.stringify({items, failures}, null, 2));
  fs.writeFileSync(OUT_SUGGEST, JSON.stringify(suggestions, null, 2));
  console.log('Audit complete. Report:', OUT_REPORT);
  console.log('Suggestions:', OUT_SUGGEST);
}

try { audit(); } catch(e){ console.error(e); process.exit(1); }
