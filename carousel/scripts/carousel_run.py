"""Orchestrator for the Instagram carousel generator.

Subcommands:
  init <slug>       create a fresh run folder + starter plan.json, print its path
  generate <run>    generate every slide background via gpt-image-2 (PAID)
  render <run>      overlay the template on each background -> 1080x1350 PNGs
  export <run>      copy final numbered slides into output/<slug>/
  produce <run>     generate + render + export

APPROVAL GATE: never run `generate` / `produce` until the user has approved the
plan.json (backgrounds cost real kie.ai credits). `init` / `render` are free.
"""
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

import carousel_config as cfg


def _slugify(s: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:48] or "carousel"


# Shared style sentence so every background reads as one set. Edit once, applies to all.
_STYLE = (
    "Dreamy Studio-Ghibli-inspired photographic scene, warm pastel palette, bright airy "
    "sky with big soft cumulus clouds, soft golden light, gentle film grain, shallow depth "
    "of field with dreamy foreground bokeh. Keep the TOP HALF open (negative space for a "
    "headline). No text, no letters, no logos."
)


def _slide(index, role, headline, hero_word, subtitle, scene, topic_tag=""):
    return {
        "index": index,
        "role": role,                       # hook | body | cta (labels for you)
        "topic_tag": topic_tag,             # small pill top-left; "" hides it
        "headline": headline,
        "hero_word": hero_word,             # halftone accent word; "" hides it
        "subtitle": subtitle,               # pill text; "" hides the pill
        "image_prompt": f"{scene} {_STYLE}",
        "subject_image": None,              # optional 2nd input image (path under carousel/ or URL)
        "bg_url": None, "bg_file": None, "out_file": None,
    }


def _starter_plan(slug: str, stamp: str) -> dict:
    """A 6-slide starter (hook -> 4 value slides -> CTA). Edit before `generate`.

    Carousel arc: slide 1 is the scroll-stopping HOOK, 2-5 deliver the value one
    idea per slide, slide 6 is the CTA. Keep it to 5-7 slides.
    """
    return {
        "slug": f"{stamp}-{slug}",
        "topic": "",
        "created": stamp,
        "brand_label": "MADE BY CLAUDE · 2026",
        "handle": "@justjay.md",
        "canvas": {"w": cfg.CANVAS_W, "h": cfg.CANVAS_H, "aspect": "4:5"},
        "slides": [
            _slide(1, "hook", "This carousel was made by", "Claude",
                   "And here's how, step by step.",
                   "A grassy hilltop with wildflowers under a wide open sky."),
            _slide(2, "body", "It starts with one", "reference",
                   "Drop in the look you want. That's the whole style locked.",
                   "A single sunlit meadow, calm and minimal, lots of open sky."),
            _slide(3, "body", "AI paints the scene", "",
                   "gpt-image-2 restyles every background to match that one reference.",
                   "Rolling pastel hills fading into soft clouds, painterly light."),
            _slide(4, "body", "Code lays the text", "",
                   "The headlines and captions are rendered crisp — never garbled.",
                   "A tidy hilltop with a lone tree, clean negative space up top."),
            _slide(5, "body", "6 slides, minutes not hours", "",
                   "One plan file, one command. The whole set stays on-brand.",
                   "A bright valley at golden hour, warm and expansive."),
            _slide(6, "cta", "Your turn", "",
                   "Save this. Follow @justjay.md for the full build.",
                   "A glowing sunset sky over open fields, inviting and warm."),
        ],
    }


def cmd_init(slug: str):
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    slug = _slugify(slug)
    run_dir = cfg.RUNS_DIR / f"{stamp}-{slug}"
    (run_dir / "media").mkdir(parents=True, exist_ok=True)
    (run_dir / "plan.json").write_text(json.dumps(_starter_plan(slug, stamp), indent=2))
    print(str(run_dir))


def cmd_generate(run_dir: str):
    import carousel_generate
    carousel_generate.generate(run_dir)


def cmd_render(run_dir: str):
    import carousel_render
    carousel_render.render(run_dir)


def cmd_export(run_dir: str):
    run_dir = Path(run_dir)
    plan = json.loads((run_dir / "plan.json").read_text())
    dest = cfg.OUTPUT_DIR / plan["slug"]
    dest.mkdir(parents=True, exist_ok=True)
    n = 0
    for slide in plan["slides"]:
        src = slide.get("out_file")
        if src and Path(src).exists():
            shutil.copy2(src, dest / f"{slide['index']:02d}.png")
            n += 1
    print(f"Exported {n} slide(s) -> {dest}")


def cmd_produce(run_dir: str):
    cmd_generate(run_dir)
    cmd_render(run_dir)
    cmd_export(run_dir)


_CMDS = {
    "init": cmd_init,
    "generate": cmd_generate,
    "render": cmd_render,
    "export": cmd_export,
    "produce": cmd_produce,
}

if __name__ == "__main__":
    if len(sys.argv) < 3 or sys.argv[1] not in _CMDS:
        print(__doc__)
        raise SystemExit(1)
    _CMDS[sys.argv[1]](sys.argv[2])
