# Common Visual Elements

Reusable drawing patterns for canvas animations. Each is a method on the animation class.

## Redrawing from image references

When the user provides screenshots or reference images, redraw them as canvas primitives rather than embedding the images. This keeps the animation resolution-independent and stylistically consistent.

Approach:
1. Study the reference image for layout, proportions, and key visual elements
2. Identify the structural components (window frames, panels, text areas, icons)
3. Recreate each component using canvas paths, shapes, gradients, and text
4. Apply the animation's color palette and style — the reference informs *what* to draw, the theme controls *how* it looks
5. Simplify details that won't read at video resolution — focus on recognizable structure over pixel-perfect reproduction

Common reference types:
- **IDE/editor screenshots** → redraw as window chrome + code area with syntax coloring
- **Terminal screenshots** → redraw as terminal panel with styled text output
- **App UI** → extract the layout grid, key buttons/labels, and color relationships
- **Logos/icons** → redraw as simplified canvas paths matching the animation's style
- **Characters/mascots** → redraw using bezier paths, can be traced from SVG source if available

Always ask the user: "Can you paste a screenshot or reference image of what you'd like this to look like?" This dramatically improves accuracy and saves iteration cycles.

## Glow text (default for titles)

Text with canvas shadowBlur for a neon/holographic look.

```javascript
drawGlowText(text, x, y, fontSize, alpha, color, glowColor) {
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.font = `700 ${fontSize}px "MyFont", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowBlur = 20; ctx.shadowColor = glowColor;
    ctx.fillStyle = color; ctx.fillText(text, x, y);
    ctx.shadowBlur = 0; ctx.fillText(text, x, y); // sharp pass on top
    ctx.restore();
}
```

## Fade-in text (default for body text)

Simple opacity-based entrance. Combine with `easeOut` for smooth reveal.

```javascript
const alpha = this.easeOut(this.progress(t, startTime, startTime + 800));
ctx.save(); ctx.globalAlpha = alpha;
ctx.font = `300 ${fontSize}px "MyFont", sans-serif`;
ctx.fillStyle = '#FFFFFF';
ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
ctx.fillText(text, x, y);
ctx.restore();
```

## Glitch text (optional effect)

Characters scramble through random glyphs before resolving to final text. Use only when the user requests a glitch/retro/cyberpunk aesthetic.

```javascript
drawGlitchText(text, x, y, fontSize, progress, time) {
    // progress: 0-1, how resolved the text is
    // Characters resolve left-to-right as progress increases
    // Add subtle horizontal offset that decreases with progress
    // Optional: color fringe (offset red/blue copies) while scrambling
}
```

## Step label

A pill-shaped badge at the top of the screen showing the current step.

```javascript
drawStepLabel(text, alpha, time) {
    // Measure text, draw rounded rect pill behind it
    // Subtle border, semi-transparent fill
    // Position at top center of canvas
}
```

## Window chrome

macOS-style window frame with traffic light dots, tab bar, and status bar.

```javascript
// Title bar with dots
const tbH = h * 0.05;
ctx.fillStyle = '#2a2a3e'; ctx.fillRect(x, y, w, tbH);
const dotR = tbH * 0.15, dotGap = dotR * 2.8;
[['#ff5f57',0],['#ffbd2e',1],['#28c840',2]].forEach(([c,i]) => {
    ctx.fillStyle = c; ctx.beginPath();
    ctx.arc(x + dotR*2.5 + i*dotGap, y + tbH/2, dotR, 0, Math.PI*2); ctx.fill();
});
```

## Code editor

Syntax-highlighted code with line numbers and typing animation.

- Line numbers in gutter (dim color, right-aligned)
- Keywords in accent color (purple), rest in light gray
- Typing effect: reveal lines over time using `elapsed / typingSpeed`
- Blinking cursor on the last visible line

## Terminal / CLI output

Terminal content with prompt, typed commands, and streaming responses.

- Green prompt character (`>`)
- Purple for slash commands (`/model`, `/chat`)
- White for arguments
- Cyan for success messages (`✓`)
- Amber for warnings (`⚠`)
- Dim gray for status text
- Typing effect for commands, instant reveal for responses

## Integrated terminal panel

Terminal panel inside an IDE window (like VS Code's integrated terminal).

- Tab bar with PROBLEMS | OUTPUT | DEBUG CONSOLE | TERMINAL tabs
- Active tab has underline indicator
- Terminal content area below the tab bar
- Can include ASCII art splash, welcome text, then CLI commands

## Panels / cards

Rounded rectangle containers for content groupings.

```javascript
// Shadow + background + border
ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(0,0,0,0.5)';
ctx.beginPath(); ctx.roundRect(x, y, w, h, 10);
ctx.fillStyle = '#1a1a2e'; ctx.fill();
ctx.shadowBlur = 0;
ctx.strokeStyle = 'rgba(139,92,246,0.2)'; ctx.lineWidth = 1;
ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.stroke();
```

## Background patterns

### Tron grid
Perspective grid lines converging to a vanish point, with horizontal scan lines.

### Particles
Small floating dots with subtle pulse animation. Initialize in constructor, update position each frame.

### Radial gradient
Dark center fading to darker edges for depth.

## Rotating / cycling content

Show different text values cycling through a position with smooth crossfade:

```javascript
const items = ['Item A', 'Item B', 'Item C'];
const cycleDur = 1000; // ms per item
const cycleT = Math.max(0, t - startTime);
const idx = Math.floor(cycleT / cycleDur) % items.length;
const phase = (cycleT % cycleDur) / cycleDur;
const alpha = Math.sin(phase * Math.PI); // smooth bell curve fade
const item = items[idx];
// Draw item at alpha
```
