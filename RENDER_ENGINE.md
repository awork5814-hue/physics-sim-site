# Render Engine Overview

This project uses a lightweight, canvas-first rendering layer embedded in `app.js` to provide premium visual polish without altering physics logic.

## Goals
- High-DPI crispness via `resizeCanvas` (devicePixelRatio aware)
- Consistent glow, gradients, and typographic treatment across simulations
- Cached overlays and sprites to keep frame time low

## Core Utilities

### Renderer
A convenience wrapper that keeps canvas sizing and polish consistent per simulation.

- `new Renderer(canvas, ctx)`
- `renderer.size()` → `{ width, height }`
- `renderer.polish(accent)` → applies premium overlay (vignette, streak, glow)
- `renderer.glowPoint(...)` and `renderer.gradientLine(...)` proxy the shared utilities

### Shared Drawing Helpers
- `drawGlowingPoint(ctx, x, y, radius, color, intensity)`
  - Uses a cached radial-gradient sprite for crisp glow without heavy `shadowBlur`.
- `drawGradientLine(ctx, x1, y1, x2, y2, stops, width)`
  - Gradient strokes with rounded caps.
- `drawParticleSprite(ctx, particle)`
  - Renders particle-like points as a glowing sprite.

### Canvas Polish Overlay
`drawCanvasPolish(ctx, width, height, accent)` caches an offscreen overlay per size+accent:
- Soft corner glow
- Diagonal light streak
- Vignette to focus attention
- Subtle inner border

## Performance Notes
- All glow sprites are cached per canvas in `RENDER_CACHE`.
- Overlays are rendered once per size+accent and reused.
- `resizeCanvas` handles DPR scaling and image smoothing.

## Where It’s Applied
- `applyPolishToSim` wraps every simulation draw and applies the overlay polish.
- `drawLabel` now uses modern typography, pill backgrounds, and shadows.
- `drawAmbientParticles` now renders glowing particles with lighter blending.

## Extending
When you enhance a simulation:
1. Prefer `drawGlowingPoint` for points or stars.
2. Use `drawGradientLine` for trajectories or axes.
3. Keep expensive gradients cached in `RENDER_CACHE`.

