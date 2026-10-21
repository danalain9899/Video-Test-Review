// ---------- extra katakana for this story ----------
Object.assign(KANA, {
  'コ': [[[0.12, 0.22], [0.5, 0.2], [0.82, 0.18], [0.84, 0.5], [0.86, 0.86]], [[0.14, 0.86], [0.5, 0.86], [0.86, 0.86]]],
  'ス': [[[0.18, 0.24], [0.56, 0.22], [0.84, 0.2], [0.74, 0.42], [0.5, 0.7], [0.2, 0.96]], [[0.5, 0.62], [0.7, 0.82], [0.9, 0.98]]],
  'ズ': [[[0.14, 0.26], [0.5, 0.24], [0.76, 0.22], [0.68, 0.44], [0.46, 0.72], [0.16, 0.96]], [[0.46, 0.62], [0.64, 0.82], [0.84, 0.98]], [[0.82, 0.0], [0.86, 0.14]], [[0.95, -0.03], [0.99, 0.11]]],
  'ラ': [[[0.3, 0.12], [0.58, 0.1], [0.78, 0.08]], [[0.14, 0.42], [0.5, 0.4], [0.86, 0.38], [0.84, 0.6], [0.7, 0.84], [0.4, 0.96]]],
  'ワ': [[[0.2, 0.16], [0.2, 0.46]], [[0.18, 0.3], [0.5, 0.28], [0.84, 0.26], [0.8, 0.6], [0.54, 0.9], [0.26, 0.98]]],
  'フ': [[[0.14, 0.28], [0.5, 0.26], [0.84, 0.24], [0.8, 0.54], [0.5, 0.82], [0.22, 0.96]]],
});
const NP = (c, t0, x, y, w, h, lines, size, col) => pop(c, t0, x + w / 2, y + h / 2, () => narr(c, x, y, w, h, lines, size, 1, col));
const dots3 = (c, t0, x, y, r) => { for (let i = 0; i < 3; i++) pop(c, t0 + i * 0.1, x + i * r * 3, y, () => { c.fillStyle = '#000'; c.beginPath(); c.arc(x + i * r * 3, y, r + 3, 0, TAU); c.fill(); c.fillStyle = RED; c.beginPath(); c.arc(x + i * r * 3, y, r, 0, TAU); c.fill(); }); };
function spark4(c, x, y, r, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(0, 0, r, 0); c.quadraticCurveTo(0, 0, 0, r); c.quadraticCurveTo(0, 0, -r, 0); c.quadraticCurveTo(0, 0, 0, -r); c.closePath();
  c.fillStyle = '#fff'; c.fill(); c.lineWidth = 3.5; c.strokeStyle = '#000'; c.lineJoin = 'round'; c.stroke(); c.restore();
}
const sparks = (c, t0, pts, base = 26) => pts.forEach(([x, y, d], i) => { if (tq >= t0 + (d || 0)) spark4(c, x, y, base * (0.8 + 0.4 * Math.sin(tq * 9 + i * 2)), 0.2 * i); });
function stamp(c, lines, x, y, size, rot, sc = 1, col = RED) {
  const h = lines.length * size * 0.92 + 40, w = Math.max(...lines.map((l) => l.length)) * size * 0.78 + 50;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  c.strokeStyle = col; c.lineWidth = 9; c.strokeRect(-w / 2, -h / 2, w, h); c.lineWidth = 3; c.strokeStyle = '#000'; c.strokeRect(-w / 2 - 11, -h / 2 - 11, w + 22, h + 22);
  c.font = `400 ${size}px "Archivo Black"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col;
  lines.forEach((l, i) => c.fillText(l, 0, (i - (lines.length - 1) / 2) * size * 0.92 + 3)); c.restore();
}

// ---------- event times (shared by picture and sound) ----------
const T = {
  b1: { cnt0: 0.9, land: 3.5, cap: 2.2, chip: 4.55 },
  b2: { tilt: 5.6, bubble: 7.6, stamp: 8.2, fall: 9.0 },
  b3: { shoe: 10.2, spark: 10.7, brand: 11.7, cap: 12.4 },
  b4: { run: 14.8, name: 15.0, kick: 15.3, cap: 15.5 },
  b5: { q: 17.0, cap: 17.4, crowd: 17.9, cap2: 19.9 },
  b6: { title: 23.3, sketch: 24.0, sketchD: 3.4, cap: 25.0, ink: 27.4, star: 27.9 },
  b7: { cap: 29.1, hose: 29.3, hoseD: 1.2, label: 30.3, stamp: 32.0, cap2: 32.6 },
  b8: { walk: 33.5, walkD: 4.9, cap1: 33.9, arrow: 35.4, cap2: 36.6 },
  b9: { disc: 39.0, cnt0: 39.4, land: 41.0, stamp: 42.4, cap: 43.3 },
  b10: { tag: [45.6, 46.7, 47.4], stamp: 50.0, fall: 50.7 },
  b11: { ask: 52.5, axes: 52.6, curve: 52.9, curveD: 3.0, cap: 53.6, tip: 55.9 },
  b12: { shoe: 57.6, pods: 58.3, label: 60.1, eva: 63.4, hel: 64.2 },
  b13: { two: 65.6, mas: 66.4, cap: 67.2 },
  b14: { shoe: 71.2, run: 71.5, label: 72.0, pace: 73.0, x: 74.2 },
  b15: { shoe: 75.8, label: 76.4, meter: 77.0, meterD: 1.3, cap: 78.6 },
  b16: { t0: 80.2 }, b17: { t0: 85.36, f: 0.8 },
  b18: { arrow: 90.6, cap: 90.8, cap2: 91.3 },
  b19: { run: 92.3, cap: 92.8 },
  b20: { ic: [97.3, 97.8, 98.3, 98.8], cap: 97.1, on: 100.6, cap2: 100.9 },
  b21: { tiles: [102.9, 103.4, 103.9, 104.4], cap: 103.2, name: 107.9 },
  b22: { ex: 110.2, cap: 110.6 },
  b23: { t0: 112.73 },
  b24: { ball: 118.1, title: 118.8, cap: 119.4 },
  b25: { sil: 121.4, cap: 121.9 },
  b26: { fist: 125.0, t1: 125.2, t2: 126.0, burn: 126.5 },
  b27: { cnt0: 128.0, land: 129.3, cap: 128.1, give: 129.6, opt: 130.3 },
  b28: { q: 131.7, c: [133.6, 134.0, 134.4], cap: 133.7 },
  b29: { follow: 135.6, cap: 136.4, peace: 139.7 },
};
const hT = (t0, f) => (x) => t0 + (x - 19) * f;     // hose scene clock, authored 19.0 -> 25.0
const sT = (t0) => (x) => t0 + (x - 25);             // split scene clock, authored 25.0 -> 30.0
const fT = (t0) => (x) => t0 + (x - 35);             // football scene clock, authored 35.0 -> 40.0

// ---------- beats ----------
// 1: the number
function hero1(c) {
  const t = T.b1; if (tq < 0.4 || tq >= A[2]) return;
  const kk = ease.inOut(cl((tq - t.chip) / 0.7)), v = tq >= t.land ? 70 : Math.round(70 * ease.out(cl((tq - t.cnt0) / (t.land - t.cnt0))));
  const lk = cl((tq - t.land) / 0.2), pp = tq >= t.land ? 1 + 0.28 * Math.pow(1 - lk, 2) : 1;
  const sh = tq >= t.land && tq < t.land + 0.4 ? quake(1, 7 * (1 - (tq - t.land) / 0.4)) : [0, 0];
  const R = 250 * (1 - kk), ol = lerp(1, 0.4, kk);
  if (kk > 0) { c.save(); c.globalAlpha = kk; narr(c, 30, 30, 330, 72, [''], 30); c.restore(); }
  if (R > 2) { c.save(); c.translate(360 + sh[0], 590 + sh[1]); c.scale(pp, pp); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, 0, R, R, 48), 9 * (1 - kk) + 2, jrng()); c.restore(); }
  bigText(c, 'RM' + v, lerp(360, 115, kk) + sh[0], lerp(555, 66, kk) + sh[1], lerp(150, 46, kk) * pp, RED, 0, 1, ol);
  bigText(c, 'BILION', lerp(360, 268, kk) + sh[0], lerp(672, 70, kk) + sh[1], lerp(84, 30, kk) * pp, '#000', 0, 1, ol);
}
function beat01(c) {
  const t = T.b1;
  c.fillStyle = tone(c, 0.2); c.fillRect(0, 0, SW, SH);
  c.fillStyle = PAPERC; c.beginPath(); c.arc(360, 590, 300, 0, TAU); c.fill();
  fl(c, 360, 590, 292, 1700, 320, 6, 100);
  if (tq >= t.land && tq < t.land + 0.7) { const u = (tq - t.land) / 0.7; c.strokeStyle = '#000'; c.lineWidth = 6; [0, 1].forEach((i) => { c.globalAlpha = 1 - u; c.beginPath(); c.arc(360, 590, 300 + u * 280 + i * 55, 0, TAU); c.stroke(); }); c.globalAlpha = 1; }
  sfxWord(c, t.land, 'ドン', 440, 960, 210, 140, -0.12, -0.25, RED, 0.12, 3);
  NP(c, t.cap, 40, 1060, 640, 150, ['3 BRAND GERGASI', 'RUGI RM70 BILION?!'], 52);
}
// 2 and 10: the executives reject the sketch
function rejectScene(c, o) {
  c.fillStyle = tone(c, 0.1); c.fillRect(0, 0, SW, SH);
  const no = tq > o.shake;
  [[150, 'a'], [360, 'b'], [570, 'c']].forEach(([x, v], i) => exec(c, x, 450 + (i === 1 ? -22 : 0), 0.96, no ? Math.sin(tq * 14 + i * 2) * 0.14 : (tq > o.tilt ? Math.sin(tq * 3 + i) * 0.06 : 0), v));
  poly(c, [[18, 770], [702, 756], [702, 1262], [18, 1262]]); c.fillStyle = tone(c, 0.32); c.fill();
  c.fillStyle = '#000'; brush(c, [[18, 772], [360, 764], [702, 758]], 12, () => 1);
  const fall = ease.in(T01(o.fall, 0.9)), px = 360 + fall * 40, py = 1010 + fall * 560, pr = -0.03 - fall * 0.5;
  c.save(); c.translate(px, py); c.rotate(pr);
  c.fillStyle = '#000'; c.fillRect(-256, -156, 520, 330); c.fillStyle = '#fff'; c.fillRect(-260, -165, 520, 330); c.strokeStyle = '#000'; c.lineWidth = 5; c.strokeRect(-260, -165, 520, 330);
  c.fillStyle = tone(c, 0.12); for (let k = 0; k < 3; k++) c.fillRect(-230, -140 + k * 14, 150 - k * 30, 4);
  inkShoe(c, 0, 10, 1.15, { sole: 22 });
  const k = T01(o.stamp, 0.17);
  if (k > 0) { stamp(c, o.lines, -10, -10, o.lines.length > 1 ? 78 : 98, -0.16, 1 + 1.1 * Math.pow(1 - k, 2)); }
  c.restore();
  if (tq >= o.stamp && tq < o.stamp + 0.5) { c.globalAlpha = 1 - (tq - o.stamp) / 0.5; fl(c, 350, 1000, 250, 900, 90, 7, 150); c.globalAlpha = 1; }
  if (o.bubble) pop(c, o.bubble, 440, 250, () => bubble(c, 440, 252, 205, 82, [388, 392], ['TERLALU', 'SIMPLE!'], '400 48px "Patrick Hand"', 50));
  (o.tags || []).forEach(([t0, txt, strike], i) => pop(c, t0, 150 + i * 210, 290, () => {
    narr(c, 55 + i * 210, 250, 190, 70, [txt], 40);
    if (strike) { c.strokeStyle = RED; c.lineWidth = 9; c.beginPath(); c.moveTo(62 + i * 210, 322); c.lineTo(238 + i * 210, 248); c.stroke(); }
  }));
  sfxWord(c, o.stamp, o.sfx || 'バン', 490, 810, 150, 105, 0.08, -0.25, RED, 0.1, 3);
}
const beat02 = (c) => rejectScene(c, { tilt: T.b2.tilt, shake: T.b2.bubble + 0.1, bubble: T.b2.bubble, stamp: T.b2.stamp, fall: T.b2.fall, lines: ['DITOLAK'] });
// 3: the idea becomes a brand
function beat03(c) {
  const t = T.b3;
  c.fillStyle = tone(c, 0.1); c.fillRect(0, 0, SW, SH);
  fl(c, 360, 640, 330, 1500, 220, 6, 2300);
  c.fillStyle = PAPERC; c.beginPath(); c.arc(360, 640, 330, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(360, 640, 330, 330, 56), 8, jrng());
  const k = ease.back(T01(t.shoe, 0.45)); if (k > 0) { c.save(); c.translate(360, 640); c.rotate(-0.06 + Math.sin(tq * 3) * 0.02); c.scale(1.9 * k, 1.9 * k); inkShoe(c, 0, 0, 1, { sole: 30, msTone: 0.2 }); c.restore(); }
  sparks(c, t.spark, [[120, 380, 0], [600, 330, 0.15], [560, 880, 0.3], [150, 860, 0.45], [360, 260, 0.6]], 38);
  if (tq >= t.brand) { const kk = T01(t.brand, 0.17); bigText(c, 'BRAND', 360, 940, 140, RED, -0.05, 1 + 0.7 * Math.pow(1 - kk, 2)); }
  sfxWord(c, t.shoe + 0.3, 'キラッ', 440, 190, 110, 90, 0.1, -0.2, RED, 0.12, 3);
  NP(c, t.cap, 40, 1060, 640, 150, ['IDEA ITU KINI', 'BRAND MERDEKA'], 52);
}
// 4: Mbappé as ambassador (teaser)
function beat04(c) {
  const t = T.b4;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  fl(c, 370, 640, 230, 1500, 150, 9, 1100, RED); fl(c, 370, 640, 240, 1500, 260, 5, 1200);
  const fu = ease.out(T01(t.run, 0.5)); c.save(); c.translate((1 - fu) * -420, 0); footballer(c, T01(t.kick, 0.5)); c.restore();
  ball(c, 570, 745, 46);
  pop(c, t.name, 360, 225, () => bigText(c, 'MBAPPÉ', 360, 225, 118, '#000', -0.04));
  sfxWord(c, t.name, 'ドドド', 70, 880, 130, 120, -0.2, -0.25, RED, 0.12, 3);
  NP(c, t.cap, 40, 1080, 640, 150, ['TERMASUK MBAPPÉ', 'SEBAGAI AMBASSADOR'], 46);
}
// 5: teaser — what is all the hype about
function beat05(c) {
  const t = T.b5;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  fl(c, 360, 560, 120, 1500, 200, 9, 1500, RED); fl(c, 360, 560, 160, 1500, 200, 4, 1600);
  const k = T01(t.q, 0.2); if (k > 0) bigText(c, '?', 360, 520, 760, RED, Math.sin(tq * 5) * 0.05, 1 + 0.5 * Math.pow(1 - k, 2), 0.3);
  const heads = [[90, 1160], [250, 1120], [420, 1150], [590, 1110], [690, 1170]];
  heads.forEach(([x, y], i) => { const k2 = ease.out(T01(t.crowd + i * 0.1, 0.4)); const yy = y + (1 - k2) * 200; c.fillStyle = '#000'; c.beginPath(); c.arc(x, yy, 64, 0, TAU); c.fill(); c.fillRect(x - 90, yy + 50, 180, 300); c.fillStyle = '#fff'; [-1, 1].forEach((sg) => { c.beginPath(); c.ellipse(x + sg * 22, yy - 6, 10, 14, 0, 0, TAU); c.fill(); }); });
  NP(c, t.cap, 40, 40, 640, 80, ['APA YANG HYPE SANGAT?'], 50);
  NP(c, t.cap2, 100, 800, 520, 90, ['TENGOK SAMPAI HABIS!'], 46);
  sfxWord(c, t.q + 0.1, 'ザワ', 90, 340, 120, 110, -0.15, -0.25, RED, 0.12, 3); dots3(c, t.q + 0.4, 330, 380, 8);
}
// 6: 2010, the athlete sketches
function beat06(c) {
  const t = T.b6;
  c.fillStyle = tone(c, 0.1); c.fillRect(0, 0, SW, 750); fl(c, 360, 180, 330, 1300, 140, 4, 400);
  athlete(c);
  const box = [[56, 770], [668, 756], [676, 1120], [48, 1130]];
  c.save(); c.translate(10, 10); poly(c, box); c.fillStyle = '#000'; c.fill(); c.restore();
  poly(c, box); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 6; c.strokeStyle = '#000'; c.stroke();
  c.save(); poly(c, box); c.clip();
  c.strokeStyle = 'rgba(110,170,215,0.6)'; c.lineWidth = 1.6; for (let k = 0; k < 7; k++) { c.beginPath(); c.moveTo(60, 800 + k * 48); c.lineTo(670, 790 + k * 48); c.stroke(); }
  const p = ease.inOut(T01(t.sketch, t.sketchD)), loop = shoeLoop(24).map(([x, y]) => [360 + (x - 150) * 1.6, 960 + (y - 60) * 1.6]), n = Math.max(2, Math.ceil(loop.length * p));
  if (p > 0) { c.fillStyle = '#000'; brush(c, loop.slice(0, n), 5, (u) => 0.7 + 0.3 * Math.sin(Math.PI * u)); }
  if (tq >= t.ink) { c.globalAlpha = T01(t.ink, 0.4); inkShoe(c, 360, 960, 1.6, { sole: 24 }); c.globalAlpha = 1; }
  c.restore();
  dashed(c, [[330, 696], [58, 772]], 3, '#000'); dashed(c, [[560, 688], [668, 758]], 3, '#000');
  pop(c, t.title, 360, 130, () => bigText(c, '2010', 360, 130, 170, RED, -0.05));
  sfxWord(c, t.sketch + 0.2, 'カキカキ', 440, 410, 78, 64, -0.18, -0.2, '#000', 0.14, 2.5);
  NP(c, t.cap, 40, 1140, 640, 112, ['ATLET NIKE', 'OLIVIER BERNHARD'], 42);
  if (tq >= t.star) { const k = T01(t.star, 0.4); c.save(); c.translate(600, 880); c.scale(0.6 + 0.4 * ease.back(k), 0.6 + 0.4 * ease.back(k)); c.fillStyle = RED; c.strokeStyle = '#000'; c.lineWidth = 4; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = i % 2 ? 22 : 44; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.stroke(); c.restore(); }
}
// 7: the garden hose, rejected
function beat07(c) {
  const t = T.b7;
  c.fillStyle = tone(c, 0.08); c.fillRect(0, 0, SW, SH);
  const hp = T01(t.hose, t.hoseD);
  c.save(); c.translate(0, 300); c.beginPath(); c.rect(0, 0, 760 * hp, 700); c.clip(); drawHose(c, hosePts()); c.restore();
  if (tq >= t.label) { pop(c, t.label, 360, 920, () => { bigText(c, 'THE GARDEN', 360, 880, 76, '#000', -0.03); bigText(c, 'HOSE', 360, 970, 96, RED, 0.02); }); }
  const k = T01(t.stamp, 0.17);
  if (k > 0) { c.save(); c.translate(360, 640); c.strokeStyle = RED; c.lineCap = 'round'; c.lineWidth = 36 + 30 * Math.pow(1 - k, 2); c.beginPath(); c.moveTo(-250, -120); c.lineTo(250, 120); c.moveTo(250, -120); c.lineTo(-250, 120); c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 12; c.stroke(); c.restore(); }
  if (tq >= t.stamp && tq < t.stamp + 0.5) { c.globalAlpha = 1 - (tq - t.stamp) / 0.5; fl(c, 360, 640, 260, 1000, 100, 6, 2400); c.globalAlpha = 1; }
  sfxWord(c, t.stamp, 'ザクッ', 430, 230, 150, 100, -0.1, -0.25, RED, 0.1, 3);
  NP(c, t.cap, 40, 40, 640, 76, ['IDEA "GARDEN HOSE"'], 46);
  NP(c, t.cap2, 100, 1100, 520, 100, ['DITOLAK NIKE'], 60);
}
// 8: he walks out and builds his own brand
function beat08(c) {
  const t = T.b8;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH); drawGrad(c, 0, 0, SW, SH, 0.1, 0.1, 0, SH);
  poly(c, [[0, 700], [SW, 640], [SW, SH], [0, SH]]); c.fillStyle = '#000'; c.fill();
  c.save(); poly(c, [[0, 700], [SW, 640], [SW, SH], [0, SH]]); c.clip(); c.globalCompositeOperation = 'destination-out'; c.drawImage(gradTone(SW, 700, 0.55, 0, 0, 480), 0, 600, SW, 700); c.restore();
  c.globalCompositeOperation = 'source-over';
  c.strokeStyle = '#000'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 680); c.lineTo(SW, 630); c.stroke();
  const door = [[34, 150], [270, 214], [270, 770], [34, 840]];
  c.save(); c.translate(12, 12); poly(c, door); c.fillStyle = '#000'; c.fill(); c.restore();
  poly(c, door); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 6; c.strokeStyle = '#000'; c.stroke();
  c.save(); poly(c, door); c.clip(); c.fillStyle = tone(c, 0.2); c.fillRect(34, 150, 120, 700); c.restore();
  c.beginPath(); c.arc(246, 520, 9, 0, TAU); c.fillStyle = '#000'; c.fill();
  c.save(); c.translate(140, 500); c.rotate(-Math.PI / 2 - 0.05); c.font = '400 90px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.strokeStyle = RED; c.lineWidth = 7; c.strokeRect(-130, -56, 260, 112); c.fillStyle = RED; c.fillText('EXIT', 0, 6); c.restore();
  const u = ease.inOut(T01(t.walk, t.walkD)), wx = lerp(330, 590, u), wy = lerp(960, 770, u), ws = lerp(1.15, 0.6, u);
  walker(c, wx, wy, ws, tq * 9); fl(c, 640, 640, 80, 900, 60, 3, 700);
  sfxWord(c, t.cap1, 'ドドド', 80, 990, 130, 115, -0.1, -0.25, RED, 0.12, 3);
  NP(c, t.cap1, 60, 36, 600, 66, ['TAMAT SPONSORSHIP'], 44);
  const ap = T01(t.arrow, 1.0); if (ap > 0) mArrow(c, bz([400, 1000], [470, 1000], [570, 980], [650, 900], 30), 30, ap);
  NP(c, t.cap2, 40, 1110, 640, 130, ['BINA BRAND', 'SENDIRI'], 56);
}
// 9: On Cloud = USD 19 billion
function beat09(c) {
  const t = T.b9;
  c.fillStyle = tone(c, 0.2); c.fillRect(0, 0, SW, SH);
  fl(c, 360, 560, 292, 1700, 320, 6, 3100);
  const k0 = T01(t.disc, 0.2), land = tq >= t.land ? 1 + 0.25 * Math.pow(1 - T01(t.land, 0.2), 2) : 1, v = tq >= t.land ? 19 : Math.round(19 * ease.out(T01(t.cnt0, t.land - t.cnt0)));
  if (k0 > 0) {
    c.save(); c.translate(360, 560); c.scale((1 + 0.5 * Math.pow(1 - k0, 2)) * land, (1 + 0.5 * Math.pow(1 - k0, 2)) * land);
    c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 270, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, 0, 270, 270, 56), 10, jrng()); c.restore();
    bigText(c, 'USD', 360, 410, 84, '#000', 0, land); bigText(c, '' + v, 360, 570, 230, RED, 0, land); bigText(c, 'BILION', 360, 715, 80, '#000', 0, land);
  }
  if (tq >= t.land && tq < t.land + 0.7) { const u = (tq - t.land) / 0.7; c.strokeStyle = '#000'; c.lineWidth = 6; c.globalAlpha = 1 - u; c.beginPath(); c.arc(360, 560, 280 + u * 300, 0, TAU); c.stroke(); c.globalAlpha = 1; }
  if (tq >= t.stamp) { const k = T01(t.stamp, 0.17); bigText(c, 'ON CLOUD', 360, 960, 112, RED, -0.04, 1 + 0.7 * Math.pow(1 - k, 2)); }
  sparks(c, t.land, [[90, 270, 0], [640, 250, 0.1], [620, 840, 0.2], [100, 800, 0.3]], 36);
  NP(c, t.cap, 40, 1080, 640, 100, ['ATAU ON RUNNING'], 54);
}
// 10: Adidas and Puma say no too
const beat10 = (c) => rejectScene(c, { tilt: T.b10.tag[0], shake: T.b10.tag[2] + 0.2, stamp: T.b10.stamp, fall: T.b10.fall, lines: ['TERLALU', 'SIMPLE'], sfx: 'バン', tags: [[T.b10.tag[0], 'NIKE', true], [T.b10.tag[1], 'ADIDAS'], [T.b10.tag[2], 'PUMA']] });
// 11: fastest growing
function beat11(c) {
  const t = T.b11;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH); drawGrad(c, 0, 0, SW, 900, 0.34, 0, 0, 900);
  { const hr = H.rng(611); c.fillStyle = '#000'; c.beginPath(); for (let k = 0; k < 50; k++) { const uu = hr(), x0 = 90 + uu * 560, y0 = 960 - uu * 560 + hr.range(-200, -20), L = hr.range(60, 200), w = hr.range(0.5, 2.2), ux = 0.7, uy = -0.7; c.moveTo(x0, y0); c.lineTo(x0 + ux * L - uy * w, y0 + uy * L + ux * w); c.lineTo(x0 + ux * L + uy * w, y0 + uy * L - ux * w); c.closePath(); } c.fill(); }
  const ox = 110, oy = 1010, gw = 540, gh = 640, ap = T01(t.axes, 0.4);
  c.strokeStyle = '#000'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(ox, oy - gh * ap - 10); c.lineTo(ox, oy); c.lineTo(ox + (gw + 20) * ap, oy); c.stroke();
  const pr = ease.inOut(T01(t.curve, t.curveD)), pts = []; for (let k = 0; k <= 70; k++) { const uu = k / 70 * pr; pts.push([ox + uu * gw, oy - gh * (Math.exp(3.4 * uu) - 1) / (Math.exp(3.4) - 1)]); }
  if (pr > 0) {
    poly(c, pts.concat([[pts[pts.length - 1][0], oy], [ox, oy]])); c.fillStyle = tone(c, 0.3); c.fill();
    c.fillStyle = RED; brush(c, pts, 20, () => 1); c.fillStyle = '#000'; brush(c, pts.map((q) => [q[0], q[1] + 12]), 5, () => 1);
    const tp = pts[pts.length - 1];
    if (tq >= t.tip) { const k = ease.back(T01(t.tip, 0.3)); c.save(); c.translate(tp[0], tp[1]); c.scale(k, k); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 58, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, 0, 58, 58, 30), 7, jrng()); c.fillStyle = RED; c.beginPath(); c.arc(0, 0, 46, 0, TAU); c.fill(); c.font = '400 50px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('ON', 0, 3); c.restore(); }
    else { c.fillStyle = '#fff'; c.beginPath(); c.arc(tp[0], tp[1], 20, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(tp[0], tp[1], 20, 20, 20), 6, jrng()); }
  }
  pop(c, t.ask, 360, 130, () => bigText(c, 'BAGAIMANA?', 360, 130, 82, '#000', -0.03));
  sfxWord(c, t.curve + 0.6, 'ゴーッ', 150, 880, 120, 110, -0.5, -0.25, RED, 0.12, 3);
  NP(c, t.cap, 40, 1090, 640, 120, ['BRAND PALING PANTAS', 'BERKEMBANG'], 46);
}
// 12: CloudTec + EVA + Helion
function beat12(c) {
  const t = T.b12;
  c.fillStyle = tone(c, 0.08); c.fillRect(0, 0, SW, SH);
  poly(c, [[0, 660], [SW, 652], [SW, 800], [0, 800]]); c.fillStyle = tone(c, 0.4); c.fill(); c.fillStyle = '#000'; brush(c, [[18, 664], [360, 658], [702, 652]], 8, () => 1);
  const sk = ease.back(T01(t.shoe, 0.4)); if (sk > 0) { c.save(); c.translate(360, 450); c.scale(sk, sk); inkShoe(c, 0, 0, 1.6, { sole: 34, msTone: 0.2 }); c.restore(); }
  [150, 234, 318, 402, 486, 570].forEach((x, i) => { const u = ease.out(T01(t.pods + i * 0.1, 0.5)); if (u > 0) { const yy = lerp(150, 600, u) + (u < 1 ? 0 : 0); pod(c, x, yy, 70, 54, 1 - (u > 0.9 && u < 1 ? 0.2 : 0)); } });
  if (tq >= t.label) { const k = T01(t.label, 0.17); bigText(c, 'CLOUDTEC', 360, 740, 104, RED, -0.03, 1 + 0.7 * Math.pow(1 - k, 2)); }
  const eva = ease.out(T01(t.eva, 0.3)), hel = ease.out(T01(t.hel, 0.3));
  if (eva > 0) { c.save(); c.translate(-(1 - eva) * 500, 0); c.fillStyle = '#000'; c.fillRect(70, 890, 280, 230); c.fillStyle = '#fff'; c.fillRect(60, 880, 280, 230); c.lineWidth = 6; c.strokeStyle = '#000'; c.strokeRect(60, 880, 280, 230); c.fillStyle = tone(c, 0.2); c.fillRect(75, 895, 250, 80); c.fillStyle = '#000'; c.font = '400 96px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('EVA', 200, 1010); c.restore(); }
  if (hel > 0) { c.save(); c.translate((1 - hel) * 500, 0); c.fillStyle = '#000'; c.fillRect(390, 880, 280, 230); c.strokeStyle = '#fff'; c.lineWidth = 3; c.strokeRect(402, 892, 256, 206); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '400 58px "Archivo Black"'; c.fillText('HELION', 530, 960); c.font = '400 40px "Archivo Black"'; c.fillText('SUPERFOAM', 530, 1030); c.restore(); }
  sfxWord(c, t.hel, 'ピカッ', 440, 150, 100, 85, 0.1, -0.2, RED, 0.1, 3);
  NP(c, t.eva, 40, 1160, 640, 80, ['MATERIAL ADVANCE'], 46);
}
// 13: two problems
function beat13(c) {
  const t = T.b13;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  fl(c, 360, 500, 200, 1500, 200, 9, 1900, RED); fl(c, 360, 500, 220, 1500, 220, 4, 2000);
  const k = T01(t.two, 0.2); if (k > 0) bigText(c, '2', 360, 450, 640, RED, -0.06, 1 + 0.6 * Math.pow(1 - k, 2), 0.35);
  if (tq >= t.mas) { const k2 = T01(t.mas, 0.17); bigText(c, 'MASALAH', 360, 880, 104, '#000', 0.02, 1 + 0.6 * Math.pow(1 - k2, 2)); }
  NP(c, t.cap, 40, 1030, 640, 150, ['INDUSTRI', 'SPORT SHOES'], 56);
  sfxWord(c, t.two + 0.2, 'ザワ', 70, 250, 110, 100, -0.15, -0.25, RED, 0.12, 3); dots3(c, t.two + 0.5, 290, 290, 8);
}
// 14: elite shoes do not suit pace 6+
function runner(c, x, y, s, tt, pant) {
  c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.lineJoin = 'round'; c.fillStyle = '#000';
  const w = Math.sin(tt * 10) * (pant ? 3 : 10);
  c.beginPath(); c.arc(60 + w * 0.3, -20, 40, 0, TAU); c.fill();
  brush(c, bz([40, 20], [20, 100], [0, 160], [-30 + w, 220], 12), 70, () => 1);
  brush(c, bz([40, 40], [110, 90], [150, 70], [170, 120], 10), 28, () => 1); brush(c, bz([30, 50], [-40, 100], [-70, 80], [-90, 130], 10), 28, () => 1);
  brush(c, bz([-20, 200], [30, 260], [60, 330], [40 + w, 400], 10), 40, () => 1); brush(c, bz([-20, 200], [-70, 280], [-120, 340], [-150 - w, 400], 10), 40, () => 1);
  c.beginPath(); c.ellipse(60 + w, 410, 50, 16, 0, 0, TAU); c.ellipse(-150 - w, 410, 50, 16, 0, 0, TAU); c.fill();
  c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.arc(60 + w * 0.3, -20, 34, Math.PI * 1.05, Math.PI * 1.4); c.stroke();
  if (pant) { c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 4;[[-20, -60], [130, -50], [150, -10]].forEach(([dx, dy], i) => { const yy = dy + ((tt * 60 + i * 20) % 40); c.beginPath(); c.moveTo(dx, yy - 18); c.quadraticCurveTo(dx + 14, yy + 6, dx, yy + 12); c.quadraticCurveTo(dx - 14, yy + 6, dx, yy - 18); c.fill(); c.stroke(); }); }
  c.restore();
}
function beat14(c) {
  const t = T.b14;
  c.fillStyle = tone(c, 0.1); c.fillRect(0, 0, SW, SH);
  fl(c, -200, 300, 200, 1300, 90, 4, 800);
  const eu = ease.out(T01(t.shoe, 0.5)); if (eu > 0) inkShoe(c, lerp(-300, 360, eu), 280, 1.7, { sole: 12, plate: true, msTone: 0.1 });
  NP(c, t.label, 160, 420, 400, 70, ['KASUT ELITE'], 46);
  const ru = ease.out(T01(t.run, 0.5)); if (ru > 0) { c.save(); c.translate((1 - ru) * 700, 0); runner(c, 260, 640, 0.95, tq, tq > t.pace); c.restore(); }
  if (tq >= t.pace) { const k = T01(t.pace, 0.17); bigText(c, 'PACE 6+', 470, 680, 92, RED, -0.05, 1 + 0.7 * Math.pow(1 - k, 2)); }
  if (tq >= t.x) { const k = T01(t.x, 0.17); stamp(c, ['TAK SESUAI'], 360, 1150, 84, -0.05, 1 + 1.0 * Math.pow(1 - k, 2)); }
  sfxWord(c, t.shoe + 0.3, 'ピーン', 470, 540, 100, 85, -0.1, -0.2, RED, 0.12, 3);
}
// 15: thick foam shoes, low energy return
function beat15(c) {
  const t = T.b15;
  c.fillStyle = tone(c, 0.12); c.fillRect(0, 0, SW, SH);
  c.fillStyle = PAPERC; c.beginPath(); c.ellipse(360, 380, 330, 250, 0, 0, TAU); c.fill();
  const k = ease.back(T01(t.shoe, 0.45)), wob = 1 + 0.03 * Math.sin(tq * 6); if (k > 0) { c.save(); c.translate(360, 370); c.scale(1.7 * k, 1.7 * k * wob); inkShoe(c, 0, 0, 1, { sole: 90, foam: true, msTone: 0.15 }); c.restore(); }
  NP(c, t.label, 160, 610, 400, 70, ['KASUT TEBAL'], 46);
  if (tq >= t.meter - 0.3) {
    const fp = 0.22 * ease.out(T01(t.meter, t.meterD));
    NP(c, t.meter - 0.3, 60, 720, 600, 70, ['ENERGY RETURN'], 48);
    c.fillStyle = '#000'; c.fillRect(70, 820, 580, 100); c.fillStyle = '#fff'; c.fillRect(62, 812, 580, 100); c.lineWidth = 6; c.strokeStyle = '#000'; c.strokeRect(62, 812, 580, 100);
    c.fillStyle = RED; c.fillRect(70, 820, 564 * fp, 84); c.fillStyle = '#000'; for (let i = 1; i < 10; i++) c.fillRect(62 + i * 58, 812, 3, 100);
  }
  if (tq >= t.meter + t.meterD) bigText(c, 'RENDAH', 360, 990, 80, RED, -0.03, 1 + 0.5 * Math.pow(1 - T01(t.meter + t.meterD, 0.17), 2));
  sfxWord(c, t.shoe + 0.2, 'フワ', 70, 170, 110, 100, -0.15, -0.25, RED, 0.12, 3); dots3(c, t.shoe + 0.5, 290, 210, 8);
  NP(c, t.cap, 40, 1090, 640, 140, ['SELESA, TAPI', 'KURANG ENERGY RETURN'], 46);
}
// 16: soft + hard, joined by ON (split screen)
function splitScene(c, t0, labels) {
  const r = sT(t0);
  poly(c, [[0, 0], [SW, 0], [SW, 560], [0, 690]]); c.fillStyle = tone(c, 0.1); c.fill();
  poly(c, [[0, 690], [SW, 560], [SW, SH], [0, SH]]); c.fillStyle = tone(c, 0.3); c.fill();
  c.save(); poly(c, [[0, 0], [SW, 0], [SW, 560], [0, 690]]); c.clip(); fl(c, -200, 300, 200, 1300, 90, 4, 800); c.restore();
  if (tq >= r(27.6)) fl(c, 360, 625, 120, 800, 110, 4, 880);
  const eu = ease.out(T01(r(25.3), 0.5)), bu = ease.out(T01(r(26.4), 0.5));
  if (eu > 0) inkShoe(c, lerp(-300, 360, eu), 300, 1.7, { sole: 12, plate: true, msTone: 0.1 });
  c.save(); poly(c, [[0, 690], [SW, 560], [SW, SH], [0, SH]]); c.clip();
  if (bu > 0) inkShoe(c, lerp(1000, 360, bu), 930, 1.7, { sole: 70, foam: true, msTone: 0.15 });
  c.restore();
  c.fillStyle = '#000'; brush(c, [[0, 690], [360, 625], [SW, 560]], 16, () => 1);
  NP(c, r(25.8), 40, 440, 480, 66, [labels[0]], 40); NP(c, r(26.8), 240, 710, 450, 66, [labels[1]], 40);
  mArrow(c, bz([560, 330], [610, 420], [600, 500], [520, 560], 20), 24, T01(r(27.0), 0.55));
  mArrow(c, bz([160, 800], [120, 740], [160, 690], [230, 650], 20), 24, T01(r(27.0), 0.55));
  if (tq >= r(27.6)) { const k = T01(r(27.6), 0.2), sc = 1 + 0.9 * Math.pow(1 - k, 2); c.save(); c.translate(360, 625); c.scale(sc, sc);
    c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 104, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, 0, 104, 104, 40), 9, jrng());
    c.fillStyle = RED; c.beginPath(); c.arc(0, 0, 84, 0, TAU); c.fill(); c.font = '400 92px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 6; c.lineJoin = 'round'; c.strokeText('ON', 0, 6); c.fillText('ON', 0, 6); c.restore();
    sfxWord(c, r(27.6), 'ピカッ', 440, 130, 110, 85, 0.12, -0.2, RED, 0.1, 3); }
  NP(c, r(28.6), 30, 1090, 660, 150, ['SELESA DAN', 'RESPONSIF'], 62);
}
const beat16 = (c) => splitScene(c, T.b16.t0, ['KASUT ELITE: KERAS', 'KASUT TEBAL: LEMBUT']);
// 17: the garden hose idea becomes CloudTec
function hoseScene(c, t0, f) {
  const r = hT(t0, f), d = (x) => x * f;
  c.fillStyle = tone(c, 0.08); c.fillRect(0, 0, SW, SH);
  poly(c, [[0, 962], [SW, 954], [SW, SH], [0, SH]]); c.fillStyle = tone(c, 0.4); c.fill();
  c.fillStyle = '#000'; brush(c, [[18, 966], [360, 960], [702, 954]], 8, () => 1);
  const pts = hosePts(), cutX = 360, cut = tq >= r(20.5), g = cut ? 34 * ease.out(T01(r(20.5), d(0.25))) : 0;
  let yc = 400; pts.forEach((q) => { if (Math.abs(q[0] - cutX) < 8) yc = q[1]; });
  c.save(); c.beginPath(); c.rect(0, 0, cutX, 1000); c.clip(); c.translate(-g, 0); drawHose(c, pts); c.restore();
  c.save(); c.beginPath(); c.rect(cutX, 0, SW, 1000); c.clip(); c.translate(g, 0); drawHose(c, pts); c.restore();
  if (g > 0) [-g, g].forEach((dx) => { c.fillStyle = '#000'; c.beginPath(); c.ellipse(cutX + dx, yc, 12, 40, 0, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(cutX + dx, yc, 6, 28, 0, 0, TAU); c.fill(); });
  if (!cut) dashed(c, [[cutX, yc - 110], [cutX, yc + 110]], 5, RED, [12, 9]);
  const so = tq < r(19.9) ? 1 : Math.max(0, 1 - (tq - r(19.9)) / d(0.6)), away = tq > r(20.9) ? ease.in(T01(r(20.9), d(0.6))) * 400 : 0;
  if (tq >= r(19.4) && away < 399) {
    c.save(); c.translate(cutX, yc - 150 - away); c.lineJoin = 'round';
    [-1, 1].forEach((sg) => {
      const tip = [-sg * (6 + 46 * so), 170], hd = [sg * (30 + 84 * so), -130];
      poly(c, [[0, 0], [-sg * 4 - 12, 20], tip, [4, 0]]); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 5; c.strokeStyle = '#000'; c.stroke();
      c.fillStyle = '#000'; brush(c, [[0, 0], [hd[0] * 0.5, hd[1] * 0.5], hd], 16, () => 1);
      c.beginPath(); c.arc(hd[0], hd[1] - 16, 28, 0, TAU); c.lineWidth = 12; c.strokeStyle = '#000'; c.stroke(); c.lineWidth = 5; c.strokeStyle = RED; c.stroke();
    });
    c.fillStyle = '#000'; c.beginPath(); c.arc(0, 0, 11, 0, TAU); c.fill(); c.restore();
  }
  [150, 234, 318, 402, 486, 570].forEach((tx, i) => {
    const t0p = r(20.7) + i * d(0.08), u = ease.inOut(T01(t0p + d(0.25), d(1.2)));
    if (tq < t0p) return;
    const sx = cutX + (i - 2.5) * 22, sy = yc + 10, k0 = ease.back(T01(t0p, d(0.25)));
    const x = lerp(sx, tx, u), y = lerp(sy, 924, u) - Math.sin(Math.PI * u) * 150;
    let sq = 1; if (tq >= r(24.1)) sq = 1 - 0.3 * Math.sin(Math.PI * Math.min(1, T01(r(24.1), d(0.5)) * 1.6));
    const s0 = u < 0.01 ? 0.3 + 0.7 * k0 : 1;
    c.save(); c.translate(x, y + (1 - sq) * 20); c.scale(s0, s0); pod(c, 0, 0, 70, 54, sq); c.restore();
  });
  if (tq >= r(22.3)) { const k = T01(r(22.3), 0.17), sc = 1 + 0.5 * Math.pow(1 - k, 2), dy = tq >= r(24.1) ? 7 * Math.sin(Math.PI * Math.min(1, T01(r(24.1), d(0.5)) * 1.6)) : 0; c.save(); c.translate(360, 770 + dy); c.scale(sc, sc); inkShoe(c, 0, 0, 1.7, { sole: 34, msTone: 0.2 }); c.restore(); }
  const ip = T01(r(23.6), d(0.5));
  if (ip > 0) { mArrow(c, [[360, 430], [360, 500], [360, 590], [360, 670]], 34, ip, '#fff'); if (tq >= r(24.0)) narr(c, 420, 450, 260, 70, ['SERAP IMPAK'], 38); }
  if (tq >= r(24.1) && tq < r(24.7)) { c.strokeStyle = '#000'; c.lineWidth = 4; [-1, 1].forEach((sg) => { for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(360, 924, 200 + k * 16 + (tq - r(24.1)) * 120, sg < 0 ? Math.PI * 0.95 : -0.1, sg < 0 ? Math.PI * 1.1 : 0.05); c.stroke(); } }); }
  sfxWord(c, r(20.5), 'ザクッ', 430, 220, 150, 100, -0.1, -0.25, RED, 0.1, 3);
  NP(c, r(19.3), 40, 30, 640, 76, ['INSPIRASI: HOS DIPOTONG'], 44);
  if (tq >= r(23.2)) { const k = T01(r(23.2), 0.17); bigText(c, 'CLOUDTEC', 360, 1110, 100, RED, -0.03, 1 + 0.7 * Math.pow(1 - k, 2)); }
}
const beat17 = (c) => hoseScene(c, T.b17.t0, T.b17.f);
// 18: knees and shins stay light
function beat18(c) {
  const t = T.b18;
  c.fillStyle = tone(c, 0.1); c.fillRect(0, 0, SW, SH);
  poly(c, [[0, 1040], [SW, 1030], [SW, SH], [0, SH]]); c.fillStyle = tone(c, 0.4); c.fill(); c.fillStyle = '#000'; brush(c, [[18, 1042], [360, 1036], [702, 1030]], 8, () => 1);
  c.fillStyle = '#000'; brush(c, bz([240, 160], [250, 400], [230, 640], [220, 960], 20), 120, () => 1); brush(c, bz([480, 160], [470, 400], [490, 640], [500, 960], 20), 120, () => 1);
  c.strokeStyle = '#fff'; c.lineWidth = 5; c.beginPath(); c.moveTo(200, 300); c.lineTo(200, 800); c.moveTo(460, 300); c.lineTo(460, 800); c.stroke();
  [[225, 600], [495, 600]].forEach(([x, y], i) => { const k = 1 + 0.1 * Math.sin(tq * 10 + i); c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 62 * k, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(x, y, 62 * k, 62 * k, 30), 7, jrng()); c.fillStyle = RED; c.beginPath(); c.arc(x, y, 30, 0, TAU); c.fill(); });
  inkShoe(c, 215, 1000, 0.9, { sole: 34, msTone: 0.2 }); inkShoe(c, 505, 1000, 0.9, { sole: 34, msTone: 0.2 });
  [215, 505].forEach((x) => [-60, 0, 60].forEach((o) => pod(c, x + o, 1082, 44, 34, 1)));
  const ip = T01(t.arrow, 0.5); if (ip > 0) mArrow(c, [[360, 1180], [360, 1130], [360, 1070], [360, 1020]], 30, ip, '#fff');
  NP(c, t.cap, 40, 40, 640, 90, ['IMPAK DISERAP'], 56); NP(c, t.cap2, 40, 1170, 640, 80, ['LUTUT & SHIN TAK BERAT'], 44);
  sfxWord(c, t.arrow, 'ズン', 500, 330, 140, 110, -0.1, -0.25, RED, 0.12, 3);
}
// 19: runners' choice
function beat19(c) {
  const t = T.b19;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH); fl(c, 360, 540, 200, 1500, 260, 6, 1900);
  const k = ease.back(T01(t.run, 0.4));
  c.save(); c.translate(360, 520); c.scale(1.35 * k, 1.35 * k); c.fillStyle = '#000'; c.lineCap = 'round';
  c.beginPath(); c.arc(0, -150, 46, 0, TAU); c.fill(); brush(c, [[0, -100], [0, 100]], 90, () => 1);
  brush(c, bz([-30, -90], [-90, -130], [-120, -190], [-140, -250], 10), 34, () => 1); brush(c, bz([30, -90], [90, -130], [120, -190], [140, -250], 10), 34, () => 1);
  brush(c, bz([-20, 80], [-50, 160], [-70, 220], [-90, 280], 10), 44, () => 1); brush(c, bz([20, 80], [50, 160], [70, 220], [90, 280], 10), 44, () => 1);
  c.restore();
  sparks(c, t.run + 0.3, [[110, 330, 0], [610, 300, 0.1], [140, 800, 0.2], [600, 820, 0.3]], 40);
  inkShoe(c, 360, 860, 1.1, { sole: 34, msTone: 0.2 });
  if (tq >= t.cap) { const kk = T01(t.cap, 0.17); bigText(c, 'PILIHAN', 360, 1030, 92, '#000', -0.02, 1 + 0.6 * Math.pow(1 - kk, 2)); bigText(c, 'RUNNER', 360, 1140, 92, RED, 0.02, 1 + 0.6 * Math.pow(1 - kk, 2)); }
  sfxWord(c, t.run + 0.2, 'キラッ', 430, 150, 110, 90, 0.1, -0.2, RED, 0.12, 3);
}
// 20: every sport
function sportIcon(c, i, x, y, r) {
  c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(x, y, r, r, 44), 8, jrng());
  c.save(); c.beginPath(); c.arc(x, y, r - 6, 0, TAU); c.clip(); c.strokeStyle = '#000'; c.lineWidth = 6;
  if (i === 0) { ball(c, x, y, r * 0.72); }
  else if (i === 1) { c.fillStyle = tone(c, 0.35); c.fillRect(x - r, y - r, 2 * r, 2 * r); c.beginPath(); c.arc(x, y, r * 0.8, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(x - r, y); c.lineTo(x + r, y); c.moveTo(x, y - r); c.lineTo(x, y + r); c.arc(x - r * 1.05, y, r * 0.9, -0.9, 0.9); c.moveTo(x + r * 0.2, y); c.arc(x + r * 1.05, y, r * 0.9, Math.PI - 0.9, Math.PI + 0.9); c.stroke(); }
  else if (i === 2) { c.fillStyle = tone(c, 0.2); c.fillRect(x - r, y - r, 2 * r, 2 * r); c.beginPath(); c.arc(x - r * 0.95, y, r * 0.85, -1.1, 1.1); c.stroke(); c.beginPath(); c.arc(x + r * 0.95, y, r * 0.85, Math.PI - 1.1, Math.PI + 1.1); c.stroke(); c.lineWidth = 3; c.beginPath(); c.moveTo(x - r, y); c.lineTo(x + r, y); c.stroke(); }
  else { inkShoe(c, x, y, r / 190, { sole: 24 }); }
  c.restore();
}
function beat20(c) {
  const t = T.b20;
  c.fillStyle = tone(c, 0.12); c.fillRect(0, 0, SW, SH);
  [[200, 360], [520, 360], [200, 740], [520, 740]].forEach(([x, y], i) => pop(c, t.ic[i], x, y, () => sportIcon(c, i, x, y, 140)));
  if (tq >= t.on) { const k = T01(t.on, 0.2), sc = 1 + 0.9 * Math.pow(1 - k, 2); fl(c, 360, 550, 110, 700, 100, 4, 2050); c.save(); c.translate(360, 550); c.scale(sc, sc); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 100, 0, TAU); c.fill(); c.fillStyle = '#000'; inkLoop(c, ellPts(0, 0, 100, 100, 40), 9, jrng()); c.fillStyle = RED; c.beginPath(); c.arc(0, 0, 80, 0, TAU); c.fill(); c.font = '400 88px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 6; c.lineJoin = 'round'; c.strokeText('ON', 0, 6); c.fillText('ON', 0, 6); c.restore(); }
  NP(c, t.cap, 40, 40, 640, 80, ['BUKAN RUNNER SAHAJA'], 52);
  if (tq >= t.cap2) { const k = T01(t.cap2, 0.17); bigText(c, 'SEMUA', 360, 1040, 120, '#000', -0.02, 1 + 0.6 * Math.pow(1 - k, 2)); bigText(c, 'SUKAN', 360, 1160, 120, RED, 0.02, 1 + 0.6 * Math.pow(1 - k, 2)); }
  sfxWord(c, t.on, 'ドン', 70, 960, 110, 90, -0.12, -0.25, RED, 0.12, 3);
}
// 21: luxury collaborations
function beat21(c) {
  const t = T.b21, name = tq >= t.name;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH); fl(c, 360, 520, 300, 1500, 160, 5, 2150);
  const defs = [[95, 220, 'ON', 1], [375, 220, name ? 'LOEWE' : 'LUX', 0], [95, 500, name ? 'LOEWE' : 'LUX', 0], [375, 500, 'ON', 1]];
  defs.forEach(([x, y, txt, white], i) => pop(c, t.tiles[i], x + 125, y + 125, () => {
    c.fillStyle = '#000'; c.fillRect(x + 9, y + 9, 250, 250); c.fillStyle = white ? '#fff' : '#000'; c.fillRect(x, y, 250, 250); c.lineWidth = 6; c.strokeStyle = '#000'; c.strokeRect(x, y, 250, 250);
    if (white) { c.fillStyle = tone(c, 0.12); c.fillRect(x + 12, y + 12, 226, 70); }
    c.fillStyle = white ? '#000' : '#fff'; c.font = `400 ${txt.length > 3 ? 60 : 96}px "Archivo Black"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x + 125, y + 135);
  }));
  if (tq >= t.tiles[3] + 0.3) { const k = T01(t.tiles[3] + 0.3, 0.2); bigText(c, '×', 360, 500, 170, RED, 0, 1 + 0.8 * Math.pow(1 - k, 2)); }
  NP(c, t.cap, 40, 40, 640, 90, ['LUXURY STATUS SYMBOL'], 50);
  if (name) { NP(c, t.name, 60, 840, 600, 100, ['ZENDAYA × LOEWE'], 58); sparks(c, t.name, [[80, 170, 0], [650, 190, 0.1], [90, 800, 0.2], [640, 780, 0.3]], 38); sfxWord(c, t.name, 'キラッ', 400, 1100, 110, 90, 0.1, -0.2, RED, 0.12, 3); }
  else sfxWord(c, t.tiles[1], 'キラッ', 440, 1050, 110, 90, 0.1, -0.2, RED, 0.12, 3);
}
// 22: hot controversy
function beat22(c) {
  const t = T.b22;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  fl(c, 360, 500, 150, 1500, 220, 9, 2200, RED); fl(c, 360, 500, 170, 1500, 220, 4, 2210);
  const k = T01(t.ex, 0.2); if (k > 0) bigText(c, '!!', 360, 480, 520, RED, Math.sin(tq * 7) * 0.04, 1 + 0.6 * Math.pow(1 - k, 2), 0.35);
  NP(c, t.cap, 40, 920, 640, 150, ['KONTROVERSI', 'PANAS!'], 62);
  sfxWord(c, t.ex + 0.1, 'ザワ', 80, 230, 120, 110, -0.15, -0.25, RED, 0.12, 3);
}
// 23: Mbappé joins On (football scene) and 24: On Football
function footballScene(c, t0) {
  const r = fT(t0);
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  fl(c, 370, 640, 230, 1500, 150, 9, 1100, RED); fl(c, 370, 640, 240, 1500, 260, 5, 1200);
  const fu = ease.out(T01(r(35.17), 0.6)); c.save(); c.translate((1 - fu) * -420, 0); footballer(c, T01(r(36.4), 0.5)); c.restore();
  const bu = T01(r(36.6), 0.9), bx = lerp(570, 540, bu), by = lerp(745, 430, ease.out(bu)), br = lerp(46, 80, bu);
  if (tq >= r(36.6)) { ball(c, bx, by, br); if (bu >= 1) { const k = T01(r(37.5), 0.17); c.save(); c.translate(bx, by); c.scale(1 + 0.8 * Math.pow(1 - k, 2), 1 + 0.8 * Math.pow(1 - k, 2)); c.fillStyle = RED; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 5; c.stroke(); c.font = '400 44px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('ON', 0, 3); c.restore(); } }
  else ball(c, 570, 760, 46);
  pop(c, r(35.3), 360, 225, () => bigText(c, 'MBAPPÉ', 360, 225, 118, '#000', -0.04));
  NP(c, r(35.9), 40, 300, 340, 64, ['ATLET LAMA NIKE'], 40); NP(c, r(36.4), 40, 372, 240, 64, ['JOIN ON!'], 46);
  sfxWord(c, r(37.4), 'ドドド', 70, 880, 130, 120, -0.2, -0.25, RED, 0.12, 3);
  NP(c, r(38.6), 90, 1120, 540, 100, ['BUKAN SEKADAR AMBASSADOR'], 36, RED);
}
const beat23 = (c) => footballScene(c, T.b23.t0);
function beat24(c) {
  const t = T.b24;
  c.fillStyle = PAPERC; c.fillRect(0, 0, SW, SH);
  fl(c, 360, 520, 200, 1500, 200, 9, 2400, RED); fl(c, 360, 520, 220, 1500, 220, 4, 2410);
  const k = ease.back(T01(t.ball, 0.4)); if (k > 0) { ball(c, 360, 500, 230 * k); const k2 = T01(t.ball + 0.4, 0.17); c.save(); c.translate(360, 500); c.scale(1 + 0.6 * Math.pow(1 - k2, 2), 1 + 0.6 * Math.pow(1 - k2, 2)); c.fillStyle = RED; c.beginPath(); c.arc(0, 0, 100, 0, TAU); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 7; c.stroke(); c.font = '400 96px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('ON', 0, 5); c.restore(); }
  if (tq >= t.title) bigText(c, 'ON FOOTBALL', 360, 880, 74, RED, -0.03, 1 + 0.7 * Math.pow(1 - T01(t.title, 0.17), 2));
  NP(c, t.cap, 40, 1020, 640, 160, ['TURUT TERLIBAT', 'DALAM PEMBIKINAN'], 52);
  sfxWord(c, t.ball, 'ゴゴゴ', 70, 260, 120, 115, 1.3, -0.2, RED, 0.12, 3);
}
// 25-29: closing, black pages
function darkRays(c, cx, cy, seed) {
  c.fillStyle = '#000'; c.fillRect(0, 0, SW, SH);
  c.save(); const r = H.rng(seed + boil * 13); c.fillStyle = RED; focusLines(c, cx, cy, 150, 1500, 200, r, 8); c.restore();
  c.save(); const r2 = H.rng(seed + 7 + boil * 7); c.fillStyle = '#fff'; focusLines(c, cx, cy, 200, 1500, 70, r2, 3); c.restore();
}
function silhouette(c, up) {
  const fy = lerp(560, 330, up);
  c.save(); c.fillStyle = '#fff'; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.arc(330, 520, 72, 0, TAU); c.fill(); brush(c, [[330, 580], [330, 660]], 60, () => 1);
  poly(c, [[110, 900], [130, 710], [220, 650], [440, 650], [530, 710], [550, 900]]); c.fill();
  brush(c, bz([470, 700], [560, 640], [560, 520], [510, fy + 40], 20), 74, () => 1);
  c.beginPath(); c.arc(510, fy, 54, 0, TAU); c.fill();
  c.strokeStyle = '#000'; c.lineWidth = 4; c.beginPath(); [[-20, -30, -22, 30], [0, -34, 0, 34], [20, -30, 22, 30]].forEach(([a, b, d, e]) => { c.moveTo(510 + a * 0.9, fy + b * 0.3 + 6); c.lineTo(510 + d * 0.9, fy + e * 0.3 + 6); }); c.stroke();
  c.fillStyle = '#000'; c.beginPath(); c.ellipse(310, 518, 7, 10, 0, 0, TAU); c.fill(); brush(c, [[250, 560], [270, 566], [292, 560]], 6);
  c.restore();
}
function beat25(c) {
  const t = T.b25;
  darkRays(c, 500, 420, 2500); silhouette(c, 0);
  sfxWord(c, t.sil, 'ゴゴゴ', 110, 280, 130, 125, 1.3, -0.2, RED, 0.12, 3);
  NP(c, t.cap, 40, 36, 640, 170, ['PENGAJARAN', 'UNTUK KITA SEMUA'], 56);
}
function beat26(c) {
  const t = T.b26, burn = ease.inOut(T01(t.burn, 0.8));
  darkRays(c, 360, 560, 2600);
  const k = ease.out(T01(t.fist, 0.5));
  c.save(); c.translate(360, 700 + (1 - k) * 300); c.fillStyle = '#fff'; c.lineJoin = 'round'; c.lineCap = 'round';
  const fist = rrPts(-170, -90, 340, 330, 90, 8); poly(c, fist); c.fill(); c.fillStyle = '#000'; inkLoop(c, fist, 8, jrng());
  c.strokeStyle = '#000'; c.lineWidth = 6; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-170 + (i + 1) * 85, -60); c.quadraticCurveTo(-170 + (i + 1) * 85 + 12, 20, -170 + (i + 1) * 85, 90); c.stroke(); }
  const cr = [lerp(224, 30, burn), lerp(38, 30, burn), lerp(27, 30, burn)].map((v) => Math.round(v));
  c.fillStyle = `rgb(${cr[0]},${cr[1]},${cr[2]})`; c.beginPath(); c.moveTo(-80, -90); [[-110, -150], [-60, -210], [0, -170], [40, -240], [80, -180], [110, -130], [90, -90]].forEach((q) => c.lineTo(q[0], q[1])); c.closePath(); c.fill(); c.lineWidth = 6; c.strokeStyle = '#000'; c.stroke();
  if (burn < 1) { c.fillStyle = `rgba(255,255,255,${0.9 * (1 - burn)})`; c.beginPath(); c.arc(0, -150, 28 * (1 - burn), 0, TAU); c.fill(); }
  c.restore();
  if (burn < 1) { c.strokeStyle = '#fff'; c.lineWidth = 5; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const x = 280 + i * 80, ph = tq * 8 + i * 2; c.beginPath(); c.moveTo(x, 470); c.bezierCurveTo(x - 20, 440, x + 20, 410 - 6 * Math.sin(ph), x, 380); c.stroke(); } }
  else { sparks(c, t.burn + 0.8, [[260, 420, 0], [450, 440, 0.1], [360, 380, 0.2]], 26); }
  NP(c, t.t1, 40, 40, 640, 90, ['GENGGAM BARA API'], 56);
  NP(c, t.t2, 60, 1060, 600, 100, ['BIAR JADI ARANG'], 62);
}
function beat27(c) {
  const t = T.b27;
  darkRays(c, 500, 420, 2700); silhouette(c, ease.out(T01(t.cnt0, 0.5)));
  sfxWord(c, t.cnt0 + 0.2, 'ズーン', 110, 270, 120, 125, 1.3, -0.2, RED, 0.12, 3);
  const cnt = tq >= t.land ? 1000 : Math.round(1000 * ease.out(T01(t.cnt0, t.land - t.cnt0))), k2 = T01(t.land, 0.2);
  c.save(); c.translate(360, 860); const sc = tq >= t.land ? 1 + 0.3 * Math.pow(1 - k2, 2) : 1; c.scale(sc, sc); bigText(c, cnt + '×', 0, 0, 150, RED, -0.03); c.restore();
  NP(c, t.cap, 40, 36, 640, 120, ['KENA REJECT', '1000 KALI PUN'], 54);
  if (tq >= t.give) { const k = T01(t.give, 0.2), sc2 = 1 + 0.6 * Math.pow(1 - k, 2); bigText(c, 'GIVE UP', 360, 1020, 120, '#fff', -0.03, sc2); c.save(); c.strokeStyle = RED; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(130, 1030); c.lineTo(590, 1000); c.stroke(); c.restore(); }
  if (tq >= t.opt) bigText(c, 'BUKAN OPTION', 360, 1160, 76, RED, 0.02, 1 + 0.6 * Math.pow(1 - T01(t.opt, 0.2), 2));
}
function beat28(c) {
  const t = T.b28;
  c.fillStyle = tone(c, 0.12); c.fillRect(0, 0, SW, SH); fl(c, 360, 500, 300, 1500, 140, 5, 2800);
  pop(c, t.q, 360, 380, () => bubble(c, 360, 380, 300, 190, [300, 620], ['SIAPA PERNAH', 'PAKAI ON?'], '400 68px "Patrick Hand"', 76));
  [[t.c[0], 150, 780, 'SAYA!'], [t.c[1], 560, 840, 'MESTI!'], [t.c[2], 330, 960, '❤']].forEach(([t0, x, y, txt]) => pop(c, t0, x, y, () => bubble(c, x, y, 130, 58, [x + (x < 360 ? 40 : -40), y - 90], [txt], '400 48px "Patrick Hand"', 50)));
  NP(c, t.cap, 40, 1090, 640, 150, ['SHARE PENDAPAT', 'DI KOMEN'], 56);
  sfxWord(c, t.c[0], 'ピコン', 440, 150, 100, 85, 0.1, -0.2, RED, 0.12, 3);
}
function peace(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.lineJoin = 'round';
  const fing = (x0, y0, x1, y1) => { c.fillStyle = '#000'; brush(c, [[x0, y0], [x1, y1]], 62, () => 1); c.fillStyle = '#fff'; brush(c, [[x0, y0], [x1, y1]], 46, () => 1); };
  fing(-40, -120, -120, -300); fing(40, -120, 120, -300);
  const palm = rrPts(-100, -150, 200, 230, 64, 6); poly(c, palm); c.fillStyle = '#fff'; c.fill(); c.fillStyle = '#000'; inkLoop(c, palm, 8, jrng());
  c.fillStyle = '#000'; brush(c, [[-120, -70], [-60, -10]], 48, () => 1); c.fillStyle = '#fff'; brush(c, [[-112, -66], [-62, -16]], 32, () => 1);
  c.strokeStyle = '#000'; c.lineWidth = 6; c.beginPath(); c.moveTo(-30, -20); c.lineTo(50, -24); c.moveTo(-30, 20); c.lineTo(50, 16); c.stroke();
  c.restore();
}
function beat29(c) {
  const t = T.b29;
  darkRays(c, 360, 480, 2900);
  const bk = ease.back(T01(t.follow, 0.4)); c.save(); c.translate(360, 330); c.scale(bk, bk);
  c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-250, -90, 500, 180, 40); c.fill(); c.lineWidth = 8; c.strokeStyle = '#000'; c.stroke();
  c.font = '400 96px "Archivo Black"'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = RED; c.fillText('FOLLOW', 0, 6); c.restore();
  NP(c, t.cap, 40, 560, 640, 170, ['KOMEN BRAND', 'SETERUSNYA!'], 62);
  if (tq >= t.peace) { const k = ease.back(T01(t.peace, 0.4)); peace(c, 360, 1010, 1.0 * k); bigText(c, 'PEACE OUT', 360, 1170, 86, '#fff', -0.02, 1 + 0.6 * Math.pow(1 - T01(t.peace + 0.2, 0.2), 2)); sfxWord(c, t.peace + 0.1, 'ピース', 440, 800, 100, 85, 0.1, -0.2, RED, 0.12, 3); }
  sparks(c, t.follow, [[90, 160, 0], [640, 150, 0.2]], 34);
}
const BEATS = [beat01, beat02, beat03, beat04, beat05, beat06, beat07, beat08, beat09, beat10, beat11, beat12, beat13, beat14, beat15, beat16, beat17, beat18, beat19, beat20, beat21, beat22, beat23, beat24, beat25, beat26, beat27, beat28, beat29];
const PAGE_OVER = { 0: hero1 };

// ---------- page assembly ----------
const PAGE_BEATS = [0, 1, 2, 3, 4].map(() => []);
PAGE_OF.forEach((p, b) => PAGE_BEATS[p].push(b));
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
  stack(c, PAGE_BEATS[pg]); if (PAGE_OVER[pg]) PAGE_OVER[pg](c);
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
  let ti = -1; TURNS.forEach((s, i) => { if (t >= s && t < s + TURN_D) ti = i; });
  if (ti < 0) { let pg = 0; TURNS.forEach((s, i) => { if (t >= s + TURN_D) pg = i + 1; }); drawPageTo(ctx, pg, t); }
  else {
    const la = pageLayer(0, ti, TURNS[ti] - 0.01), lb = pageLayer(1, ti + 1, t);
    ctx.setTransform(PS, 0, 0, PS, 0, 0); ctx.fillStyle = '#d9d6cf'; ctx.fillRect(0, 0, SW, SH);
    turn(ctx, la, lb, (t - TURNS[ti]) / TURN_D);
  }
  setT(t); ctx.setTransform(PS, 0, 0, PS, 0, 0);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(paper(W, H_), 0, 0, W, H_); ctx.restore();
  ctx.restore();
  H.grain(ctx, W, H_, 0.035, 9 + boil);
}
