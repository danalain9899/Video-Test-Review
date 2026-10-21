"""Jana SFX placeholder (whoosh, pop, impact, riser, tick) dan BGM ambient ringkas. Tukar dengan aset berlesen jika mahu."""
import numpy as np, wave, sys, os
SR = 44100
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x, gain=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    w = wave.open(f"{out}/{name}.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()

def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y

def env(n, a, r):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na); e[-nr:] = np.linspace(1, 0, nr) ** 2; return e

# whoosh: noise dengan low-pass yang menyapu naik-turun
n = int(0.7 * SR); t = np.arange(n) / SR; noise = rng.standard_normal(n)
sweep = np.zeros(n); blocks = 28
for b in range(blocks):
    s, e = b * n // blocks, (b + 1) * n // blocks
    fc = 300 + 5000 * np.sin(np.pi * (b + 0.5) / blocks) ** 2
    sweep[s:e] = lp(noise[s:e], fc)
save("whoosh", sweep * np.sin(np.pi * t / t[-1]) ** 1.5)
# pop
n = int(0.12 * SR); t = np.arange(n) / SR
save("pop", np.sin(2 * np.pi * (500 + 900 * np.exp(-t * 40)) * t) * np.exp(-t * 38))
# tick (kecil, untuk checklist)
n = int(0.08 * SR); t = np.arange(n) / SR
save("tick", (np.sin(2 * np.pi * 1800 * t) + 0.5 * np.sin(2 * np.pi * 2700 * t)) * np.exp(-t * 60), 0.6)
# impact: thud + noise burst
n = int(1.2 * SR); t = np.arange(n) / SR
thud = np.sin(2 * np.pi * (55 + 90 * np.exp(-t * 14)) * t) * np.exp(-t * 4.5)
burst = lp(rng.standard_normal(n), 2500) * np.exp(-t * 14) * 0.5
save("impact", thud + burst)
# riser
n = int(1.6 * SR); t = np.arange(n) / SR
f = 200 * 2 ** (t / t[-1] * 3.2); ph = 2 * np.pi * np.cumsum(f) / SR
r = np.sin(ph) * 0.6 + lp(rng.standard_normal(n), 4000) * (t / t[-1]) * 0.6
save("riser", r * (t / t[-1]) ** 1.6, 0.7)

# BGM 124s loop: Am-F-C-G pad lembut + denyut halus, 80 bpm, dibina 240s (dipotong dalam Remotion)
dur = 240; n = dur * SR; t = np.arange(n) / SR
chords = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [261.63, 329.63, 392.0], [196.0, 246.94, 293.66]]
bar = 4 * 60 / 80; bgm = np.zeros(n)
for k in range(int(dur / bar) + 1):
    s = int(k * bar * SR); e = min(n, int((k + 1) * bar * SR + 0.6 * SR))
    if s >= n: break
    tt = np.arange(e - s) / SR; ch = chords[k % 4]; pad = np.zeros(e - s)
    for fr in ch:
        for det in (0.996, 1.0, 1.004):
            pad += np.sin(2 * np.pi * fr * det * tt) + 0.3 * np.sin(2 * np.pi * 2 * fr * det * tt)
    pad += 0.9 * np.sin(2 * np.pi * (ch[0] / 2) * tt)
    a = np.minimum(1, tt / 0.8) * np.minimum(1, (bar + 0.6 - tt) / 0.6)
    bgm[s:e] += pad * a
beat = 60 / 80
pulse = np.zeros(n)
for k in range(int(dur / beat)):
    s = int(k * beat * SR); m = min(n - s, int(0.25 * SR)); tt = np.arange(m) / SR
    pulse[s:s + m] += np.sin(2 * np.pi * 60 * tt) * np.exp(-tt * 14) * (1.0 if k % 4 == 0 else 0.55)
bgm = lp(bgm, 1800); bgm = bgm / np.max(np.abs(bgm)) * 0.8 + pulse * 0.35
save("bgm", bgm, 0.8)
print("audio siap")
