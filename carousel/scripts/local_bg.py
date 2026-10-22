"""Free, offline backgrounds (no API): white paper + grain + orange brush scribbles + black ink marks.
Usage: python local_bg.py <run_dir>   -> writes media/slideNN.png and sets bg_file in plan.json
"""
import json, os, sys
from pathlib import Path

O, K = "#F26A1B", "#111111"
W, H = 1080, 1350

# per-slide shapes, kept to the edges / lower area so the text zone stays clean
SHAPES = {
 1: f'''<path d="M-40 1250 C 280 1170, 700 1310, 1130 1190" stroke="{O}" stroke-width="60" fill="none" stroke-linecap="round" filter="url(#rough)"/>
        <path d="M690 1090 C 800 1060, 920 1070, 1020 1100" stroke="{K}" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#rough)"/>
        <circle cx="930" cy="760" r="16" fill="{O}"/><circle cx="990" cy="800" r="9" fill="{K}"/><circle cx="120" cy="720" r="12" fill="{O}"/>''',
 2: f'''<path d="M-40 1240 C 260 1160, 640 1300, 1130 1170" stroke="{O}" stroke-width="58" fill="none" stroke-linecap="round" filter="url(#rough)"/>
        <path d="M700 1090 C 800 1060, 920 1070, 1020 1100" stroke="{K}" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#rough)"/>
        <circle cx="990" cy="600" r="14" fill="{O}"/><circle cx="1030" cy="640" r="8" fill="{K}"/>''',
 3: f'''<path d="M-40 1290 C 300 1210, 700 1320, 1130 1230" stroke="{O}" stroke-width="54" fill="none" stroke-linecap="round" filter="url(#rough)"/>
        <path d="M60 1180 C 160 1150, 280 1160, 380 1190" stroke="{K}" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#rough)"/>
        <circle cx="940" cy="1130" r="12" fill="{O}"/><circle cx="90" cy="1100" r="9" fill="{K}"/>''',
 4: f'''<path d="M180 1010 C 150 800, 520 730, 850 800 C 1100 860, 1060 1160, 760 1240 C 470 1310, 150 1220, 190 980" stroke="{O}" stroke-width="42" fill="none" stroke-linecap="round" filter="url(#rough)"/>
        <circle cx="90" cy="760" r="14" fill="{O}"/><circle cx="1000" cy="720" r="10" fill="{K}"/>
        <path d="M60 1300 L 300 1290" stroke="{K}" stroke-width="5" stroke-linecap="round" filter="url(#rough)"/>''',
}

def svg(i):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
<filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
 <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="3" seed="{i*7}" result="n"/>
 <feDisplacementMap in="SourceGraphic" in2="n" scale="12"/>
</filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="{i}"/>
 <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter>
</defs>
<rect width="100%" height="100%" fill="#FFFFFF"/>
{SHAPES[i]}
<rect width="100%" height="100%" filter="url(#grain)"/>
</svg>'''

def main(run_dir):
    run = Path(run_dir); plan = json.loads((run/"plan.json").read_text())
    media = run/"media"; media.mkdir(exist_ok=True)
    from playwright.sync_api import sync_playwright
    exe = os.getenv("CHROMIUM_PATH")
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        for s in plan["slides"]:
            pg.set_content(f'<body style="margin:0">{svg(s["index"])}</body>')
            out = media/f'slide{s["index"]:02d}.png'
            pg.screenshot(path=str(out)); s["bg_file"] = str(out); print("bg", out)
        b.close()
    (run/"plan.json").write_text(json.dumps(plan, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main(sys.argv[1])
