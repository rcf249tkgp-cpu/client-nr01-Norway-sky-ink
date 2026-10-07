#!/usr/bin/env python3
"""Image pipeline for Sky Ink Tattoo.

  python3 scripts/images.py redact <dir-with-original-photos>
      Copies the original client photos into src/images/masters/ under
      descriptive names, removing client names / dates from memorial pieces.
      Originals never go into the repo – only the redacted masters do.

  python3 scripts/images.py build
      Turns every master into responsive WebP files in public/assets/img/
      and writes src/data/images.json (sizes for width/height attributes).

Requires Pillow + numpy.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MASTERS = ROOT / "src" / "images" / "masters"
OUT = ROOT / "public" / "assets" / "img" / "work"
MANIFEST = ROOT / "src" / "data" / "images.json"
WIDTHS = [480, 800, 1200]

# source file -> (master name, optional crop box, list of text polygons to remove)
SOURCES = {
    "1.jpg": ("familie-hender", None, [
        # name + date lettering beside the hands
        [(505, 128), (622, 128), (684, 350), (668, 474), (606, 474), (506, 242)],
    ]),
    "2.jpg": ("lille-my-fineline", None, []),
    # baby hand: name + date sit under the hand – crop them away
    "3.jpg": ("babyhand", (0, 230, 1320, 1130), []),
    "4.jpg": ("peoner-fineline", None, []),
    "5.jpg": ("rode-oyne", None, []),
    # sleeve: date under the clock
    "6.jpg": ("oye-arm", None, [
        [(548, 128), (678, 128), (678, 166), (548, 166)],
    ]),
    "7.jpg": ("anubis", None, []),
    "8.jpg": ("engel", None, []),
}


def _box(a: np.ndarray, r: int, axis: int) -> np.ndarray:
    pad = [(0, 0)] * a.ndim
    pad[axis] = (r + 1, r)
    c = np.cumsum(np.pad(a, pad, mode="edge"), axis=axis)
    hi = np.take(c, np.arange(2 * r + 1, c.shape[axis]), axis=axis)
    lo = np.take(c, np.arange(0, c.shape[axis] - 2 * r - 1), axis=axis)
    return (hi - lo) / (2 * r + 1)


def blur(a: np.ndarray, radius: int) -> np.ndarray:
    """Approximate Gaussian blur on float arrays (3 box passes per axis)."""
    r = max(1, radius // 2)
    for _ in range(3):
        a = _box(_box(a, r, 0), r, 1)
    return a


def remove_text(im: Image.Image, polygon) -> Image.Image:
    """Fill dark lettering inside polygon with the surrounding skin/shading.

    Normalised-convolution inpainting: the lettering pixels are masked out and
    rebuilt from a blur of their non-lettering neighbours, then feathered in.
    """
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    h, w = rgb.shape[:2]

    area = Image.new("L", (w, h), 0)
    ImageDraw.Draw(area).polygon(polygon, fill=255)
    area_np = np.asarray(area) > 0

    lum = rgb.mean(axis=2)
    local = np.asarray(
        Image.fromarray(lum.astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))
    ).astype(np.float32)
    ink = (lum < local - 12) & area_np
    ink_img = Image.fromarray((ink * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))
    ink = np.asarray(ink_img) > 0

    keep = (~ink).astype(np.float32)
    filled = np.empty_like(rgb)
    for radius in (6, 14, 28):
        num = np.stack([blur(rgb[..., c] * keep, radius) for c in range(3)], axis=2)
        den = blur(keep, radius)
        est = num / np.maximum(den, 1e-3)[..., None]
        if radius == 6:
            filled = est
        else:
            weak = den < 0.25
            filled[weak] = est[weak]

    # subtle grain so the patch matches the photo
    rng = np.random.default_rng(7)
    filled += rng.normal(0, 2.2, filled.shape)

    feather = np.asarray(ink_img.filter(ImageFilter.GaussianBlur(4))).astype(np.float32) / 255
    feather = np.clip(feather * 1.6, 0, 1)[..., None]
    out = rgb * (1 - feather) + filled * feather
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def redact(src_dir: Path):
    MASTERS.mkdir(parents=True, exist_ok=True)
    for src, (name, crop, polys) in SOURCES.items():
        im = ImageOps.exif_transpose(Image.open(src_dir / src)).convert("RGB")
        for poly in polys:
            im = remove_text(im, poly)
        if crop:
            im = im.crop(crop)
        im.save(MASTERS / f"{name}.jpg", quality=92, optimize=True)
        print("master", name, im.size)


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for path in sorted(MASTERS.glob("*.jpg")):
        im = Image.open(path).convert("RGB")
        w, h = im.size
        widths = [x for x in WIDTHS if x < w] + [min(w, WIDTHS[-1])]
        widths = sorted(set(widths))
        for tw in widths:
            th = round(h * tw / w)
            im.resize((tw, th), Image.LANCZOS).save(
                OUT / f"{path.stem}-{tw}.webp", quality=78, method=6
            )
        # tiny blurred placeholder colour
        avg = im.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
        manifest[path.stem] = {
            "w": w, "h": h, "widths": widths,
            "color": "#%02x%02x%02x" % avg,
        }
        print("built", path.stem, widths)
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    brand()


def brand():
    """Social share image (1200x630) and Apple touch icon."""
    out = ROOT / "public" / "assets" / "img" / "brand"
    out.mkdir(parents=True, exist_ok=True)
    im = Image.open(MASTERS / "oye-arm.jpg").convert("RGB")
    w, h = im.size
    scale = 1200 / w
    im = im.resize((1200, round(h * scale)), Image.LANCZOS)
    top = round(im.size[1] * 0.18)
    im = im.crop((0, top, 1200, top + 630))
    # night vignette
    y = np.linspace(-1, 1, 630)[:, None]
    x = np.linspace(-1, 1, 1200)[None, :]
    v = np.clip(1 - 0.55 * (x ** 2 + y ** 2), 0.25, 1)[..., None]
    arr = np.asarray(im).astype(np.float32) * v + np.array([10, 10, 12]) * (1 - v)
    Image.fromarray(arr.clip(0, 255).astype(np.uint8)).save(out / "og-image.jpg", quality=86, optimize=True)

    icon = Image.new("RGB", (720, 720), (10, 10, 12))
    d = ImageDraw.Draw(icon)
    c, r, k = 360, 250, 52
    star = []
    for i in range(8):
        ang = np.pi / 4 * i - np.pi / 2
        rad = r if i % 2 == 0 else k
        star.append((c + rad * np.cos(ang), c + rad * np.sin(ang)))
    d.polygon(star, fill=(201, 164, 92))
    icon.resize((180, 180), Image.LANCZOS).save(ROOT / "public" / "apple-touch-icon.png", optimize=True)
    print("built brand images")


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "redact":
        redact(Path(sys.argv[2]))
    elif len(sys.argv) >= 2 and sys.argv[1] == "build":
        build()
    else:
        print(__doc__)
        sys.exit(1)
