// ===== ON: "Kasut yang Semua Reject" — manga explainer, 9:16 (720x1280 logical) =====
const SW = 720, SH = 1280, DURATION = 45;
let tq = 0, boil = 0;
const ease = H.ease, cl = H.clamp, lerp = H.lerp;
const on = (t0) => Math.ceil(t0 * 12 - 1e-6) / 12; // first drawn frame (animation runs on twos) that shows an event at t0
const setT = (t) => { tq = Math.floor(t * 12 + 1e-6) / 12; boil = Math.floor(t * 8); };

// beat start times (panel slam-ins) and slanted panel gutters
const A = [0.1, 4.0, 9.0, 14.0, 19.0, 25.0, 30.0, 35.0, 40.0];
const TURN1 = 8.7, TURN2 = 29.7, TURN_D = 0.5;
const PL = [
  [[18, 18], [702, 30], [690, 1262], [18, 1250]],
  [[26, 18], [702, 18], [702, 1252], [18, 1262]],
  [[18, 26], [702, 18], [702, 1262], [30, 1250]],
  [[18, 18], [690, 28], [702, 1262], [18, 1246]],
  [[24, 18], [702, 26], [696, 1262], [18, 1252]],
  [[18, 22], [702, 18], [702, 1250], [26, 1262]],
  [[18, 18], [702, 24], [694, 1262], [22, 1252]],
  [[22, 26], [702, 18], [702, 1262], [18, 1248]],
  [[18, 18], [696, 18], [702, 1252], [18, 1262]],
];

// ---------- motion helpers ----------
const quake = (k, amp) => [Math.sin(tq * 90 + k * 3) * amp, Math.cos(tq * 77 + k * 5) * amp];
const slam = (c, P, t0) => { const k = cl((tq - t0) / 0.34); if (k <= 0) return false; const z = 1 + 0.14 * Math.pow(1 - k, 2), sh = Math.pow(1 - k, 2) * 7; const cc = P.reduce((a, q) => [a[0] + q[0] / P.length, a[1] + q[1] / P.length], [0, 0]); c.translate(cc[0] + Math.sin(tq * 90) * sh, cc[1] + Math.cos(tq * 77) * sh); c.scale(z, z); c.translate(-cc[0], -cc[1]); return true; };
const pop = (c, t0, x, y, fn) => { const k = cl((tq - t0) / 0.17); if (k <= 0) return; const sc = 1 + 0.6 * Math.pow(1 - k, 2); c.save(); c.translate(x, y); c.scale(sc, sc); c.translate(-x, -y); fn(); c.restore(); };
const panel = (c, P, t0, fn) => { if (tq < t0) { pencilRough(c, P); return; } c.save(); if (!slam(c, P, t0)) { c.restore(); return; } c.save(); poly(c, P); c.clip(); c.fillStyle = PAPERC; c.fill(); fn(); c.restore(); c.lineWidth = 4; c.strokeStyle = '#000'; poly(c, P); c.stroke(); c.restore(); };
const fl = (c, cx, cy, r0, r1, n, w, seed, col) => { const r = H.rng(seed + boil * 13); c.save(); c.fillStyle = col || '#000'; focusLines(c, cx, cy, r0, r1, n, r, w); c.restore(); };
const jrng = () => H.rng(300 + Math.floor(tq * 8));
const T01 = (t0, d) => cl((tq - t0) / d);

function bigText(c, txt, x, y, size, fill, rot = 0, sc = 1, ol = 1, font = 'Archivo Black') {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  c.font = `400 ${size}px "${font}"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  c.strokeStyle = '#000'; c.lineWidth = size * 0.2 * ol; c.strokeText(txt, 0, 0);
  c.strokeStyle = '#fff'; c.lineWidth = size * 0.1 * ol; c.strokeText(txt, 0, 0);
  c.fillStyle = fill; c.fillText(txt, 0, 0); c.restore();
}
function sfxWord(c, t0, chars, x, y, size, step, rot, skew, col, dt = 0.12, qa = 2.5) {
  chars.split('').forEach((ch, i) => {
    const [qx, qy] = quake(i, qa), gx = x + Math.cos(rot) * step * i + qx, gy = y + Math.sin(rot) * step * i + qy, sz = size * (1 - 0.04 * i);
    pop(c, t0 + i * dt, gx, gy, () => sfx(c, ch, gx, gy, sz, rot + 0.04 * i, skew, Math.max(5, sz * 0.09), col));
  });
}
const dashed = (c, pts, w, col, dash = [14, 10]) => { c.save(); c.setLineDash(dash); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'butt'; c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.restore(); };

// ---------- props ----------
// a running shoe in side view (toe right), ~300 wide. sole = midsole thickness
function shoeLoop(sole) {
  const base = 100;
  const top = catmull([[6, base], [2, 62], [12, 28], [44, 16], [74, 30], [92, 54], [112, 50], [128, 24], [150, 28], [186, 52], [232, 68], [276, 80], [302, base - 6], [304, base - 1]], 5);
  return top.concat([[305, base + sole * 0.55], [294, base + sole], [20, base + sole], [3, base + sole * 0.7]]);
}
function inkShoe(c, x, y, s, o = {}) {
  const sole = o.sole || 22, jr = jrng();
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(-150, -60); c.lineJoin = 'round'; c.lineCap = 'round';
  const loop = shoeLoop(sole);
  poly(c, loop); c.fillStyle = o.fill || '#fff'; c.fill();
  poly(c, [[3, 100], [305, 98], [305, 100 + sole * 0.55], [294, 100 + sole], [20, 100 + sole], [3, 100 + sole * 0.7]]); c.fillStyle = tone(c, o.msTone == null ? 0.4 : o.msTone); c.fill();
  c.save(); poly(c, loop); c.clip(); c.fillStyle = '#000';
  for (let k = 0; k < 7; k++) { const hx = 30 + k * 38; brush(c, [[hx, 98], [hx + 12, 82], [hx + 20, 66]], 3.2, (t) => Math.sin(Math.PI * t)); }
  c.restore();
  c.fillStyle = '#000'; inkLoop(c, loop, o.line || 6, jr);
  brush(c, [[3, 100], [150, 99], [305, 98]], 4.5, () => 1);
  for (let k = 0; k < 4; k++) brush(c, [[112 + k * 20, 56 - k * 1.5], [132 + k * 20, 40 - k * 1.5]], 5, (t) => 1 - t * 0.4);
  brush(c, bz([70, 90], [120, 66], [190, 70], [250, 90], 14), 6, (t) => Math.sin(Math.PI * t));
  if (o.plate) brush(c, [[20, 100 + sole * 0.5], [150, 100 + sole * 0.45], [296, 98 + sole * 0.3]], 3, () => 1);
  if (o.foam) { c.fillStyle = '#000'; for (let k = 0; k < 6; k++) brush(c, bz([20 + k * 50, 100 + sole * 0.32], [34 + k * 50, 100 + sole * 0.1], [44 + k * 50, 100 + sole * 0.6], [58 + k * 50, 100 + sole * 0.38], 8), 3.4, (t) => Math.sin(Math.PI * t)); }
  c.restore();
}
// hollow rubber pod (CloudTec), squish sq<1
function pod(c, x, y, w, h, sq = 1) {
  const hh = h * sq, jr = jrng();
  c.save(); c.translate(x, y); c.lineJoin = 'round';
  poly(c, rrPts(-w / 2, -hh / 2, w, hh, Math.min(w, hh) * 0.4, 5)); c.fillStyle = '#fff'; c.fill();
  c.fillStyle = '#000'; inkLoop(c, rrPts(-w / 2, -hh / 2, w, hh, Math.min(w, hh) * 0.4, 5), 5, jr);
  c.beginPath(); c.ellipse(0, 0, w * 0.3, hh * 0.11, 0, 0, TAU); c.fill();
  c.restore();
}
// front-view executive silhouette, head pivots at the neck. v: a bald+glasses, b tuft, c bun
function exec(c, x, y, s, tilt, v) {
  c.save(); c.translate(x, y); c.scale(s, s); c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = '#000'; poly(c, [[-118, 360], [-112, 130], [-64, 70], [64, 70], [112, 130], [118, 360]]); c.fill();
  c.fillStyle = '#fff'; poly(c, [[-34, 68], [34, 68], [0, 150]]); c.fill();
  c.fillStyle = RED; poly(c, [[-10, 96], [10, 96], [14, 156], [0, 224], [-14, 156]]); c.fill();
  c.strokeStyle = '#000'; c.lineWidth = 3; poly(c, [[-10, 96], [10, 96], [14, 156], [0, 224], [-14, 156]]); c.stroke();
  c.strokeStyle = '#fff'; c.lineWidth = 3.4; c.beginPath(); c.moveTo(-100, 150); c.lineTo(-58, 92); c.moveTo(100, 150); c.lineTo(58, 92); c.moveTo(-34, 70); c.lineTo(0, 130); c.moveTo(34, 70); c.lineTo(0, 130); c.stroke();
  c.save(); c.translate(0, 70); c.rotate(tilt); c.translate(0, -70);
  c.fillStyle = '#000'; c.fillRect(-26, 30, 52, 60);
  c.beginPath(); c.ellipse(0, 0, 62, 72, 0, 0, TAU); c.fill();
  if (v === 'b') { c.beginPath(); c.moveTo(-50, -20); [[-40, -70], [-20, -62], [-8, -96], [12, -64], [30, -86], [38, -58], [52, -24]].forEach((q) => c.lineTo(q[0], q[1])); c.closePath(); c.fill(); }
  if (v === 'c') { c.beginPath(); c.arc(0, -78, 24, 0, TAU); c.fill(); c.beginPath(); c.ellipse(0, -34, 56, 44, 0, Math.PI, TAU); c.fill(); }
  c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 47, Math.PI * 1.08, Math.PI * 1.4); c.stroke();
  if (v === 'a') { c.fillStyle = '#fff'; [-1, 1].forEach((sg) => { c.beginPath(); c.ellipse(sg * 22, -2, 17, 12, 0, 0, TAU); c.fill(); }); c.fillStyle = '#000'; [-1, 1].forEach((sg) => { c.beginPath(); c.arc(sg * 22 + 2, -2, 4, 0, TAU); c.fill(); }); c.fillRect(-6, -4, 12, 3); }
  else { c.fillStyle = '#fff'; [-1, 1].forEach((sg) => { c.beginPath(); c.ellipse(sg * 22, 0, 13, 4, 0, 0, TAU); c.fill(); }); }
  c.restore(); c.restore();
}
function inkLimb(c, pts, w, fill = '#fff') { c.fillStyle = '#000'; brush(c, pts, w + 9, (t) => 0.75 + 0.25 * Math.sin(Math.PI * t)); c.fillStyle = fill; brush(c, pts, w, (t) => 0.75 + 0.25 * Math.sin(Math.PI * t)); }
function walker(c, x, y, s, ph) { // back view, y = feet
  const jr = jrng(), sw = Math.sin(ph) * 26;
  c.save(); c.translate(x, y); c.scale(s, s); c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = '#000'; brush(c, [[-14, -130], [-14 + sw * 0.6, -66], [-16 + sw, 0]], 28, () => 1); brush(c, [[14, -130], [14 - sw * 0.6, -66], [16 - sw, 0]], 28, () => 1);
  c.beginPath(); c.ellipse(-18 + sw, 2, 20, 8, 0, 0, TAU); c.ellipse(18 - sw, 2, 20, 8, 0, 0, TAU); c.fill();
  inkLimb(c, [[-34, -250], [-58, -200 + sw * 0.4], [-52, -150]], 22); inkLimb(c, [[34, -250], [58, -200 - sw * 0.4], [52, -150]], 22);
  const body = [[-46, -126], [-40, -246], [-20, -284], [20, -284], [40, -246], [46, -126]];
  poly(c, body); c.fillStyle = '#fff'; c.fill(); c.save(); poly(c, body); c.clip(); c.fillStyle = tone(c, 0.5); c.fillRect(0, -300, 60, 200); c.restore();
  c.fillStyle = '#000'; inkLoop(c, body, 6, jr);
  c.save(); c.translate(-58, -168); c.rotate(-0.5); c.fillStyle = RED; c.fillRect(-9, -40, 18, 80); c.strokeStyle = '#000'; c.lineWidth = 3; c.strokeRect(-9, -40, 18, 80); c.restore();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(0, -316, 30, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, -316, 30, 30, 28), 5, jr);
  c.beginPath(); c.ellipse(0, -326, 32, 26, 0, Math.PI, TAU); c.fill(); c.fillRect(-32, -330, 64, 10);
  c.restore();
}

// ---------- hero numbers that carry into the next panel ----------
function hero1(c) {
  if (tq < 0.4) return;
  const kk = ease.inOut(cl((tq - 3.2) / 0.7)), v = tq >= 1.5 ? 70 : Math.round(70 * ease.out(cl((tq - 0.45) / 1.05)));
  const lk = cl((tq - 1.5) / 0.2), pp = tq >= 1.5 ? 1 + 0.28 * Math.pow(1 - lk, 2) : 1;
  const sh = tq >= 1.5 && tq < 1.9 ? quake(1, 7 * (1 - (tq - 1.5) / 0.4)) : [0, 0];
  const R = 250 * (1 - kk), ol = lerp(1, 0.4, kk);
  if (kk > 0) { c.save(); c.globalAlpha = kk; narr(c, 30, 30, 330, 72, [''], 30); c.restore(); }
  if (R > 2) { c.save(); c.translate(360 + sh[0], 590 + sh[1]); c.scale(pp, pp); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, 0, R, R, 48), 9 * (1 - kk) + 2, jrng()); c.restore(); }
  bigText(c, 'RM' + v, lerp(360, 115, kk) + sh[0], lerp(555, 66, kk) + sh[1], lerp(150, 46, kk) * pp, RED, 0, 1, ol);
  bigText(c, 'BILION', lerp(360, 268, kk) + sh[0], lerp(672, 70, kk) + sh[1], lerp(84, 30, kk) * pp, '#000', 0, 1, ol);
}
function hero2(c) {
  if (tq < 30.9 || tq >= 40.0) return;
  const kk = ease.inOut(cl((tq - 34.3) / 0.7)), v = tq >= 33.2 ? 19 : Math.round(19 * ease.out(cl((tq - 31.0) / 2.2)));
  const land = tq >= 33.2 ? 1 + 0.3 * Math.pow(1 - cl((tq - 33.2) / 0.25), 2) : 1, k0 = cl((tq - 30.9) / 0.17), pin = 1 + 0.5 * Math.pow(1 - k0, 2);
  const bx = lerp(50, 30, kk), by = lerp(60, 30, kk), bw = lerp(620, 330, kk), bh = lerp(330, 72, kk), s = land * pin;
  c.save(); c.translate(bx + bw / 2, by + bh / 2); c.scale(s, s); c.translate(-bx - bw / 2, -by - bh / 2);
  const [qx, qy] = tq >= 33.2 && tq < 33.6 ? quake(2, 5) : [0, 0];
  c.translate(qx, qy);
  c.fillStyle = '#000'; c.fillRect(bx + 9, by + 9, bw, bh); c.fillStyle = '#fff'; c.fillRect(bx, by, bw, bh); c.strokeStyle = '#000'; c.lineWidth = 5; c.strokeRect(bx, by, bw, bh);
  if (kk < 1) { c.globalAlpha = 1 - kk; c.fillStyle = '#000'; c.font = '400 40px "Patrick Hand"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('BRAND BERNILAI', bx + bw / 2, by + 40); c.globalAlpha = 1; }
  const ol = lerp(1, 0.4, kk);
  bigText(c, 'USD', lerp(515, 84, kk), lerp(200, 70, kk), lerp(64, 30, kk), '#000', 0, 1, ol);
  bigText(c, '' + v, lerp(245, 164, kk), lerp(235, 66, kk), lerp(190, 46, kk), RED, 0, 1, ol);
  bigText(c, 'BILION', lerp(515, 264, kk), lerp(275, 70, kk), lerp(56, 30, kk), '#000', 0, 1, ol);
  c.restore();
}

// ---------- BEATS ----------
function B1(c) {
  c.fillStyle = tone(c, 0.2); c.fillRect(0, 0, SW, SH);
  c.fillStyle = PAPERC; c.beginPath(); c.arc(360, 590, 300, 0, TAU); c.fill();
  fl(c, 360, 590, 292, 1700, 320, 6, 100);
  if (tq >= 1.5 && tq < 2.2) { const u = (tq - 1.5) / 0.7; c.strokeStyle = '#000'; c.lineWidth = 6; [0, 1].forEach((i) => { c.globalAlpha = 1 - u; c.beginPath(); c.arc(360, 590, 300 + u * 280 + i * 55, 0, TAU); c.stroke(); }); c.globalAlpha = 1; }
  sfxWord(c, 1.5, 'ドン', 440, 960, 210, 140, -0.12, -0.25, RED, 0.12, 3);
  pop(c, 1.9, 360, 1135, () => narr(c, 40, 1060, 640, 150, ['3 BRAND GERGASI', 'RUGI RM70 BILION?!'], 52));
}
function B2(c) {
  c.fillStyle = tone(c, 0.1); c.fillRect(0, 0, SW, SH);
  const no = tq > 4.7;
  [[150, 'a'], [360, 'b'], [570, 'c']].forEach(([x, v], i) => exec(c, x, 450 + (i === 1 ? -22 : 0), 0.96, no ? Math.sin(tq * 14 + i * 2) * 0.14 : 0, v));
  // table
  poly(c, [[18, 770], [702, 756], [702, 1262], [18, 1262]]); c.fillStyle = tone(c, 0.32); c.fill();
  c.fillStyle = '#000'; brush(c, [[18, 772], [360, 764], [702, 758]], 12, () => 1);
  // the idea, a sheet with a sketch of the shoe; the stamp lands then the sheet slides off the table
  const fall = ease.in(T01(7.4, 1.0)), px = 360 + fall * 40, py = 1010 + fall * 560, pr = -0.03 - fall * 0.5;
  c.save(); c.translate(px, py); c.rotate(pr);
  c.fillStyle = '#000'; c.fillRect(-256, -156, 520, 330); c.fillStyle = '#fff'; c.fillRect(-260, -165, 520, 330); c.strokeStyle = '#000'; c.lineWidth = 5; c.strokeRect(-260, -165, 520, 330);
  c.fillStyle = tone(c, 0.12); for (let k = 0; k < 3; k++) c.fillRect(-230, -140 + k * 14, 150 - k * 30, 4);
  inkShoe(c, 0, 10, 1.15, { sole: 22 });
  const k = T01(5.8, 0.17);
  if (k > 0) { const sc = 1 + 1.1 * Math.pow(1 - k, 2); c.save(); c.translate(-10, -10); c.rotate(-0.16); c.scale(sc, sc);
    c.strokeStyle = RED; c.lineWidth = 9; c.strokeRect(-215, -62, 430, 124); c.lineWidth = 3; c.strokeStyle = '#000'; c.strokeRect(-226, -73, 452, 146);
    c.font = '400 98px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = RED; c.fillText('DITOLAK', 0, 4); c.restore(); }
  c.restore();
  if (tq >= 5.8 && tq < 6.3) { c.globalAlpha = 1 - (tq - 5.8) / 0.5; fl(c, 350, 1000, 250, 900, 90, 7, 150); c.globalAlpha = 1; }
  pop(c, 4.7, 440, 250, () => bubble(c, 440, 252, 205, 82, [388, 392], ['TERLALU', 'SIMPLE!'], '400 48px "Patrick Hand"', 50));
  sfxWord(c, 5.8, 'バン', 490, 810, 150, 105, 0.08, -0.25, RED, 0.1, 3);
}
function athlete(c) {
  const jr = jrng(), hx = 410 + Math.sin(tq * 30) * 3, hy = 652 + Math.cos(tq * 33) * 2;
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  // desk
  poly(c, [[190, 668], [702, 640], [702, 720], [190, 740]]); c.fillStyle = tone(c, 0.3); c.fill();
  c.fillStyle = '#000'; brush(c, [[190, 668], [450, 654], [702, 640]], 11, () => 1);
  // torso
  const torso = catmull([[110, 700], [104, 560], [126, 460], [176, 420], [226, 440], [250, 540], [262, 700]], 6);
  poly(c, torso); c.fillStyle = '#fff'; c.fill(); c.save(); poly(c, torso); c.clip(); c.fillStyle = tone(c, 0.45); c.fillRect(200, 400, 80, 320); c.fillStyle = '#000'; brush(c, [[140, 470], [150, 560], [160, 650]], 4, (t) => Math.sin(Math.PI * t)); c.restore();
  c.fillStyle = '#000'; inkLoop(c, torso, 7, jr);
  // arm: shoulder -> elbow -> hand on the paper
  inkLimb(c, bz([214, 450], [270, 500], [330, 560], [hx, hy], 14), 36);
  // head
  c.fillStyle = '#fff'; c.beginPath(); c.arc(184, 340, 54, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(184, 340, 54, 54, 36), 6, jr);
  c.beginPath(); c.moveTo(128, 330); [[132, 290], [160, 268], [176, 250], [196, 270], [226, 262], [240, 290], [240, 322]].forEach((q) => c.lineTo(q[0], q[1])); c.lineTo(236, 318); c.lineTo(190, 296); c.lineTo(132, 322); c.closePath(); c.fill();
  c.fillStyle = RED; c.fillRect(128, 318, 112, 16); c.strokeStyle = '#000'; c.lineWidth = 3; c.strokeRect(128, 318, 112, 16);
  c.fillStyle = '#000'; c.beginPath(); c.arc(214, 352, 4.5, 0, TAU); c.fill(); brush(c, [[226, 380], [236, 384], [246, 378]], 4);
  // paper + pencil
  poly(c, [[300, 654], [570, 644], [590, 686], [292, 696]]); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 4; c.strokeStyle = '#000'; c.stroke();
  c.lineWidth = 2; c.beginPath(); c.moveTo(330, 672); c.quadraticCurveTo(380, 654, 440, 668); c.moveTo(350, 682); c.lineTo(500, 676); c.stroke();
  c.save(); c.translate(hx, hy); c.rotate(0.9); c.fillStyle = '#000'; c.fillRect(-4, -4, 74, 8); c.fillStyle = '#fff'; c.fillRect(0, -2, 66, 4); c.fillStyle = RED; c.fillRect(66, -5, 14, 10); c.restore();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(hx, hy, 17, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(hx, hy, 17, 17, 18), 4, jr);
  c.restore();
}
function B3(c) {
  c.fillStyle = tone(c, 0.1); c.fillRect(0, 0, SW, 750);
  fl(c, 360, 180, 330, 1300, 140, 4, 400);
  athlete(c);
  // inset: the sketch grows on the page
  const box = [[56, 770], [668, 756], [676, 1120], [48, 1130]];
  c.save(); c.translate(10, 10); poly(c, box); c.fillStyle = '#000'; c.fill(); c.restore();
  poly(c, box); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 6; c.strokeStyle = '#000'; c.stroke();
  c.save(); poly(c, box); c.clip();
  c.strokeStyle = 'rgba(110,170,215,0.6)'; c.lineWidth = 1.6; for (let k = 0; k < 7; k++) { c.beginPath(); c.moveTo(60, 800 + k * 48); c.lineTo(670, 790 + k * 48); c.stroke(); }
  const p = ease.inOut(T01(9.7, 2.4)), loop = shoeLoop(24).map(([x, y]) => [360 + (x - 150) * 1.6, 960 + (y - 60) * 1.6]);
  const n = Math.max(2, Math.ceil(loop.length * p));
  if (p > 0) { c.fillStyle = '#000'; brush(c, loop.slice(0, n), 5, (t) => 0.7 + 0.3 * Math.sin(Math.PI * t)); }
  if (p >= 1) { c.globalAlpha = T01(12.2, 0.4); inkShoe(c, 360, 960, 1.6, { sole: 24 }); c.globalAlpha = 1; }
  c.restore();
  dashed(c, [[330, 696], [58, 772]], 3, '#000'); dashed(c, [[560, 688], [668, 758]], 3, '#000');
  // 2010 title
  pop(c, 9.3, 360, 130, () => bigText(c, '2010', 360, 130, 170, RED, -0.05));
  sfxWord(c, 9.9, 'カキカキ', 440, 410, 78, 64, -0.18, -0.2, '#000', 0.14, 2.5);
  pop(c, 10.4, 360, 1196, () => narr(c, 40, 1140, 640, 112, ['ATLET NIKE', 'OLIVIER BERNHARD'], 42));
  if (tq >= 12.8) { const k = T01(12.8, 0.4); c.save(); c.translate(600, 880); c.scale(0.6 + 0.4 * ease.back(k), 0.6 + 0.4 * ease.back(k)); c.fillStyle = RED; c.strokeStyle = '#000'; c.lineWidth = 4; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = i % 2 ? 22 : 44; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.stroke(); c.restore(); }
}
function B4(c) {
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  drawGrad(c, 0, 0, SW, SH, 0.1, 0.1, 0, SH);
  // dark floor
  poly(c, [[0, 700], [SW, 640], [SW, SH], [0, SH]]); c.fillStyle = '#000'; c.fill();
  c.save(); poly(c, [[0, 700], [SW, 640], [SW, SH], [0, SH]]); c.clip(); c.globalCompositeOperation = 'destination-out'; c.drawImage(gradTone(SW, 700, 0.55, 0, 0, 480), 0, 600, SW, 700); c.restore();
  c.globalCompositeOperation = 'source-over';
  // far wall lines
  c.strokeStyle = '#000'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 680); c.lineTo(SW, 630); c.stroke();
  // open door (left) with REJECT sign
  const door = [[34, 150], [270, 214], [270, 770], [34, 840]];
  c.save(); c.translate(12, 12); poly(c, door); c.fillStyle = '#000'; c.fill(); c.restore();
  poly(c, door); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 6; c.strokeStyle = '#000'; c.stroke();
  c.save(); poly(c, door); c.clip(); c.fillStyle = tone(c, 0.2); c.fillRect(34, 150, 120, 700); c.restore();
  c.beginPath(); c.arc(246, 520, 9, 0, TAU); c.fillStyle = '#000'; c.fill();
  c.save(); c.translate(140, 500); c.rotate(-Math.PI / 2 - 0.05); c.font = '400 76px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.strokeStyle = RED; c.lineWidth = 7; c.strokeRect(-170, -48, 340, 96); c.fillStyle = RED; c.fillText('REJECT', 0, 6); c.restore();
  // walker leaves along the floor
  const u = ease.inOut(T01(14.4, 4.0)), wx = lerp(330, 590, u), wy = lerp(960, 770, u), ws = lerp(1.15, 0.6, u);
  c.fillStyle = 'rgba(0,0,0,0)'; walker(c, wx, wy, ws, tq * 9);
  fl(c, 640, 640, 80, 900, 60, 3, 700);
  sfxWord(c, 14.5, 'ドドド', 80, 990, 130, 115, -0.1, -0.25, RED, 0.12, 3);
  pop(c, 14.8, 360, 70, () => narr(c, 90, 36, 540, 66, ['TAMATKAN SPONSORSHIP'], 40));
  const ap = T01(15.6, 1.0);
  if (ap > 0) mArrow(c, bz([400, 1000], [470, 1000], [570, 980], [650, 900], 30), 30, ap);
  pop(c, 17.0, 360, 1190, () => { narr(c, 40, 1110, 640, 130, ['BINA BRAND', 'SENDIRI'], 56); bigText(c, '!', 640, 1100, 80, RED, 0.2); });
}
function hosePts() { return catmull([[-60, 390], [90, 310], [220, 380], [330, 400], [470, 340], [590, 300], [700, 330], [800, 360]], 10); }
function drawHose(c, pts) {
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]));
  c.strokeStyle = '#000'; c.lineWidth = 80; c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 66; c.stroke(); c.strokeStyle = tone(c, 0.45); c.stroke();
  c.save(); c.translate(0, -14); c.strokeStyle = '#fff'; c.lineWidth = 9; c.stroke(); c.restore();
  c.strokeStyle = '#000'; c.lineWidth = 3; c.beginPath();
  for (let i = 4; i < pts.length - 4; i += 3) { const a = pts[i - 1], b = pts[i + 1], tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1; c.moveTo(pts[i][0] - ty / m * 33, pts[i][1] + tx / m * 33); c.lineTo(pts[i][0] + ty / m * 33, pts[i][1] - tx / m * 33); }
  c.stroke(); c.restore();
}
function B5(c) {
  c.fillStyle = tone(c, 0.08); c.fillRect(0, 0, SW, SH);
  poly(c, [[0, 962], [SW, 954], [SW, SH], [0, SH]]); c.fillStyle = tone(c, 0.4); c.fill();
  c.fillStyle = '#000'; brush(c, [[18, 966], [360, 960], [702, 954]], 8, () => 1);
  const pts = hosePts(), cutX = 360, cut = tq >= 20.5, g = cut ? 34 * ease.out(T01(20.5, 0.25)) : 0;
  let yc = 400; pts.forEach((q) => { if (Math.abs(q[0] - cutX) < 8) yc = q[1]; });
  c.save(); c.beginPath(); c.rect(0, 0, cutX, 1000); c.clip(); c.translate(-g, 0); drawHose(c, pts); c.restore();
  c.save(); c.beginPath(); c.rect(cutX, 0, SW, 1000); c.clip(); c.translate(g, 0); drawHose(c, pts); c.restore();
  if (g > 0) [-g, g].forEach((dx) => { c.fillStyle = '#000'; c.beginPath(); c.ellipse(cutX + dx, yc, 12, 40, 0, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(cutX + dx, yc, 6, 28, 0, 0, TAU); c.fill(); });
  if (!cut) dashed(c, [[cutX, yc - 110], [cutX, yc + 110]], 5, RED, [12, 9]);
  // scissors snip
  const so = tq < 19.9 ? 1 : Math.max(0, 1 - (tq - 19.9) / 0.6), away = tq > 20.9 ? ease.in(T01(20.9, 0.6)) * 400 : 0;
  if (tq >= 19.4 && away < 399) {
    c.save(); c.translate(cutX, yc - 150 - away); c.lineJoin = 'round';
    [-1, 1].forEach((sg) => {
      const tip = [-sg * (6 + 46 * so), 170], hd = [sg * (30 + 84 * so), -130];
      poly(c, [[0, 0], [-sg * 4 - 12, 20], tip, [4, 0]].map((p, i) => i === 0 ? [0, 0] : p)); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 5; c.strokeStyle = '#000'; c.stroke();
      c.fillStyle = '#000'; brush(c, [[0, 0], [hd[0] * 0.5, hd[1] * 0.5], hd], 16, () => 1);
      c.beginPath(); c.arc(hd[0], hd[1] - 16, 28, 0, TAU); c.lineWidth = 12; c.strokeStyle = '#000'; c.stroke(); c.lineWidth = 5; c.strokeStyle = RED; c.stroke();
    });
    c.fillStyle = '#000'; c.beginPath(); c.arc(0, 0, 11, 0, TAU); c.fill(); c.restore();
  }
  // slices -> pods -> CloudTec sole
  const PX = [150, 234, 318, 402, 486, 570];
  PX.forEach((tx, i) => {
    const t0 = 20.7 + i * 0.08, u = ease.inOut(T01(t0 + 0.25, 1.2));
    if (tq < t0) return;
    const sx = cutX + (i - 2.5) * 22, sy = yc + 10, k0 = ease.back(T01(t0, 0.25));
    let x = lerp(sx, tx, u), y = lerp(sy, 924, u) - Math.sin(Math.PI * u) * 150;
    let sq = 1; const sqT = T01(24.1, 0.5); if (tq >= 24.1) sq = 1 - 0.3 * Math.sin(Math.PI * Math.min(1, sqT * 1.6));
    const s0 = u < 0.01 ? 0.3 + 0.7 * k0 : 1;
    c.save(); c.translate(x, y + (1 - sq) * 20); c.scale(s0, s0); pod(c, 0, 0, 70, 54, sq); c.restore();
  });
  if (tq >= 22.3) { const k = T01(22.3, 0.17), sc = 1 + 0.5 * Math.pow(1 - k, 2), dy = tq >= 24.1 ? 7 * Math.sin(Math.PI * Math.min(1, T01(24.1, 0.5) * 1.6)) : 0; c.save(); c.translate(360, 770 + dy); c.scale(sc, sc); inkShoe(c, 0, 0, 1.7, { sole: 34, msTone: 0.2 }); c.restore(); }
  // impact absorbed
  const ip = T01(23.6, 0.5);
  if (ip > 0) { mArrow(c, [[360, 430], [360, 500], [360, 590], [360, 670]], 34, ip, '#fff'); if (tq >= 24.0) narr(c, 420, 450, 260, 70, ['SERAP IMPAK'], 38); }
  if (tq >= 24.1 && tq < 24.7) { c.strokeStyle = '#000'; c.lineWidth = 4; [-1, 1].forEach((sg) => { for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(360, 924, 200 + k * 16 + (tq - 24.1) * 120, sg < 0 ? Math.PI * 0.95 : -0.1, sg < 0 ? Math.PI * 1.1 : 0.05); c.stroke(); } }); }
  sfxWord(c, 20.5, 'ザクッ', 430, 220, 150, 100, -0.1, -0.25, RED, 0.1, 3);
  pop(c, 19.3, 360, 70, () => narr(c, 40, 30, 640, 76, ['HOS TAMAN DIPOTONG'], 46));
  if (tq >= 23.2) { const k = T01(23.2, 0.17); bigText(c, 'CLOUDTEC', 360, 1110, 100, RED, -0.03, 1 + 0.7 * Math.pow(1 - k, 2)); }
}
function B6(c) {
  const gut = [[0, 690], [SW, 560]];
  poly(c, [[0, 0], [SW, 0], [SW, 560], [0, 690]]); c.fillStyle = tone(c, 0.1); c.fill();
  poly(c, [[0, 690], [SW, 560], [SW, SH], [0, SH]]); c.fillStyle = tone(c, 0.3); c.fill();
  // top: elite shoe, hard and thin
  c.save(); poly(c, [[0, 0], [SW, 0], [SW, 560], [0, 690]]); c.clip(); fl(c, -200, 300, 200, 1300, 90, 4, 800); c.restore();
  if (tq >= 27.6) fl(c, 360, 625, 120, 800, 110, 4, 880);
  const eu = ease.out(T01(25.3, 0.5)), bu = ease.out(T01(26.4, 0.5));
  if (eu > 0) inkShoe(c, lerp(-300, 360, eu), 300, 1.7, { sole: 12, plate: true, msTone: 0.1 });
  c.save(); poly(c, [[0, 690], [SW, 560], [SW, SH], [0, SH]]); c.clip();
  if (bu > 0) inkShoe(c, lerp(1000, 360, bu), 930, 1.7, { sole: 70, foam: true, msTone: 0.15 });
  c.restore();
  c.fillStyle = '#000'; brush(c, [[0, 690], [360, 625], [SW, 560]], 16, () => 1);
  pop(c, 25.8, 250, 470, () => narr(c, 40, 440, 480, 66, ['KASUT ELITE: KERAS'], 40));
  pop(c, 26.8, 480, 740, () => narr(c, 240, 710, 450, 66, ['KASUT TEBAL: LEMBUT'], 40));
  // both shoes feed ON
  mArrow(c, bz([560, 330], [610, 420], [600, 500], [520, 560], 20), 24, T01(27.0, 0.55));
  mArrow(c, bz([160, 800], [120, 740], [160, 690], [230, 650], 20), 24, T01(27.0, 0.55));
  if (tq >= 27.6) { const k = T01(27.6, 0.2), sc = 1 + 0.9 * Math.pow(1 - k, 2); c.save(); c.translate(360, 625); c.scale(sc, sc);
    c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 104, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, 0, 104, 104, 40), 9, jrng());
    c.fillStyle = RED; c.beginPath(); c.arc(0, 0, 84, 0, TAU); c.fill(); c.font = '400 92px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 6; c.lineJoin = 'round'; c.strokeText('ON', 0, 6); c.fillText('ON', 0, 6); c.restore();
    sfxWord(c, 27.6, 'ピカッ', 440, 130, 110, 85, 0.12, -0.2, RED, 0.1, 3); }
  pop(c, 28.6, 360, 1160, () => { narr(c, 30, 1090, 660, 150, ['SELESA DAN', 'RESPONSIF'], 62); });
}
function B7(c) {
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  drawGrad(c, 0, 0, SW, 900, 0.34, 0, 0, 900);
  { const hr = H.rng(611); c.fillStyle = '#000'; c.beginPath(); for (let k = 0; k < 50; k++) { const uu = hr(), x0 = 90 + uu * 560, y0 = 960 - uu * 560 + hr.range(-200, -20), L = hr.range(60, 200), w = hr.range(0.5, 2.2), ux = 0.7, uy = -0.7; c.moveTo(x0, y0); c.lineTo(x0 + ux * L - uy * w, y0 + uy * L + ux * w); c.lineTo(x0 + ux * L + uy * w, y0 + uy * L - ux * w); c.closePath(); } c.fill(); }
  if (tq >= 33.2) { c.save(); c.globalAlpha = 1 - T01(33.6, 0.6) * 0.6; fl(c, 360, 230, 190, 1000, 220, 6, 960); c.restore(); }
  const ox = 110, oy = 1010, gw = 540, gh = 560, ap = T01(30.3, 0.4);
  c.strokeStyle = '#000'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(ox, oy - gh * ap - 10); c.lineTo(ox, oy); c.lineTo(ox + (gw + 20) * ap, oy); c.stroke();
  const pr = ease.inOut(T01(30.6, 2.4)), pts = []; for (let k = 0; k <= 70; k++) { const uu = k / 70 * pr; pts.push([ox + uu * gw, oy - gh * (Math.exp(3.4 * uu) - 1) / (Math.exp(3.4) - 1)]); }
  if (pr > 0) {
    poly(c, pts.concat([[pts[pts.length - 1][0], oy], [ox, oy]])); c.fillStyle = tone(c, 0.3); c.fill();
    c.fillStyle = RED; brush(c, pts, 20, () => 1); c.fillStyle = '#000'; brush(c, pts.map((q) => [q[0], q[1] + 12]), 5, () => 1);
    const tp = pts[pts.length - 1]; c.fillStyle = '#fff'; c.beginPath(); c.arc(tp[0], tp[1], 20, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(tp[0], tp[1], 20, 20, 20), 6, jrng());
  }
  c.fillStyle = '#000'; c.font = '400 40px "Patrick Hand"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('2010', ox + 10, oy + 44);
  if (pr >= 1) { pop(c, 33.0, 620, 1052, () => { c.fillStyle = '#000'; c.font = '400 40px "Patrick Hand"'; c.fillText('KINI', 620, 1052); }); }
  if (pr > 0.12) sfxWord(c, 31.0, 'ゴーッ', 150, 880, 120, 110, -0.5, -0.25, RED, 0.12, 3);
  pop(c, 33.8, 360, 1150, () => narr(c, 40, 1090, 640, 120, ['BRAND PALING PANTAS', 'BERKEMBANG'], 46));
}
function footballer(c, kick) {
  const ox = -40;
  c.save(); c.translate(ox, 0); c.lineCap = 'round'; c.lineJoin = 'round'; c.fillStyle = '#000';
  c.beginPath(); c.ellipse(360, 1100, 230, 24, 0, 0, TAU); c.fillStyle = 'rgba(0,0,0,0.35)'; c.fill(); c.fillStyle = '#000';
  brush(c, bz([330, 730], [320, 810], [300, 900], [286, 1044], 20), 70, () => 1); // standing leg
  c.beginPath(); c.ellipse(310, 1072, 60, 20, -0.1, 0, TAU); c.fill();
  const kk = 0.5 + 0.5 * Math.sin(kick * Math.PI), kx = lerp(430, 560, kk), ky = lerp(840, 740, kk);
  brush(c, bz([350, 730], [400, 770], [kx - 20, ky - 40], [kx, ky], 20), 66, () => 1); // kicking leg
  c.beginPath(); c.ellipse(kx + 34, ky - 8, 44, 18, -0.5, 0, TAU); c.fill();
  brush(c, [[360, 530], [366, 470]], 36, () => 1);
  brush(c, bz([335, 760], [345, 660], [360, 580], [350, 520], 20), 112, (t) => 0.7 + 0.3 * Math.sin(Math.PI * t)); // torso
  brush(c, bz([360, 548], [300, 560], [240, 580], [170, 530], 16), 38, () => 1); // back arm
  brush(c, bz([362, 548], [420, 580], [470, 600], [520, 560], 16), 38, () => 1); // front arm
  c.beginPath(); c.arc(366, 456, 46, 0, TAU); c.fill();
  c.beginPath(); c.moveTo(322, 440); [[330, 400], [356, 388], [384, 396], [408, 410], [414, 440]].forEach((q) => c.lineTo(q[0], q[1])); c.closePath(); c.fill();
  c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.arc(366, 456, 40, Math.PI * 1.05, Math.PI * 1.4); c.stroke();
  c.beginPath(); c.moveTo(300, 640); c.lineTo(330, 600); c.moveTo(310, 700); c.lineTo(350, 640); c.stroke();
  c.restore();
}
function ball(c, x, y, r) {
  c.save(); c.translate(x, y); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, 0, r, r, 36), 7, jrng());
  [[0, 0], [-0.62, -0.34], [0.62, -0.34], [-0.4, 0.6], [0.4, 0.6]].forEach(([u, v], i) => { c.beginPath(); for (let k = 0; k < 5; k++) { const a = k / 5 * TAU - Math.PI / 2 + (i ? 0.3 * u : 0); c.lineTo(u * r + Math.cos(a) * r * 0.25, v * r + Math.sin(a) * r * 0.25); } c.closePath(); c.fill(); });
  c.restore();
}
function B8(c) {
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  c.save(); c.fillStyle = RED; fl(c, 370, 640, 230, 1500, 150, 9, 1100, RED); c.restore();
  fl(c, 370, 640, 240, 1500, 260, 5, 1200);
  const fu = ease.out(T01(35.5, 0.6)); c.save(); c.translate((1 - fu) * -420, 0);
  footballer(c, T01(36.4, 0.5)); c.restore();
  const bu = T01(36.6, 0.9), bx = lerp(570, 540, bu), by = lerp(745, 430, ease.out(bu)), br = lerp(46, 80, bu);
  if (tq >= 36.6) { ball(c, bx, by, br); if (bu >= 1) { const k = T01(37.5, 0.17); c.save(); c.translate(bx, by); c.scale(1 + 0.8 * Math.pow(1 - k, 2), 1 + 0.8 * Math.pow(1 - k, 2)); c.fillStyle = RED; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 5; c.stroke(); c.font = '400 44px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('ON', 0, 3); c.restore(); } }
  else ball(c, 570, 760, 46);
  pop(c, 35.5, 360, 225, () => bigText(c, 'MBAPPÉ', 360, 225, 118, '#000', -0.04));
  pop(c, 36.0, 140, 330, () => narr(c, 40, 300, 240, 64, ['JOIN ON!'], 46));
  sfxWord(c, 37.4, 'ドドド', 70, 880, 130, 120, -0.2, -0.25, RED, 0.12, 3);
  pop(c, 38.2, 360, 1190, () => narr(c, 40, 1130, 640, 100, ['BINA ON FOOTBALL'], 54));
  pop(c, 39.0, 420, 1080, () => narr(c, 90, 1034, 540, 62, ['BUKAN SEKADAR AMBASSADOR'], 34, 1, RED));
}
function B9(c) {
  c.fillStyle = '#000'; c.fillRect(0, 0, SW, SH);
  c.save(); const r = H.rng(1300 + boil * 13); c.fillStyle = RED; focusLines(c, 500, 420, 150, 1500, 200, r, 8); c.restore();
  c.save(); const r2 = H.rng(1400 + boil * 7); c.fillStyle = '#fff'; focusLines(c, 500, 420, 200, 1500, 70, r2, 3); c.restore();
  // white silhouette, raised fist
  const up = ease.out(T01(40.3, 0.5)), fy = lerp(560, 330, up);
  c.save(); c.fillStyle = '#fff'; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.arc(330, 520, 72, 0, TAU); c.fill();
  brush(c, [[330, 580], [330, 660]], 60, () => 1);
  poly(c, [[110, 900], [130, 710], [220, 650], [440, 650], [530, 710], [550, 900]]); c.fill();
  brush(c, bz([470, 700], [560, 640], [560, 520], [510, fy + 40], 20), 74, () => 1);
  c.beginPath(); c.arc(510, fy, 54, 0, TAU); c.fill();
  c.strokeStyle = '#000'; c.lineWidth = 4; c.beginPath(); [[-20, -30, -22, 30], [0, -34, 0, 34], [20, -30, 22, 30]].forEach(([a, b, d, e]) => { c.moveTo(510 + a * 0.9, fy + b * 0.3 + 6); c.lineTo(510 + d * 0.9, fy + e * 0.3 + 6); }); c.stroke();
  c.fillStyle = '#000'; c.beginPath(); c.ellipse(310, 518, 7, 10, 0, 0, TAU); c.fill(); brush(c, [[250, 560], [270, 566], [292, 560]], 6);
  c.restore();
  sfxWord(c, 40.6, 'ゴゴゴ', 110, 280, 130, 125, 1.3, -0.2, RED, 0.12, 3);
  const cnt = tq >= 42.2 ? 1000 : Math.round(1000 * ease.out(T01(40.4, 1.8))), k2 = T01(42.2, 0.2);
  c.save(); c.translate(360, 860); const sc = tq >= 42.2 ? 1 + 0.3 * Math.pow(1 - k2, 2) : 1; c.scale(sc, sc); bigText(c, cnt + '×', 0, 0, 150, RED, -0.03); c.restore();
  pop(c, 41.0, 360, 90, () => narr(c, 40, 36, 640, 120, ['KENA REJECT', '1000 KALI PUN'], 54));
  if (tq >= 43.0) { const k = T01(43.0, 0.2); bigText(c, 'JANGAN', 360, 985, 100, '#fff', -0.03, 1 + 0.6 * Math.pow(1 - k, 2), 1, 'Archivo Black'); bigText(c, 'GIVE UP', 360, 1090, 100, '#fff', 0.03, 1 + 0.6 * Math.pow(1 - k, 2)); }
  pop(c, 43.8, 360, 1215, () => narr(c, 40, 1170, 640, 80, ['KOMEN BRAND SETERUSNYA!'], 44));
}
const BEATS = [B1, B2, B3, B4, B5, B6, B7, B8, B9];

// ---------- page assembly ----------
const PAGES = [{ beats: [0, 1], over: hero1 }, { beats: [2, 3, 4, 5], over: null }, { beats: [6, 7, 8], over: hero2 }];
function beatPanel(c, b) { panel(c, PL[b], A[b], () => BEATS[b](c)); }
function stack(c, idxs) {
  let k = -1; idxs.forEach((b, i) => { if (tq >= A[b]) k = i; });
  if (k < 0) { pencilRough(c, PL[idxs[0]]); return; }
  if (k > 0 && tq < A[idxs[k]] + 0.4) beatPanel(c, idxs[k - 1]);
  beatPanel(c, idxs[k]);
  if (k < idxs.length - 1 && tq >= A[idxs[k + 1]] - 0.3) pencilRough(c, PL[idxs[k + 1]]);
}
function drawPageTo(c, pg, t) {
  setT(t); c.setTransform(PS, 0, 0, PS, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH); c.lineCap = 'round'; c.lineJoin = 'round';
  const P = PAGES[pg]; stack(c, P.beats); if (P.over) P.over(c);
}
const LAYS = [];
function pageLayer(i, pg, t) {
  if (!LAYS[i] || LAYS[i].width !== Math.round(SW * PS)) LAYS[i] = H.layer(Math.round(SW * PS), Math.round(SH * PS));
  const c = LAYS[i].getContext('2d'); drawPageTo(c, pg, t); return LAYS[i];
}
function turn(ctx, A_, B_, p) {
  ctx.drawImage(B_, 0, 0, SW, SH);
  const fx = SW * (1 - ease.inOut(p));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, fx, SH); ctx.clip(); ctx.drawImage(A_, 0, 0, SW, SH); ctx.restore();
  const bw = Math.min(fx, (SW - fx) * 0.5);
  if (bw > 1) {
    ctx.save(); ctx.translate(fx, 0); ctx.scale(-1, 1);
    const g = ctx.createLinearGradient(0, 0, bw, 0); g.addColorStop(0, '#d8d4ca'); g.addColorStop(0.5, '#f6f3ec'); g.addColorStop(1, '#e4e0d6');
    ctx.fillStyle = g; ctx.fillRect(0, 0, bw, SH); ctx.restore();
    const sg = ctx.createLinearGradient(fx, 0, fx + 60, 0); sg.addColorStop(0, 'rgba(0,0,0,0.35)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg; ctx.fillRect(fx, 0, 60, SH);
  }
}
function explainer(ctx, W, H_, t) {
  PS = ctx.canvas.width / W;
  ctx.save();
  if (t < TURN1 || (t >= TURN1 + TURN_D && t < TURN2) || t >= TURN2 + TURN_D) {
    drawPageTo(ctx, t < TURN1 ? 0 : t < TURN2 ? 1 : 2, t);
  } else {
    const first = t < TURN1 + TURN_D, p = (t - (first ? TURN1 : TURN2)) / TURN_D;
    const la = pageLayer(0, first ? 0 : 1, (first ? TURN1 : TURN2) - 0.01), lb = pageLayer(1, first ? 1 : 2, t);
    ctx.setTransform(PS, 0, 0, PS, 0, 0); ctx.fillStyle = '#d9d6cf'; ctx.fillRect(0, 0, SW, SH);
    turn(ctx, la, lb, p);
  }
  setT(t); ctx.setTransform(PS, 0, 0, PS, 0, 0);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(paper(W, H_), 0, 0, W, H_); ctx.restore();
  ctx.restore();
  H.grain(ctx, W, H_, 0.035, 9 + boil);
}

// ---------- sound ----------
function scoreSound(k) {
  { const k0 = k, sn = (t) => (Math.round(t * 48000) + 0.25) / 48000; k = { ...k0, play: (n, t, o) => k0.play(n, sn(t), o), tone: (t, o) => k0.tone(sn(t), o), noise: (t, o) => k0.noise(sn(t), o) }; }
  const D = DURATION, pan = (x) => cl(x / 360 - 1, -1, 1) * 0.6;
  const slamS = (t, g = 1, p = 0) => { k.play('slap', t, { gain: 0.55 * g, pan: p }); k.play('thud', t, { f: 120, gain: 0.45 * g, pan: p }); };
  const flip = (t) => {
    k.play('paper', t, { dur: 0.18, gain: 0.45, pan: 0.4 });
    k.noise(t + 0.08, { dur: 0.36, color: 'pink', filter: 'bandpass', f: [[0, 600], [0.18, 1600], [0.36, 500]], q: 0.7, gain: 0.3, a: 0.16, pan: -0.1 });
    k.play('paper', t + 0.42, { dur: 0.1, gain: 0.3, pan: -0.5 });
  };
  const ctr = (t, f, g, p) => k.withMinor(() => { k.noise(t, { dur: 0.03, filter: 'bandpass', f, q: 1.4, gain: 0.3 * g, a: 0.001, pan: p }); k.tone(t, { f: f * 0.2, type: 'triangle', dur: 0.035, gain: 0.08 * g, pan: p }); });
  const dodo = (t, p) => { k.tone(t, { f: [[0, 90], [0.2, 48]], dur: 0.3, gain: 0.26, pan: p }); k.noise(t, { dur: 0.22, color: 'brown', filter: 'lowpass', f: 380, gain: 0.28, pan: p }); };
  // a counter that ticks once per drawn frame while the value changes (<= 12/s), thinning as it settles
  const count = (t0, dur, to, f0, p, tEnd) => { let last = -1; for (let f = Math.ceil(t0 * 12); f / 12 < (tEnd || t0 + dur); f++) { const tt = f / 12, v = Math.round(to * ease.out(cl((tt - t0) / dur))); if (v !== last) { ctr(tt, f0 + v / to * 600, 0.9, p); last = v; } } };

  k.bed('room', 0, D, { gain: 0.3 });
  k.bed('hiss', 0, D, { gain: 0.5 });

  // ---- BEAT 1 (0-4): the shocking number
  slamS(on(0.1), 0.8, 0);
  count(0.45, 1.05, 70, 2100, 0);
  k.play('impact', on(1.5), { gain: 1.0 }); k.play('stamp', on(1.5), { gain: 0.5 });
  [0, 1].forEach((i) => dodo(on(1.5 + i * 0.12) + 0.02, pan(480 + i * 150) * 0.5));
  k.play('pop', on(1.9), { f: 300, gain: 0.7 });
  k.noise(3.2, { dur: 0.7, color: 'brown', filter: 'bandpass', f: [[0, 250], [0.35, 600], [0.7, 280]], q: 0.6, gain: 0.16, a: 0.3, pan: -0.3, minor: true });
  k.play('pop', on(3.9), { f: 480, gain: 0.35, pan: -0.5, minor: true });

  // ---- BEAT 2 (4-9): "terlalu simple" -> DITOLAK
  slamS(on(4.0), 0.9);
  k.play('pop', on(4.7), { f: 260, gain: 0.8, pan: 0.2 });
  [4.7, 5.0, 5.3].forEach((t, i) => k.play('tock', t, { f: 220 + i * 30, gain: 0.25, pan: (i - 1) * 0.5, minor: true }));
  k.noise(5.55, { dur: 0.25, color: 'pink', filter: 'bandpass', f: [[0, 400], [0.25, 2200]], q: 0.8, gain: 0.2, a: 0.1 });
  k.play('stamp', on(5.8), { gain: 1.0 }); k.play('impact', on(5.8), { gain: 0.8 });
  k.play('buzz', on(5.8) + 0.05, { f: 90, dur: 0.35, gain: 0.5 });
  k.noise(7.4, { dur: 0.9, color: 'pink', filter: 'bandpass', f: [[0, 1800], [0.9, 300]], q: 0.7, gain: 0.22, a: 0.2, pan: 0.3 });
  k.play('paper', 7.5, { dur: 0.5, gain: 0.35, pan: 0.2 });

  // ---- page turn 1
  flip(TURN1);

  // ---- BEAT 3 (9-14): 2010, the athlete sketches
  slamS(on(9.0), 0.8);
  k.play('stamp', on(9.3), { gain: 0.8 });
  k.play('stroke', 9.7, { dur: 2.4, material: 'pencil', gain: 1.0, pan: 0 });
  k.withMinor(() => { for (let i = 0; i < 4; i++) k.play('tock', on(9.9 + i * 0.14), { f: 1500 + i * 120, gain: 0.2 }); });
  k.play('pop', on(10.4), { f: 320, gain: 0.55 });
  k.play('sparkle', on(12.8), { gain: 0.9, n: 6 });
  k.play('ding', on(12.8), { f: 'E6', gain: 0.5 });

  // ---- BEAT 4 (14-19): he walks away
  slamS(on(14.0), 0.85);
  for (let t = 14.5; t < 18.4; t += 0.5) k.play('tock', t, { f: 120, gain: 0.2, pan: 0.1 * Math.sin(t), minor: true });
  [0, 1, 2].forEach((i) => dodo(on(14.5 + i * 0.12), -0.4 + i * 0.1));
  k.play('pop', on(14.8), { f: 300, gain: 0.6 });
  k.noise(15.6, { dur: 1.0, color: 'pink', filter: 'bandpass', f: [[0, 400], [1.0, 1400]], q: 0.8, gain: 0.18, a: 0.7, pan: 0.3, minor: true });
  k.play('stamp', on(17.0), { gain: 0.8 }); k.play('pop', on(17.0), { f: 280, gain: 0.5 });

  // ---- BEAT 5 (19-25): garden hose -> CloudTec
  slamS(on(19.0), 0.8);
  k.play('pop', on(19.3), { f: 300, gain: 0.5 });
  k.play('stroke', 19.4, { dur: 0.5, material: 'marker', gain: 0.8 });
  k.play('click', 19.9, { f: 1300, gain: 1.0 }); k.play('click', 20.2, { f: 1500, gain: 1.0 });
  k.play('slap', on(20.5), { gain: 0.9 }); k.noise(on(20.5), { dur: 0.12, filter: 'highpass', f: 3500, gain: 0.5 }); k.play('impact', on(20.5), { gain: 0.6 });
  for (let i = 0; i < 6; i++) { k.play('pop', on(20.7 + i * 0.08), { f: 400 + i * 40, gain: 0.3, pan: (i - 2.5) * 0.2, minor: true }); }
  k.play('whoosh', 21.0, { dur: 1.3, gain: 0.55, top: 1800 });
  k.play('pop', on(22.3), { f: 300, gain: 0.8 });
  for (let i = 0; i < 6; i++) k.play('tock', 21.9 + i * 0.07, { f: 600 + i * 60, gain: 0.25, pan: (i - 2.5) * 0.2, minor: true });
  k.play('stamp', on(23.2), { gain: 0.9 });
  k.noise(23.6, { dur: 0.5, color: 'pink', filter: 'bandpass', f: [[0, 500], [0.5, 1500]], q: 0.8, gain: 0.2, a: 0.35, minor: true });
  k.play('thud', on(24.1), { f: 90, gain: 0.7 }); k.play('tock', on(24.1), { f: 400, gain: 0.35 });

  // ---- BEAT 6 (25-30): the problem on both sides, ON solves it
  slamS(on(25.0), 0.8);
  k.play('whoosh', 25.3, { dur: 0.5, gain: 0.5 }); k.play('pop', on(25.8), { f: 300, gain: 0.55 });
  k.play('whoosh', 26.4, { dur: 0.5, gain: 0.5, pan: 0.3 }); k.play('pop', on(26.8), { f: 260, gain: 0.55 });
  k.play('stroke', 27.0, { dur: 0.55, material: 'brush', gain: 1.0 });
  k.play('stamp', on(27.6), { gain: 0.8 }); k.play('sparkle', on(27.6), { gain: 1.0, n: 8 }); k.play('success', on(27.6) + 0.08, { f: 'G5', gain: 0.6 });
  k.play('pop', on(28.6), { f: 300, gain: 0.6 }); k.play('thud', on(28.6), { f: 110, gain: 0.5 });

  // ---- page turn 2
  flip(TURN2);

  // ---- BEAT 7 (30-35): USD 19 billion, the key hit
  slamS(on(30.0), 0.8);
  k.play('stroke', 30.3, { dur: 0.4, material: 'brush', gain: 0.8 });
  k.play('pop', on(30.9), { f: 320, gain: 0.6 });
  k.noise(30.6, { dur: 2.4, color: 'pink', filter: 'bandpass', f: [[0, 250], [2.4, 1500]], q: 1.1, gain: 0.14, a: 1.9, pan: 0.1 });
  k.tone(30.6, { f: [[0, 'C3'], [2.4, 'C5']], type: 'triangle', dur: 2.4, gain: 0.06, a: 1.9, minor: true });
  count(31.0, 2.2, 19, 1800, 0, 33.2);
  [0, 1, 2].forEach((i) => k.play('thud', on(31.0 + i * 0.12), { f: 100, gain: 0.25, pan: -0.5 + i * 0.1, minor: true }));
  k.play('impact', on(33.2), { gain: 1.4 }); k.play('stamp', on(33.2), { gain: 0.7 }); k.play('sparkle', on(33.3), { gain: 0.9, n: 7 });
  k.play('pop', on(33.8), { f: 300, gain: 0.6 });
  k.noise(34.3, { dur: 0.7, color: 'brown', filter: 'bandpass', f: [[0, 250], [0.35, 600], [0.7, 280]], q: 0.6, gain: 0.16, a: 0.3, minor: true });

  // ---- BEAT 8 (35-40): Mbappé joins
  slamS(on(35.0), 0.85);
  k.play('whoosh', 35.5, { dur: 0.6, gain: 0.6, top: 3000 }); k.play('pop', on(35.5), { f: 240, gain: 0.7 });
  k.play('pop', on(36.0), { f: 320, gain: 0.5, pan: -0.5 });
  k.play('slap', on(36.6), { gain: 1.0 }); k.play('thud', on(36.6), { f: 150, gain: 0.7 });
  k.play('whoosh', 36.7, { dur: 0.8, gain: 0.4, top: 2200, pan: 0.4 });
  k.play('stamp', on(37.5), { gain: 0.8 });
  [0, 1, 2].forEach((i) => dodo(on(37.4 + i * 0.12), -0.5 + i * 0.1));
  k.play('pop', on(38.2), { f: 300, gain: 0.6 }); k.play('pop', on(39.0), { f: 360, gain: 0.45, minor: true });

  // ---- BEAT 9 (40-45): never give up
  slamS(on(40.0), 1.0); k.play('impact', on(40.0), { gain: 0.6 });
  k.play('riser', 40.3, { dur: 0.8, gain: 0.5 });
  [0, 1, 2].forEach((i) => dodo(on(40.6 + i * 0.12), -0.6 + i * 0.1));
  k.play('pop', on(41.0), { f: 280, gain: 0.55 });
  count(40.4, 1.8, 1000, 1800, 0, 42.2);
  k.play('stamp', on(42.2), { gain: 0.9 }); k.play('thud', on(42.2), { f: 100, gain: 0.6 });
  k.play('stamp', on(43.0), { gain: 1.0 }); k.play('impact', on(43.0), { gain: 0.8 });
  ['G4', 'C5', 'E5', 'G5'].forEach((n, i) => k.tone(on(43.0) + 0.06 + i * 0.08, { f: n, type: 'triangle', dur: 1.2 - i * 0.12, gain: 0.14, a: 0.004, verb: 0.3, pan: (i - 1.5) * 0.2 }));
  k.play('pop', on(43.8), { f: 320, gain: 0.55 }); k.play('ding', on(43.8) + 0.02, { f: 'C6', gain: 0.4 });
}
