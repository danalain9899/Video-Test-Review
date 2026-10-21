"""Bina base.mp4 daripada rakaman asal: buang pause/ulangan, hook cold-open, un-mirror, grade warna + lighting, audio clean.
Guna: python3 -I tools/build_base.py <source.mp4> <source.wav16k> public/base.mp4
Output juga public/cuts.json (masa cut dalam timeline baru)."""
import sys, json, wave, subprocess, numpy as np

SRC, WAV, OUT = sys.argv[1:4]
TEST = len(sys.argv) > 4  # argumen ke-4 = uji 4 saat sahaja

# (mula, akhir) dalam saat rakaman asal. Susunan = susunan dalam video baru.
HOOK = (24.85, 31.30)
KEEP = [
    (0.30, 13.95), (15.75, 23.40), (24.50, 36.45), (37.20, 38.40),
    (39.30, 70.95), (74.90, 92.45), (98.50, 108.80), (115.00, 128.10),
    (133.50, 150.40), (150.90, 176.70), (184.85, 190.90), (194.20, 199.60),
    (203.00, 221.50),
]
PAUSE_DB, PAUSE_MIN, PAUSE_KEEP = -40.0, 0.38, 0.16  # pause >0.38s dipendekkan jadi 0.16s

w = wave.open(WAV)
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
SR, HOP = 16000, 160  # 10ms
env = 10 * np.log10(np.convolve(x**2, np.ones(HOP * 2) / (HOP * 2), 'same')[::HOP] + 1e-12)

def snap(t, r=0.12):
    i = int(t * 100); lo, hi = max(0, i - int(r * 100)), min(len(env) - 1, i + int(r * 100))
    return (lo + int(np.argmin(env[lo:hi + 1]))) / 100.0

def tighten(a, b):
    """Pecahkan segmen [a,b] pada pause panjang, kekalkan PAUSE_KEEP."""
    out, cur, i = [], a, int(a * 100)
    end = int(b * 100); run = None
    while i <= end:
        quiet = env[i] < PAUSE_DB
        if quiet and run is None: run = i
        if (not quiet or i == end) and run is not None:
            if (i - run) / 100 > PAUSE_MIN:
                s = run / 100 + PAUSE_KEEP / 2; e = i / 100 - PAUSE_KEEP / 2
                if s - cur > 0.15: out.append((cur, s))
                cur = e
            run = None
        i += 1
    out.append((cur, b))
    return out

segs = [(snap(*[HOOK[0]]), snap(HOOK[1]))]
segs = [tuple(s) for s in tighten(*segs[0])]
n_hook = len(segs)
for a, b in KEEP:
    segs += tighten(snap(a), snap(b))
segs = [(a, b) for a, b in segs if b - a > 0.12]

t, joints = 0.0, []
for a, b in segs:
    joints.append(round(t, 3)); t += b - a
mk = lambda L: "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in L)
W, H = 1072, 1904
yy, xx = np.mgrid[0:H, 0:W]
m = np.exp(-(((xx - W * 0.5) ** 2) / (2 * (W * 0.34) ** 2) + ((yy - H * 0.36) ** 2) / (2 * (H * 0.22) ** 2)))
D = OUT.rsplit("/", 1)[0]
mp = D + "/../tools/face_mask.pgm"
open(mp, "wb").write(f"P5 {W} {H} 255\n".encode() + (m * 255).astype(np.uint8).tobytes())

# Grade premium + lighting: kurangkan cast hijau, S-curve lembut, roll-off highlight, lift muka (mask elips), vignette halus
grade = (
    "colorchannelmixer=rr=1.0:gg=0.97:bb=1.02,"
    "curves=all='0/0.015 0.25/0.22 0.5/0.5 0.75/0.74 0.9/0.86 1/0.94',"
    "colorbalance=rs=-0.02:bs=0.04:rm=0.015:bm=-0.01:rh=0.02:bh=-0.015,"
    "eq=contrast=1.1:saturation=1.08:gamma=1.0"
)

def render(segl, out):
    """select tidak boleh susun semula klip, jadi hook dan bahagian utama dirender berasingan lalu disambung."""
    sel = mk(segl); dur = sum(b - a for a, b in segl)
    fc = (f"[0:v]select='{sel}',setpts=N/FRAME_RATE/TB,hflip,{grade},split[g1][g2];"
          "[g2]eq=brightness=0.03:contrast=1.03[lit];"
          "[1:v]format=yuv420p,loop=loop=-1:size=1,setpts=N/FRAME_RATE/TB[m];[g1][lit][m]maskedmerge[l];"
          "[l]vignette=angle=PI/5:mode=backward,unsharp=5:5:0.45:5:5:0.0,format=yuv420p[vout];"
          f"[0:a]aselect='{sel}',asetpts=N/SR/TB,highpass=f=75,afftdn=nr=14:nf=-42,"
          "equalizer=f=170:t=q:w=1.2:g=2.0,equalizer=f=3200:t=q:w=1.0:g=3.0,equalizer=f=9000:t=h:w=0.7:g=1.5,"
          "acompressor=threshold=-20dB:ratio=3.2:attack=8:release=140:makeup=4[aout]")
    subprocess.run(["ffmpeg", "-v", "error", "-stats", "-y", "-i", SRC, "-i", mp, "-filter_complex", fc, "-map", "[vout]", "-map", "[aout]",
                    "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-r", "30", "-c:a", "aac", "-b:a", "192k",
                    "-t", "4" if TEST else f"{dur:.3f}", out], check=True)

render(segs[:n_hook], D + "/_hook.mp4")
if TEST:
    sys.exit()
render(segs[n_hook:], D + "/_main.mp4")
open(D + "/_list.txt", "w").write("file '_hook.mp4'\nfile '_main.mp4'\n")
# sambung (video copy) + normalisasi kelantangan audio untuk keseluruhan video
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", D + "/_list.txt", "-c:v", "copy",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-c:a", "aac", "-b:a", "192k", OUT], check=True)
json.dump({"joints": joints, "duration": round(t, 3), "hookSegs": n_hook,
           "segments": [[round(a, 3), round(b, 3)] for a, b in segs]}, open(D + "/cuts.json", "w"))
print("segmen", len(segs), "durasi baru", round(t, 1), "s (asal 223.4s), hook segs", n_hook)
