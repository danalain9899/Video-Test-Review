// ===== ON "Kasut yang Semua Reject" — 140s manga explainer with voiceover (9:16, 720x1280 logical) =====
const SW = 720, SH = 1280, DURATION = 141.5;
let tq = 0, boil = 0;
const ease = H.ease, cl = H.clamp, lerp = H.lerp;
const on = (t0) => Math.ceil(t0 * 12 - 1e-6) / 12; // first drawn frame (animation runs on twos) that shows an event at t0
const setT = (t) => { tq = Math.floor(t * 12 + 1e-6) / 12; boil = Math.floor(t * 8); };

// beat start times: the panel slams in on the voiceover phrase it illustrates (VO scenes start at 0.2 / 23.0 / 52.2 / 96.8 / 121.6)
const A = [0.1, 5.4, 9.96, 14.6, 16.8,
  23.0, 28.9, 33.35, 38.75, 45.35,
  52.2, 57.39, 65.4, 71.01, 75.62, 80.2, 85.36, 90.4, 92.12,
  96.9, 102.53, 109.98, 112.73, 117.9,
  121.2, 124.9, 127.88, 131.5, 135.4];
const PAGE_OF = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4];
const TURNS = [22.45, 51.6, 96.1, 120.5], TURN_D = 0.5;
const PL = A.map((_, i) => { const r = H.rng(900 + i), s = () => Math.round(r.range(0, 12)); return [[18, 18 + s()], [702, 18 + s()], [702 - (s() % 3) * 4, 1262 - s()], [18 + (s() % 3) * 6, 1262 - s()]]; });
