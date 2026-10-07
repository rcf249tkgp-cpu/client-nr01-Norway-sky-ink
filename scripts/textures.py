#!/usr/bin/env python3
"""Generates the smoke / cloud textures used for the night-sky atmosphere.

  python3 scripts/textures.py

Writes horizontally tileable, transparent WebP files to public/assets/img/fx/.
They are animated with CSS transforms only, so they cost nothing at runtime.
"""
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "assets" / "img" / "fx"


def periodic_noise(w, h, cells_x, cells_y, rng):
    """Smooth value noise that wraps horizontally (cosine interpolation)."""
    grid = rng.random((cells_y + 1, cells_x))
    xs = np.linspace(0, cells_x, w, endpoint=False)
    ys = np.linspace(0, cells_y, h)
    x0 = np.floor(xs).astype(int)
    y0 = np.minimum(np.floor(ys).astype(int), cells_y - 1)
    fx = (1 - np.cos((xs - x0) * np.pi)) / 2
    fy = (1 - np.cos((ys - y0) * np.pi)) / 2
    x1 = (x0 + 1) % cells_x
    a = grid[y0][:, x0]
    b = grid[y0][:, x1]
    c = grid[y0 + 1][:, x0]
    d = grid[y0 + 1][:, x1]
    top = a * (1 - fx) + b * fx
    bot = c * (1 - fx) + d * fx
    return top * (1 - fy[:, None]) + bot * fy[:, None]


def fbm(w, h, seed, base=3, octaves=6):
    rng = np.random.default_rng(seed)
    total = np.zeros((h, w))
    amp, norm = 1.0, 0.0
    for o in range(octaves):
        cx = base * 2 ** o
        cy = max(1, round(cx * h / w))
        total += amp * periodic_noise(w, h, cx, cy, rng)
        norm += amp
        amp *= 0.52
    return total / norm


def smoke(name, w, h, seed, density, warm=(236, 228, 214), base=3, vertical="band"):
    n = fbm(w, h, seed, base=base)
    # ridged detail so it reads as smoke wisps rather than fog
    detail = 1 - np.abs(fbm(w, h, seed + 99, base=base * 2, octaves=5) * 2 - 1)
    v = n * 0.75 + detail * 0.25
    v = np.clip((v - 0.42) / 0.38, 0, 1) ** 1.7

    y = np.linspace(0, 1, h)[:, None]
    if vertical == "band":
        mask = np.exp(-((y - 0.55) ** 2) / 0.07)
    elif vertical == "bottom":
        mask = np.clip((y - 0.15) / 0.85, 0, 1) ** 1.2
    else:
        mask = np.ones_like(y)
    alpha = np.clip(v * mask * density, 0, 1)

    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = warm
    rgba[..., 3] = (alpha * 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(OUT / f"{name}.webp", quality=70, method=6)
    print("texture", name)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    smoke("smoke-a", 1600, 700, seed=3, density=0.55)
    smoke("smoke-b", 1600, 700, seed=11, density=0.38, base=2)
    smoke("clouds-low", 1600, 500, seed=21, density=0.6, vertical="bottom", warm=(220, 214, 204))
