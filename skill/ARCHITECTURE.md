# Animation Architecture

## Class structure

Each animation is a single class with this shape:

```javascript
class MyAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.duration = 30000; // total duration in ms
        this.startTime = null;
        this.isPlaying = false;
        // Initialize any state: particles, tracking objects, etc.
    }

    // ─── UTILITY METHODS (always include these) ───
    progress(t, s, e) { return t < s ? 0 : t > e ? 1 : (t - s) / (e - s); }
    easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    easeInOut(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }
    lerp(a, b, t) { return a + (b - a) * t; }

    // ─── DRAWING METHODS ───
    // One method per visual element. Each takes position, size, alpha, time.
    drawBackground(time) { /* ... */ }
    drawMyElement(x, y, w, h, alpha, time) { /* ... */ }

    // ─── MAIN LOOP ───
    animate(timestamp) {
        if (!this.isPlaying) return;
        if (!this.startTime) this.startTime = timestamp;
        const t = (timestamp - this.startTime) % this.duration;
        const ctx = this.ctx, w = this.width, h = this.height;
        ctx.clearRect(0, 0, w, h);

        // Draw phases based on time ranges (overlap by 0.5-1s)
        if (t < 5000) { /* Phase 1 */ }
        if (t >= 4000 && t < 12000) { /* Phase 2 */ }

        requestAnimationFrame((ts) => this.animate(ts));
    }

    start() { this.isPlaying = true; this.startTime = null; requestAnimationFrame((ts) => this.animate(ts)); }
    stop() { this.isPlaying = false; }
    restart() { this.startTime = null; if (!this.isPlaying) this.start(); }
}
```

## Phase pattern

Each visual phase MUST follow this fade-in/fade-out pattern:

```javascript
if (t >= PHASE_START && t < PHASE_END) {
    const fadeIn = this.easeOut(this.progress(t, PHASE_START, PHASE_START + 1000));
    const fadeOut = t > FADE_OUT_START
        ? (1 - this.easeOut(this.progress(t, FADE_OUT_START, PHASE_END)))
        : 1;
    const alpha = fadeIn * fadeOut;
    this.drawMyElement(x, y, w, h, alpha, t);
}
```

## Smooth object movement

For objects that move between phases (mascot, floating element), use a lerp tracking system — never hard-jump positions:

```javascript
// In constructor:
this.objTarget = { x: w/2, y: h/2 };
this.objCurrent = { x: w/2, y: h/2 };

// In animate — set target per phase, then lerp every frame:
this.objCurrent.x = this.lerp(this.objCurrent.x, this.objTarget.x, 0.03);
```

Lerp speeds: 0.02–0.04 for gentle drifting, 0.06–0.1 for responsive movement.

## Vertical / multi-format

- For vertical (9:16): panels go full-width and stack, font sizes scale relative to `w` instead of `h`
- Simple layout differences → single class with `isVertical` flag
- Significantly different layouts → subclass that overrides `animate()`, reuses drawing helpers
