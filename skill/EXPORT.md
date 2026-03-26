# Exporting to MP4

## Requirements

- Node.js
- `npm install puppeteer`
- `ffmpeg` on PATH

## Usage

Copy `scripts/export.js` into the project root (or `scripts/` folder) and adapt the `FORMATS` config block at the top to match the project's HTML files and animation class names.

Then run:

```bash
node scripts/export.js horizontal
node scripts/export.js vertical
```

Do NOT run the export automatically — provide the command to the user and let them run it when ready.

## Configuration

The only part to adapt per project is the `FORMATS` object at the top of `scripts/export.js`:

```javascript
const FORMATS = {
    horizontal: { w: 1920, h: 1080, html: 'animation.html', duration: 30000, animClass: 'MyAnimation' },
    vertical:   { w: 1080, h: 1920, html: 'animation-vertical.html', duration: 30000, animClass: 'MyVerticalAnimation' },
};
```

- `w`/`h`: canvas resolution
- `html`: path to the animation HTML file (relative to project root)
- `duration`: total animation duration in ms
- `animClass`: the class name exposed on `window` in the HTML

## How it works

1. Launches headless Chromium, loads the HTML page
2. Stops the live `requestAnimationFrame` loop
3. Rebuilds animation at export resolution (e.g., 3840×2160 for 2×)
4. Calls `renderFrame(timeMs)` per frame, advancing time manually
5. Screenshots canvas to PNG, stitches into MP4 with ffmpeg (libx264, CRF 18)
6. Cleans up frame PNGs