// ---------- Manga Page helpers (from the reference style, adapted for a 9:16 canvas with a pixel scale) ----------
const TAU = Math.PI * 2;
const RED = '#e0261b', PAPERC = '#fbfaf6';
let PS = 1; // device pixels per logical pixel, set by explainer()

function poly(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }
function catmull(pts, n = 8, closed = false) {
  const out = [], N = pts.length, get = (i) => closed ? pts[(i + N) % N] : pts[Math.max(0, Math.min(N - 1, i))];
  const segs = closed ? N : N - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((j) => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  if (!closed) out.push(pts[N - 1]);
  return out;
}
// brush stroke with taper: pts polyline, w max width, prof(t) width profile
function brush(ctx, pts, w, prof = (t) => Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.55)) {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1;
    const ww = w * prof(i / (n - 1)) / 2 + 0.25;
    L.push([pts[i][0] - ty / m * ww, pts[i][1] + tx / m * ww]); R.push([pts[i][0] + ty / m * ww, pts[i][1] - tx / m * ww]);
  }
  ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]); for (const p of L) ctx.lineTo(p[0], p[1]); for (let i = n - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]); ctx.closePath(); ctx.fill();
}
const bz = (p0, p1, p2, p3, n = 24) => { const o = []; for (let k = 0; k <= n; k++) { const t = k / n, m = 1 - t; o.push([m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0], m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]]); } return o; };
// radial focus lines (集中線)
function focusLines(ctx, cx, cy, r0, r1, n, r, wMax = 4.5) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, w = r.range(0.4, wMax) * (r.chance(0.15) ? 2 : 1), ri = r0 * r.range(1, 1.6), da = w / r1;
    ctx.moveTo(cx + Math.cos(a) * ri, cy + Math.sin(a) * ri);
    ctx.lineTo(cx + Math.cos(a - da) * r1, cy + Math.sin(a - da) * r1);
    ctx.lineTo(cx + Math.cos(a + da) * r1, cy + Math.sin(a + da) * r1);
    ctx.closePath();
  }
  ctx.fill();
}
// hand-brushed katakana for SFX (stroke paths in a unit box; each stroke tapers like a brush)
const KANA = {
  'ゴ': [[[0.08, 0.26], [0.45, 0.24], [0.76, 0.22], [0.78, 0.55], [0.8, 0.9]], [[0.1, 0.9], [0.45, 0.9], [0.8, 0.9]], [[0.86, 0.02], [0.9, 0.16]], [[0.99, -0.02], [1.03, 0.12]]],
  'ピ': [[[0.24, 0.08], [0.22, 0.5], [0.26, 0.86], [0.55, 0.88], [0.86, 0.84]], [[0.24, 0.5], [0.5, 0.42], [0.74, 0.32]], ['o', 0.9, 0.12, 0.09]],
  'ッ': [[[0.18, 0.36], [0.26, 0.56]], [[0.44, 0.3], [0.52, 0.5]], [[0.82, 0.3], [0.78, 0.62], [0.55, 0.86], [0.3, 0.98]]],
  'ド': [[[0.38, 0.02], [0.38, 0.5], [0.38, 0.98]], [[0.4, 0.4], [0.6, 0.48], [0.78, 0.6]], [[0.74, 0.04], [0.78, 0.18]], [[0.88, 0.0], [0.92, 0.14]]],
  'ク': [[[0.42, 0.04], [0.3, 0.26], [0.12, 0.46]], [[0.36, 0.2], [0.6, 0.2], [0.86, 0.2], [0.76, 0.56], [0.5, 0.84], [0.24, 0.98]]],
  'ン': [[[0.14, 0.16], [0.26, 0.24], [0.38, 0.36]], [[0.12, 0.92], [0.5, 0.78], [0.76, 0.52], [0.92, 0.22]]],
  'ー': [[[0.06, 0.5], [0.5, 0.48], [0.94, 0.5]]],
  'カ': [[[0.12, 0.3], [0.5, 0.29], [0.84, 0.27], [0.83, 0.62], [0.76, 0.92], [0.6, 0.84]], [[0.46, 0.04], [0.42, 0.5], [0.14, 0.96]]],
  // new for this piece
  'バ': [[[0.4, 0.28], [0.26, 0.6], [0.1, 0.92]], [[0.62, 0.26], [0.74, 0.58], [0.92, 0.9]], [[0.76, 0.0], [0.8, 0.14]], [[0.9, -0.03], [0.94, 0.11]]],
  'キ': [[[0.16, 0.34], [0.5, 0.3], [0.86, 0.22]], [[0.12, 0.58], [0.5, 0.54], [0.9, 0.5]], [[0.58, 0.04], [0.44, 0.5], [0.32, 0.98]]],
  'ザ': [[[0.1, 0.4], [0.5, 0.38], [0.86, 0.34]], [[0.32, 0.14], [0.31, 0.3], [0.3, 0.5]], [[0.66, 0.1], [0.62, 0.6], [0.4, 0.98]], [[0.84, 0.0], [0.88, 0.14]], [[0.97, -0.03], [1.01, 0.11]]],
};
function kanaStrokes(ctx, ch, x, y, size, rot, skew, extra, prof) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.transform(1, 0, skew, 1, 0, 0);
  for (const st of KANA[ch]) {
    if (st[0] === 'o') { ctx.beginPath(); ctx.arc((st[1] - 0.5) * size, (st[2] - 0.5) * size, st[3] * size, 0, TAU); ctx.lineWidth = size * 0.05 + extra * 2; ctx.stroke(); continue; }
    const pts = catmull(st.map(([u, v]) => [(u - 0.5) * size, (v - 0.5) * size]), 6);
    const n = pts.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1;
      const tt = i / (n - 1), ww = size * 0.14 * prof(tt, st.length) / 2 + extra;
      L.push([pts[i][0] - ty / m * ww, pts[i][1] + tx / m * ww]); R.push([pts[i][0] + ty / m * ww, pts[i][1] - tx / m * ww]);
    }
    ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]); for (const p of L) ctx.lineTo(p[0], p[1]);
    for (let i = n - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(pts[0][0], pts[0][1], size * 0.14 * prof(0, st.length) / 2 + extra, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// katakana SFX glyph: black outer line, white knock-out border, ink (or spot colour) fill
function sfx(ctx, ch, x, y, size, rot, skew = -0.2, outline = 8, fill = '#000') {
  const prof = (tt, len) => len <= 2 ? (1.25 - tt * 0.9) : (1.1 - 0.75 * Math.pow(tt, 1.6));
  ctx.save(); ctx.lineCap = 'round';
  ctx.fillStyle = '#000'; ctx.strokeStyle = '#000'; kanaStrokes(ctx, ch, x, y, size, rot, skew, outline + 2.2, prof);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; kanaStrokes(ctx, ch, x, y, size, rot, skew, outline, prof);
  ctx.fillStyle = fill; ctx.strokeStyle = fill; kanaStrokes(ctx, ch, x, y, size, rot, skew, 0, prof);
  ctx.restore();
}
function bubble(ctx, cx, cy, rx, ry, tail, lines, font, lh) {
  const pts = [];
  for (let k = 0; k < 60; k++) { const a = k / 60 * TAU; pts.push([cx + Math.cos(a) * rx * (1 + 0.03 * Math.sin(a * 3)), cy + Math.sin(a) * ry]); }
  const ta = Math.atan2(tail[1] - cy, tail[0] - cx);
  const b1 = [cx + Math.cos(ta - 0.22) * rx * 0.85, cy + Math.sin(ta - 0.22) * ry * 0.85], b2 = [cx + Math.cos(ta + 0.22) * rx * 0.85, cy + Math.sin(ta + 0.22) * ry * 0.85];
  const tailP = [b1, [(b1[0] + tail[0]) / 2 + 6, (b1[1] + tail[1]) / 2 - 4], tail, [(b2[0] + tail[0]) / 2 + 2, (b2[1] + tail[1]) / 2 + 2], b2];
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 3.4;
  poly(ctx, pts); ctx.stroke(); poly(ctx, tailP); ctx.stroke();
  poly(ctx, pts); ctx.fill(); poly(ctx, tailP); ctx.fill();
  ctx.fillStyle = '#000'; ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * lh));
  ctx.restore();
}

// cached screentone dot patterns (45 degree grid), rendered at device resolution so the dots stay crisp
const TONES = {};
function tone(ctx, d) {
  const key = Math.round(d * 20);
  if (!TONES[key]) {
    const p = 5.4 * Math.SQRT2, NC = 16, lw = Math.round(p * NC), c = H.layer(Math.round(lw * PS), Math.round(lw * PS)), x = c.getContext('2d'), s = lw / NC;
    x.scale(PS, PS);
    const rr = Math.min(s * 0.5, s / Math.SQRT2 * Math.sqrt((key / 20) / Math.PI) * 1.0), jr = H.rng(400 + key);
    x.fillStyle = '#111';
    const J = []; for (let i = 0; i < NC; i++) { J.push([]); for (let j = 0; j < NC; j++) J[i].push([jr.range(0.86, 1.1), jr.range(0.86, 1.1), jr.range(-0.3, 0.3), jr.range(-0.3, 0.3)]); }
    for (let i = -1; i <= NC; i++) for (let j = -1; j <= NC; j++) {
      const q = J[(i + NC) % NC][(j + NC) % NC];
      [[i * s, j * s, q[0]], [i * s + s / 2, j * s + s / 2, q[1]]].forEach(([px, py, f]) => { x.beginPath(); x.ellipse(px + q[2], py + q[3], rr * f, rr * f * 0.94, q[2] * 3, 0, TAU); x.fill(); });
    }
    const pat = ctx.createPattern(c, 'repeat');
    if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(1 / PS, 1 / PS));
    TONES[key] = pat;
  }
  return TONES[key];
}
// gradated screentone in a w x h box: density lerps d0 -> d1 along y. Cached; draw with drawImage(img, x, y, w, h).
const GTONES = {};
function gradTone(w, h, d0, d1, y0 = 0, y1 = h, fx0 = w, fx1 = w + 1) {
  const key = [w, h, d0, d1, y0, y1, fx0, fx1].join(',');
  if (!GTONES[key]) {
    const c = H.layer(Math.round(w * PS), Math.round(h * PS)), x = c.getContext('2d'), p = 5.4, c45 = Math.SQRT1_2, N = Math.ceil((w + h) / p) + 2, jr = H.rng(91);
    x.scale(PS, PS);
    x.fillStyle = '#111'; x.beginPath();
    for (let i = -N; i < N; i++) for (let j = 0; j < N; j++) {
      const px = (i + j) * p * c45, py = (j - i) * p * c45;
      if (px < -4 || py < -4 || px > w + 4 || py > h + 4) continue;
      const d = H.lerp(d0, d1, H.clamp((py - y0) / (y1 - y0))) * (1 - H.clamp((px - fx0) / (fx1 - fx0)));
      if (d < 0.02) continue;
      const rad = Math.min(p * 0.72, p * Math.sqrt(d / Math.PI)) * jr.range(0.88, 1.08);
      x.moveTo(px + rad, py); x.arc(px, py, rad, 0, TAU);
    }
    x.fill(); GTONES[key] = c;
  }
  return GTONES[key];
}
const drawGrad = (c, x, y, w, h, d0, d1, y0, y1, fx0, fx1) => c.drawImage(gradTone(w, h, d0, d1, y0, y1, fx0, fx1), x, y, w, h);

// closed brush-inked loop: line weight swells on the shadow side, thin on the lit side
function inkLoop(c, pts, w, jr) {
  const n = pts.length, L = [], R = [];
  let area = 0; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
  const sgn = area > 0 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1;
    const nx = ty / m * sgn, ny = -tx / m * sgn;
    const lit = H.clamp(nx * 0.55 + ny * 0.83, -1, 1);
    const ww = w * (0.62 + 0.38 * lit) / 2 + 0.3;
    const jx = jr ? jr.range(-0.8, 0.8) : 0, jy = jr ? jr.range(-0.8, 0.8) : 0;
    const px = pts[i][0] + jx * 0.5, py = pts[i][1] + jy * 0.5;
    L.push([px + nx * ww, py + ny * ww]); R.push([px - nx * ww * 0.85, py - ny * ww * 0.85]);
  }
  c.beginPath(); c.moveTo(L[0][0], L[0][1]); for (const p of L) c.lineTo(p[0], p[1]); c.closePath();
  c.moveTo(R[0][0], R[0][1]); for (let i = n - 1; i >= 0; i--) c.lineTo(R[i][0], R[i][1]); c.closePath();
  c.fill('evenodd');
}
const rrPts = (x, y, w, h, rad, n = 6) => {
  const o = [], cs = [[x + w - rad, y + rad, -Math.PI / 2], [x + w - rad, y + h - rad, 0], [x + rad, y + h - rad, Math.PI / 2], [x + rad, y + rad, Math.PI]];
  cs.forEach(([cx, cy, a0]) => { for (let k = 0; k <= n; k++) { const a = a0 + k / n * Math.PI / 2; o.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); } });
  return o;
};
const ellPts = (cx, cy, rx, ry, n = 36, a0 = 0, a1 = TAU, closed = true) => { const o = []; const m = closed ? n : n + 1; for (let k = 0; k < m; k++) { const a = a0 + (a1 - a0) * k / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
// non-photo-blue layout rough for a panel that is not inked yet
function pencilRough(c, P) {
  const sd = Math.round(P[0][0] * 7 + P[0][1] * 13 + P[2][0] * 3 + P[2][1]), r = H.rng(500 + sd);
  const cc = P.reduce((a, q) => [a[0] + q[0] / P.length, a[1] + q[1] / P.length], [0, 0]);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
  const pw = x1 - x0, ph = y1 - y0;
  const wob = (pts) => { c.beginPath(); pts.forEach((q, i) => { const x = q[0] + r.range(-0.9, 0.9), y = q[1] + r.range(-0.9, 0.9); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); };
  const seg = (a, b, n = 6) => { const o = []; for (let k = 0; k <= n; k++) o.push([H.lerp(a[0], b[0], k / n), H.lerp(a[1], b[1], k / n)]); return o; };
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = 'rgba(110,170,215,0.75)'; c.lineWidth = 1.6;
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, e0 = r.range(8, 14) + pass * 4, e1 = r.range(8, 14) - pass * 3, o = pass ? r.range(-2.2, 2.2) : 0;
    wob(seg([a[0] - dx / m * e0 + o, a[1] - dy / m * e0 - o], [b[0] + dx / m * e1 + o, b[1] + dy / m * e1 - o]));
  }
  c.save(); poly(c, P); c.clip();
  c.strokeStyle = 'rgba(110,170,215,0.42)'; c.lineWidth = 1.8;
  wob(seg([x0 + pw * r.range(0, 0.2), y1], [cc[0] + r.range(-40, 40), y0 + ph * r.range(0.2, 0.4)], 10));
  wob(seg([x1 - pw * r.range(0, 0.2), y1], [cc[0] + r.range(-40, 40), y0 + ph * r.range(0.2, 0.4)], 10));
  const nf = 2 + (r() * 2 | 0);
  for (let k = 0; k < nf; k++) {
    const fx = x0 + pw * r.range(0.15, 0.85), fy = y0 + ph * r.range(0.3, 0.7), rx = Math.min(pw, ph) * r.range(0.1, 0.2), ry = rx * r.range(0.7, 1.2);
    for (let q = 0; q < 2; q++) wob(ellPts(fx + r.range(-3, 3), fy + r.range(-3, 3), rx * r.range(0.95, 1.06), ry * r.range(0.95, 1.06), 28, r() * TAU, r() * TAU + TAU * 1.05, false));
    wob(seg([fx, fy + ry], [fx + r.range(-20, 20), fy + ry + rx * 1.4], 6));
  }
  { const bx = x0 + pw * r.range(0.2, 0.8), by = y0 + ph * 0.18, brx = Math.min(90, pw * 0.12); wob(ellPts(bx, by, brx, brx * 0.55, 30, 0, TAU * 1.04, false)); }
  { const hx = x0 + pw * r.range(0.05, 0.6), hy = y0 + ph * r.range(0.55, 0.8), L = Math.min(160, pw * 0.25); c.beginPath(); for (let k = 0; k < 9; k++) { const u = hx + k * L / 9; c.moveTo(u, hy + r.range(-4, 4)); c.lineTo(u + 26, hy - 38 + r.range(-4, 4)); } c.stroke(); }
  c.restore();
  c.restore();
}
// cached paper finish: soft fibre mottling + faint fibres + ink specks, applied with multiply (rendered at device res)
let PAPER = null;
function paper(W, H_) {
  if (PAPER && PAPER.width === Math.round(W * PS)) return PAPER;
  const c = H.layer(Math.round(W * PS), Math.round(H_ * PS)), x = c.getContext('2d'), nz = H.makeNoise(31), r = H.rng(32);
  x.scale(PS, PS);
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H_);
  const cell = 6;
  for (let y = 0; y < H_; y += cell) for (let xx = 0; xx < W; xx += cell) {
    const v = nz.fbm2(xx * 0.006, y * 0.006, 3) * 0.5 + nz.n2(xx * 0.05, y * 0.05) * 0.25;
    const g = 246 + v * 9; x.fillStyle = `rgb(${g + 4 | 0},${g + 2 | 0},${g - 3 | 0})`; x.fillRect(xx, y, cell, cell);
  }
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.filter = 'blur(3px)'; x.drawImage(c, 0, 0); x.filter = 'none';
  x.scale(PS, PS);
  x.lineCap = 'round';
  for (let k = 0; k < 1400; k++) {
    const px = r() * W, py = r() * H_, a = r() * TAU, L = r.range(4, 16);
    x.strokeStyle = `rgba(${r.chance(0.5) ? '120,110,95' : '255,255,250'},${r.range(0.06, 0.16)})`; x.lineWidth = r.range(0.4, 0.9);
    x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + 0.5) * L * 0.5, py + Math.sin(a + 0.5) * L * 0.5, px + Math.cos(a) * L, py + Math.sin(a) * L); x.stroke();
  }
  x.fillStyle = 'rgba(30,28,25,0.35)';
  for (let k = 0; k < 160; k++) { x.beginPath(); x.arc(r() * W, r() * H_, r.range(0.3, 0.9), 0, TAU); x.fill(); }
  PAPER = c; return c;
}
function narr(c, x, y, w, h, lines, size = 24, sc = 1, col = '#000') {
  c.save(); c.translate(x + w / 2, y + h / 2); c.scale(sc, sc);
  c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 3.2; c.fillRect(-w / 2, -h / 2, w, h); c.strokeRect(-w / 2, -h / 2, w, h);
  c.fillStyle = col; c.font = `400 ${size}px "Patrick Hand"`; c.textAlign = 'center'; c.textBaseline = 'middle';
  lines.forEach((l, i) => c.fillText(l, 0, (i - (lines.length - 1) / 2) * size * 1.1));
  c.restore();
}
// bold manga arrow (outlined, filled white)
function mArrow(c, pts, w, p, fill = '#fff') {
  if (p <= 0) return; p = Math.min(1, p); const n = Math.max(2, Math.round(pts.length * p)), P = pts.slice(0, n);
  const a = P[P.length - 1], b = P[Math.max(0, P.length - 3)], an = Math.atan2(a[1] - b[1], a[0] - b[0]);
  const L = [], R = [];
  P.forEach((q, i) => { const u = P[Math.min(P.length - 1, i + 1)], v = P[Math.max(0, i - 1)], tx = u[0] - v[0], ty = u[1] - v[1], m = Math.hypot(tx, ty) || 1; L.push([q[0] - ty / m * w / 2, q[1] + tx / m * w / 2]); R.push([q[0] + ty / m * w / 2, q[1] - tx / m * w / 2]); });
  const head = [[a[0] + Math.cos(an + 1.57) * w * 1.2, a[1] + Math.sin(an + 1.57) * w * 1.2], [a[0] + Math.cos(an) * w * 1.6, a[1] + Math.sin(an) * w * 1.6], [a[0] + Math.cos(an - 1.57) * w * 1.2, a[1] + Math.sin(an - 1.57) * w * 1.2]];
  const shape = L.concat(p >= 1 ? head.slice().reverse() : [], R.reverse());
  c.save(); c.lineJoin = 'round'; poly(c, shape); c.fillStyle = fill; c.fill(); c.lineWidth = 5; c.strokeStyle = '#000'; c.stroke(); c.restore();
}
