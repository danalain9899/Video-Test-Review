
// ---------- sound: voiceover on top, SFX tucked underneath (minor sounds sit at 60%) ----------
function scoreSound(k) {
  { const k0 = k, sn = (t) => (Math.round(t * 48000) + 0.25) / 48000; k = { ...k0, play: (n, t, o) => k0.play(n, sn(t), o), tone: (t, o) => k0.tone(sn(t), o), noise: (t, o) => k0.noise(sn(t), o) }; }
  const pan = (x) => cl(x / 360 - 1, -1, 1) * 0.6;
  const slamS = (t, g = 1, p = 0) => { k.play('slap', t, { gain: 0.5 * g, pan: p, minor: true }); k.play('thud', t, { f: 120, gain: 0.4 * g, pan: p, minor: true }); };
  const flip = (t) => {
    k.play('paper', t, { dur: 0.18, gain: 0.45, pan: 0.4 });
    k.noise(t + 0.08, { dur: 0.36, color: 'pink', filter: 'bandpass', f: [[0, 600], [0.18, 1600], [0.36, 500]], q: 0.7, gain: 0.3, a: 0.16, pan: -0.1 });
    k.play('paper', t + 0.42, { dur: 0.1, gain: 0.3, pan: -0.5 });
  };
  const ctr = (t, f, g, p) => k.withMinor(() => { k.noise(t, { dur: 0.03, filter: 'bandpass', f, q: 1.4, gain: 0.3 * g, a: 0.001, pan: p }); k.tone(t, { f: f * 0.2, type: 'triangle', dur: 0.035, gain: 0.08 * g, pan: p }); });
  const dodo = (t, p) => { k.tone(t, { f: [[0, 90], [0.2, 48]], dur: 0.3, gain: 0.22, pan: p }); k.noise(t, { dur: 0.22, color: 'brown', filter: 'lowpass', f: 380, gain: 0.24, pan: p }); };
  const dodos = (t, p0 = -0.4) => [0, 1, 2].forEach((i) => dodo(on(t + i * 0.12), p0 + i * 0.15));
  const count = (t0, dur, to, f0, p) => { let last = -1; for (let f = Math.ceil(t0 * 12); f / 12 < t0 + dur; f++) { const tt = f / 12, v = Math.round(to * ease.out(cl((tt - t0) / dur))); if (v !== last) { ctr(tt, f0 + v / to * 600, 0.9, p); last = v; } } };
  const pp = (t, f = 300, g = 0.6, p = 0) => k.play('pop', on(t), { f, gain: g, pan: p, minor: true });
  const hit = (t, g = 1) => { k.play('impact', on(t), { gain: g }); k.play('stamp', on(t), { gain: 0.5 * g }); };
  const ring = (t) => k.play('sparkle', on(t), { gain: 0.8, n: 6 });

  // 1: the number
  slamS(on(A[0]), 0.7); count(T.b1.cnt0, T.b1.land - T.b1.cnt0, 70, 2100, 0); hit(T.b1.land, 1.0); [0, 1].forEach((i) => dodo(on(T.b1.land + i * 0.12) + 0.02, pan(480 + i * 150) * 0.5));
  pp(T.b1.cap, 300, 0.7); k.noise(T.b1.chip, { dur: 0.7, color: 'brown', filter: 'bandpass', f: [[0, 250], [0.35, 600], [0.7, 280]], q: 0.6, gain: 0.16, a: 0.3, minor: true });
  // 2: executives reject
  slamS(on(A[1]), 0.9); [T.b2.tilt, T.b2.tilt + 0.5, T.b2.tilt + 1.0].forEach((t, i) => k.play('tock', t, { f: 200 + i * 30, gain: 0.2, pan: (i - 1) * 0.5, minor: true }));
  pp(T.b2.bubble, 260, 0.8, 0.2); k.noise(T.b2.stamp - 0.25, { dur: 0.25, color: 'pink', filter: 'bandpass', f: [[0, 400], [0.25, 2200]], q: 0.8, gain: 0.2, a: 0.1 });
  hit(T.b2.stamp, 1.0); k.play('buzz', on(T.b2.stamp) + 0.05, { f: 90, dur: 0.35, gain: 0.45, minor: true });
  k.noise(T.b2.fall, { dur: 0.9, color: 'pink', filter: 'bandpass', f: [[0, 1800], [0.9, 300]], q: 0.7, gain: 0.2, a: 0.2, pan: 0.3, minor: true });
  // 3: idea becomes a brand
  slamS(on(A[2]), 0.8); k.play('whoosh', T.b3.shoe - 0.1, { dur: 0.5, gain: 0.45 }); pp(T.b3.shoe, 320, 0.7);
  ring(T.b3.spark); k.play('ding', on(T.b3.spark), { f: 'E6', gain: 0.4 }); k.play('stamp', on(T.b3.brand), { gain: 0.8 }); pp(T.b3.cap, 300, 0.6);
  // 4: Mbappé
  slamS(on(A[3]), 0.8); k.play('whoosh', T.b4.run - 0.1, { dur: 0.6, gain: 0.5, top: 3000 }); pp(T.b4.name, 240, 0.7); dodos(T.b4.name); k.play('slap', on(T.b4.kick + 0.2), { gain: 0.7, minor: true }); pp(T.b4.cap, 300, 0.5);
  // 5: teaser
  slamS(on(A[4]), 0.8); k.play('impact', on(T.b5.q), { gain: 0.7 }); k.noise(T.b5.q, { dur: 1.5, color: 'pink', filter: 'bandpass', f: 1200, q: 0.5, gain: 0.07, a: 0.4, hold: 0.8, minor: true });
  pp(T.b5.cap, 300, 0.6); for (let i = 0; i < 5; i++) k.play('whoosh', T.b5.crowd + i * 0.1, { dur: 0.25, gain: 0.2, pan: (i - 2) * 0.3, minor: true }); pp(T.b5.cap2, 320, 0.6);
  flip(TURNS[0]);
  // 6: 2010 athlete
  slamS(on(A[5]), 0.8); k.play('stamp', on(T.b6.title), { gain: 0.8 }); k.play('stroke', T.b6.sketch, { dur: T.b6.sketchD, material: 'pencil', gain: 1.0 });
  k.withMinor(() => { for (let i = 0; i < 4; i++) k.play('tock', on(T.b6.sketch + 0.2 + i * 0.14), { f: 1500 + i * 120, gain: 0.2 }); });
  pp(T.b6.cap, 320, 0.55); ring(T.b6.star); k.play('ding', on(T.b6.star), { f: 'E6', gain: 0.4 });
  // 7: garden hose rejected
  slamS(on(A[6]), 0.8); pp(T.b7.cap, 300, 0.5); k.play('stroke', T.b7.hose, { dur: T.b7.hoseD, material: 'brush', gain: 0.8 }); pp(T.b7.label, 280, 0.6);
  k.play('slap', on(T.b7.stamp), { gain: 0.9 }); k.noise(on(T.b7.stamp), { dur: 0.12, filter: 'highpass', f: 3500, gain: 0.5 }); k.play('impact', on(T.b7.stamp), { gain: 0.8 }); pp(T.b7.cap2, 260, 0.6);
  // 8: walks out
  slamS(on(A[7]), 0.8); for (let t = T.b8.walk; t < T.b8.walk + T.b8.walkD; t += 0.5) k.play('tock', t, { f: 120, gain: 0.18, pan: 0.1 * Math.sin(t), minor: true });
  dodos(T.b8.cap1); pp(T.b8.cap1, 300, 0.6); k.noise(T.b8.arrow, { dur: 1.0, color: 'pink', filter: 'bandpass', f: [[0, 400], [1.0, 1400]], q: 0.8, gain: 0.18, a: 0.7, pan: 0.3, minor: true }); k.play('stamp', on(T.b8.cap2), { gain: 0.7 });
  // 9: USD 19B (the key number)
  slamS(on(A[8]), 0.8); pp(T.b9.disc, 300, 0.7); count(T.b9.cnt0, T.b9.land - T.b9.cnt0, 19, 1800, 0); hit(T.b9.land, 1.4); ring(T.b9.land + 0.1); k.play('stamp', on(T.b9.stamp), { gain: 0.8 }); pp(T.b9.cap, 300, 0.5);
  // 10: Adidas & Puma
  slamS(on(A[9]), 0.9); T.b10.tag.forEach((t, i) => pp(t, 300 - i * 20, 0.6, (i - 1) * 0.5)); hit(T.b10.stamp, 0.9); k.play('buzz', on(T.b10.stamp) + 0.05, { f: 90, dur: 0.35, gain: 0.4, minor: true });
  k.noise(T.b10.fall, { dur: 0.9, color: 'pink', filter: 'bandpass', f: [[0, 1800], [0.9, 300]], q: 0.7, gain: 0.18, a: 0.2, minor: true });
  flip(TURNS[1]);
  // 11: growth
  slamS(on(A[10]), 0.8); pp(T.b11.ask, 280, 0.6); k.play('stroke', T.b11.axes, { dur: 0.4, material: 'brush', gain: 0.7 });
  k.noise(T.b11.curve, { dur: T.b11.curveD, color: 'pink', filter: 'bandpass', f: [[0, 250], [T.b11.curveD, 1500]], q: 1.1, gain: 0.12, a: T.b11.curveD * 0.8, minor: true }); k.tone(T.b11.curve, { f: [[0, 'C3'], [T.b11.curveD, 'C5']], type: 'triangle', dur: T.b11.curveD, gain: 0.05, a: T.b11.curveD * 0.8, minor: true });
  pp(T.b11.cap, 300, 0.5); hit(T.b11.tip, 0.9); ring(T.b11.tip);
  // 12: CloudTec + materials
  slamS(on(A[11]), 0.8); pp(T.b12.shoe, 300, 0.7); for (let i = 0; i < 6; i++) { k.play('tock', on(T.b12.pods + 0.5 + i * 0.1), { f: 500 + i * 60, gain: 0.3, pan: (i - 2.5) * 0.2, minor: true }); }
  k.play('stamp', on(T.b12.label), { gain: 0.9 }); k.play('slap', on(T.b12.eva + 0.3), { gain: 0.6 }); k.play('slap', on(T.b12.hel + 0.3), { gain: 0.6 }); ring(T.b12.hel + 0.3);
  // 13: two problems
  slamS(on(A[12]), 0.8); hit(T.b13.two, 0.9); k.play('stamp', on(T.b13.mas), { gain: 0.7 }); pp(T.b13.cap, 300, 0.5);
  // 14: elite
  slamS(on(A[13]), 0.8); k.play('whoosh', T.b14.shoe - 0.1, { dur: 0.5, gain: 0.4 }); k.play('whoosh', T.b14.run - 0.1, { dur: 0.5, gain: 0.4, pan: 0.3 }); pp(T.b14.label, 300, 0.5);
  k.play('stamp', on(T.b14.pace), { gain: 0.7 }); k.play('error', on(T.b14.x), { f: 'A3', gain: 0.7, minor: true }); k.play('stamp', on(T.b14.x), { gain: 0.8 });
  // 15: thick foam
  slamS(on(A[14]), 0.8); pp(T.b15.shoe, 240, 0.7); k.play('thud', on(T.b15.shoe + 0.3), { f: 70, gain: 0.3, minor: true }); pp(T.b15.label, 300, 0.5);
  count(T.b15.meter, T.b15.meterD, 22, 1500, 0.3); k.play('stamp', on(T.b15.meter + T.b15.meterD), { gain: 0.6 }); pp(T.b15.cap, 300, 0.5);
  // 16: split + ON
  { const r = sT(T.b16.t0); slamS(on(A[15]), 0.8); k.play('whoosh', r(25.3), { dur: 0.5, gain: 0.5 }); pp(r(25.8), 300, 0.55); k.play('whoosh', r(26.4), { dur: 0.5, gain: 0.5, pan: 0.3 }); pp(r(26.8), 260, 0.55);
    k.play('stroke', r(27.0), { dur: 0.55, material: 'brush', gain: 1.0 }); k.play('stamp', on(r(27.6)), { gain: 0.8 }); ring(r(27.6)); k.play('success', on(r(27.6)) + 0.08, { f: 'G5', gain: 0.5 }); pp(r(28.6), 300, 0.6); }
  // 17: hose -> CloudTec
  { const r = hT(T.b17.t0, T.b17.f), d = (x) => x * T.b17.f; slamS(on(A[16]), 0.8); pp(r(19.3), 300, 0.5); k.play('stroke', r(19.4), { dur: 0.5, material: 'marker', gain: 0.8 });
    k.play('click', r(19.9), { f: 1300, gain: 1.0 }); k.play('click', r(20.2), { f: 1500, gain: 1.0 }); k.play('slap', on(r(20.5)), { gain: 0.9 }); k.noise(on(r(20.5)), { dur: 0.12, filter: 'highpass', f: 3500, gain: 0.5 });
    for (let i = 0; i < 6; i++) pp(r(20.7) + i * d(0.08), 400 + i * 40, 0.3, (i - 2.5) * 0.2);
    k.play('whoosh', r(21.0), { dur: d(1.3), gain: 0.5, top: 1800 }); pp(r(22.3), 300, 0.7); k.play('stamp', on(r(23.2)), { gain: 0.9 });
    k.noise(r(23.6), { dur: d(0.5), color: 'pink', filter: 'bandpass', f: [[0, 500], [d(0.5), 1500]], q: 0.8, gain: 0.2, a: d(0.35), minor: true }); k.play('thud', on(r(24.1)), { f: 90, gain: 0.6 }); }
  // 18: knees & shins
  slamS(on(A[17]), 0.7); k.noise(T.b18.arrow, { dur: 0.5, color: 'pink', filter: 'bandpass', f: [[0, 500], [0.5, 1500]], q: 0.8, gain: 0.2, a: 0.3, minor: true }); k.play('thud', on(T.b18.arrow + 0.5), { f: 90, gain: 0.7 }); pp(T.b18.cap, 300, 0.5); pp(T.b18.cap2, 280, 0.5);
  // 19: runners' choice
  slamS(on(A[18]), 0.8); k.play('whoosh', T.b19.run - 0.1, { dur: 0.5, gain: 0.5 }); ring(T.b19.run + 0.3); k.play('stamp', on(T.b19.cap), { gain: 0.8 }); k.play('success', on(T.b19.cap) + 0.05, { f: 'C6', gain: 0.4 });
  flip(TURNS[2]);
  // 20: all sports
  slamS(on(A[19]), 0.8); pp(T.b20.cap, 300, 0.5); T.b20.ic.forEach((t, i) => { pp(t, 320 + i * 40, 0.6, (i % 2 ? 0.4 : -0.4)); }); hit(T.b20.on, 0.9); ring(T.b20.on); k.play('stamp', on(T.b20.cap2), { gain: 0.8 });
  // 21: luxury
  slamS(on(A[20]), 0.8); pp(T.b21.cap, 300, 0.5); T.b21.tiles.forEach((t, i) => k.play('slap', on(t), { gain: 0.6, pan: (i % 2 ? 0.4 : -0.4), minor: true })); k.play('stamp', on(T.b21.tiles[3] + 0.3), { gain: 0.8 });
  pp(T.b21.name, 300, 0.7); ring(T.b21.name); k.play('ding', on(T.b21.name), { f: 'G6', gain: 0.4 });
  // 22: hot controversy
  slamS(on(A[21]), 0.9); hit(T.b22.ex, 1.0); k.noise(T.b22.ex, { dur: 1.2, color: 'pink', filter: 'bandpass', f: 1500, q: 0.5, gain: 0.08, a: 0.3, minor: true }); pp(T.b22.cap, 300, 0.6);
  // 23: Mbappé joins
  { const r = fT(T.b23.t0); slamS(on(A[22]), 0.9); k.play('whoosh', r(35.1), { dur: 0.6, gain: 0.5, top: 3000 }); pp(r(35.3), 240, 0.7); pp(r(35.9), 300, 0.5); pp(r(36.4), 320, 0.6);
    k.play('slap', on(r(36.6)), { gain: 0.9 }); k.play('thud', on(r(36.6)), { f: 150, gain: 0.6 }); k.play('whoosh', r(36.7), { dur: 0.8, gain: 0.35, top: 2200, pan: 0.4 }); k.play('stamp', on(r(37.5)), { gain: 0.8 }); dodos(r(37.4), -0.5); pp(r(38.6), 340, 0.5); }
  // 24: On Football
  slamS(on(A[23]), 0.8); k.play('whoosh', T.b24.ball - 0.1, { dur: 0.45, gain: 0.5 }); k.play('stamp', on(T.b24.ball + 0.4), { gain: 0.9 }); dodos(T.b24.ball + 0.1, -0.6); k.play('stamp', on(T.b24.title), { gain: 0.8 }); pp(T.b24.cap, 300, 0.5);
  flip(TURNS[3]);
  // 25: lesson
  slamS(on(A[24]), 1.0); k.play('impact', on(A[24]), { gain: 0.5 }); dodos(T.b25.sil + 0.1, -0.6); pp(T.b25.cap, 300, 0.6);
  // 26: hold the ember until it turns to charcoal
  slamS(on(A[25]), 0.9); k.play('whoosh', T.b26.fist - 0.1, { dur: 0.5, gain: 0.45 }); pp(T.b26.t1, 300, 0.6); k.noise(T.b26.fist, { dur: 1.4, color: 'brown', filter: 'lowpass', f: 600, gain: 0.14, a: 0.4, minor: true });
  pp(T.b26.t2, 280, 0.6); k.noise(T.b26.burn, { dur: 0.8, color: 'pink', filter: 'bandpass', f: [[0, 3000], [0.8, 800]], q: 0.7, gain: 0.2, a: 0.1, minor: true }); k.play('thud', on(T.b26.burn + 0.8), { f: 80, gain: 0.6 }); ring(T.b26.burn + 0.8);
  // 27: 1000 rejections
  slamS(on(A[26]), 1.0); k.play('riser', T.b27.cnt0 - 0.1, { dur: 0.7, gain: 0.4 }); count(T.b27.cnt0, T.b27.land - T.b27.cnt0, 1000, 1800, 0); pp(T.b27.cap, 300, 0.6);
  hit(T.b27.land, 1.0); k.play('stamp', on(T.b27.give), { gain: 1.0 }); k.play('impact', on(T.b27.give), { gain: 0.6 }); k.play('stamp', on(T.b27.opt), { gain: 0.8 });
  // 28: comment question
  slamS(on(A[27]), 0.8); pp(T.b28.q, 300, 0.8); T.b28.c.forEach((t, i) => { pp(t, 360 + i * 60, 0.6, (i - 1) * 0.5); k.play('tick', on(t), { gain: 0.7, minor: true }); }); pp(T.b28.cap, 300, 0.5);
  // 29: CTA + peace
  slamS(on(A[28]), 0.8); pp(T.b29.follow, 300, 0.8); k.play('select', on(T.b29.follow), { gain: 0.7, minor: true }); pp(T.b29.cap, 320, 0.6);
  hit(T.b29.peace, 0.9); ['G4', 'C5', 'E5', 'G5'].forEach((n, i) => k.tone(on(T.b29.peace) + 0.06 + i * 0.08, { f: n, type: 'triangle', dur: 1.3 - i * 0.12, gain: 0.13, a: 0.004, verb: 0.3, pan: (i - 1.5) * 0.2 }));
}
