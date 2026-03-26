# Common Visual Elements

## Contents
- Redrawing from image references
- Glow text (titles)
- Fade-in text (body)
- Glitch text (optional)
- Step labels
- Window chrome
- Code editor
- Terminal / CLI output
- Panels / cards
- Background patterns
- Rotating / cycling content

## Redrawing from image references

When the user provides screenshots or reference images, redraw them as canvas primitives — do not embed images. This keeps the animation resolution-independent and stylistically consistent.

1. Study the reference for layout, proportions, and key visual elements
2. Identify structural components (window frames, panels, text areas, icons)
3. Recreate using canvas paths, shapes, gradients, and text
4. Apply the animation's color palette — the reference informs *what* to draw, the theme controls *how*
5. Simplify details that won't read at video resolution

Common reference types and how to redraw:
- **IDE/editor** → window chrome + code area with syntax coloring
- **Terminal** → terminal panel with styled text output
- **App UI** → layout grid, key buttons/labels, color relationships
- **Logos/icons** → simplified canvas paths
- **Characters/mascots** → bezier paths (trace from SVG if available)

Always ask: "Can you paste a screenshot or reference image of what you'd like this to look like?"

## Glow text (titles)

Text with `shadowBlur` for a neon/holographic look. Draw text twice: once with shadow for glow, once without for sharpness on top.

## Fade-in text (body)

Simple `globalAlpha` fade using `easeOut(progress(t, start, start + 800))`. Default entrance for all body text.

## Glitch text (optional)

Characters scramble through random glyphs before resolving left-to-right. Use only when user requests glitch/retro/cyberpunk aesthetic. Optional color fringe (offset red/blue copies) while scrambling.

## Step labels

Pill-shaped badge at top center of canvas. Measure text width, draw `roundRect` behind it with subtle border and semi-transparent fill.

## Window chrome

macOS-style window frame: title bar with three traffic light dots (`#ff5f57`, `#ffbd2e`, `#28c840`), optional tab bar, optional status bar. Title bar height is about 5% of panel height.

## Code editor

Syntax-highlighted code with:
- Line numbers in gutter (dim, right-aligned)
- Keywords in accent color, rest in light gray
- Typing effect: reveal lines over time (`elapsed / typingSpeed`)
- Blinking cursor on last visible line

## Terminal / CLI output

Color conventions:
- Green: prompt character (`>`)
- Purple: slash commands (`/model`, `/chat`)
- White: arguments
- Cyan: success messages
- Amber: warnings
- Dim gray: status text
- Typing effect for commands, instant reveal for responses

## Panels / cards

Rounded rectangle containers: `shadowBlur` for depth, dark fill (`#1a1a2e`), subtle accent border (`rgba(139,92,246,0.2)`), corner radius around 10px.

## Background patterns

- **Tron grid**: perspective lines converging to vanish point with horizontal scan lines
- **Particles**: small floating dots with subtle pulse, initialized in constructor, updated each frame
- **Radial gradient**: dark center fading to darker edges

## Rotating / cycling content

Cycle through text values at a position with smooth crossfade. Use `Math.sin(phase * Math.PI)` for a bell-curve alpha per item. Typical cycle: 1-2s per item.
