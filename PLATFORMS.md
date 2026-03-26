# Platform Dimensions & Safe Zones

## Contents
- Platform reference table
- Safe zones (9:16, 16:9, 1:1, 4:5)
- Adapting layouts across formats
- Text sizing across formats
- Face cam zones
- Export config pattern

> **Note**: Platform limits (max duration, aspect ratios) may change over time. Verify against current platform documentation if precision matters.

## Platform reference

| Platform | Format | Canvas Size | Aspect Ratio | Max Duration |
|----------|--------|-------------|--------------|--------------|
| YouTube landscape | 16:9 | 1920×1080 | 16:9 | 12 hours |
| YouTube Shorts | 9:16 | 1080×1920 | 9:16 | 3 min |
| Instagram Reels | 9:16 | 1080×1920 | 9:16 | 90 sec |
| Instagram Feed (square) | 1:1 | 1080×1080 | 1:1 | 60 sec |
| Instagram Feed (portrait) | 4:5 | 1080×1350 | 4:5 | 60 sec |
| TikTok | 9:16 | 1080×1920 | 9:16 | 10 min |
| X (Twitter) video | 16:9 | 1920×1080 | 16:9 | 2 min 20 sec |
| X (Twitter) vertical | 4:5 | 1080×1350 | 4:5 | 2 min 20 sec |
| LinkedIn video | 16:9 | 1920×1080 | 16:9 | 10 min |
| LinkedIn vertical | 4:5 | 1080×1350 | 4:5 | 10 min |

When the user mentions a platform, use the corresponding dimensions. If they say "social" without specifying, default to 1080×1920 (9:16).

## Safe zones

Platforms overlay UI on top of the video. Keep important content out of these areas.

### 9:16 vertical (Shorts / Reels / TikTok)

- Top: avoid y < 192 (10%)
- Bottom: avoid y > 1536 (bottom 20%)
- Right: avoid x > 918 (right 15%) in bottom half
- Left: safe throughout

### 16:9 horizontal (YouTube / X / LinkedIn)

- Bottom: avoid y > 994 (bottom 8%)
- Otherwise mostly safe

### 1:1 square (Instagram feed)

- Bottom: avoid bottom 10%
- Center 80% is safe

### 4:5 portrait (Instagram / X / LinkedIn)

- Bottom: avoid bottom 12%
- Right edge: minor UI overlap
- Center 75% is safe

## Adapting layouts across formats

### Strategy 1: Responsive scaling (simple)

Scale all positions/sizes relative to canvas dimensions. Works when content is centered.

### Strategy 2: Layout variants (recommended)

Format-specific layout logic. Drawing methods stay the same, positioning changes per format:
- Landscape (`w > h`): side-by-side panels
- Square (`w === h`): stacked, compact
- Portrait (`w < h`): full-width, stacked

### Strategy 3: Subclass per format (complex layouts)

Override `animate()` in a subclass, inherit all drawing helpers.

## Text sizing across formats

| Element | Horizontal (16:9) | Vertical (9:16) | Square (1:1) | Portrait (4:5) |
|---------|-------------------|-----------------|--------------|-----------------|
| Title | `h * 0.08` | `w * 0.09` | `w * 0.08` | `w * 0.08` |
| Body text | `h * 0.03` | `w * 0.04` | `w * 0.035` | `w * 0.035` |
| Code font | `h * 0.022` | `w * 0.025` | `w * 0.023` | `w * 0.023` |
| Step label | `h * 0.03` | `w * 0.038` | `w * 0.032` | `w * 0.032` |

Rule: for landscape, size relative to `h`. For portrait/square, size relative to `w`.

## Face cam zones

If the user plans to overlay a face cam, reserve a circular area:

| Format | Position | Radius |
|--------|----------|--------|
| 9:16 | bottom-right (80%, 86%) | 16% of width |
| 16:9 | bottom-right (88%, 78%) | 16% of height |
| 1:1 | bottom-right (82%, 82%) | 15% of width |
| 4:5 | bottom-right (82%, 85%) | 15% of width |

Toggle with keyboard shortcut `F` during development.

## Export config pattern

```javascript
const FORMATS = {
    'youtube':    { w: 1920, h: 1080, duration: 30000 },
    'shorts':     { w: 1080, h: 1920, duration: 30000 },
    'reels':      { w: 1080, h: 1920, duration: 30000 },
    'ig-square':  { w: 1080, h: 1080, duration: 30000 },
    'ig-portrait':{ w: 1080, h: 1350, duration: 30000 },
    'tiktok':     { w: 1080, h: 1920, duration: 30000 },
};
```