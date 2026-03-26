# Canvas Video Animation Skill

Agent skill for creating animated videos using HTML5 Canvas and JavaScript, exportable to MP4.

## Install

### [npx skills](https://github.com/vercel-labs/skills) (any agent)

```bash
npx skills add siegerts/skill-canvas-video
```

Install globally (available across all projects):

```bash
npx skills add siegerts/skill-canvas-video -g
```

Target a specific agent:

```bash
npx skills add siegerts/skill-canvas-video -a claude-code
npx skills add siegerts/skill-canvas-video -a codex
```

### Claude Code

```bash
git clone https://github.com/siegerts/skill-canvas-video.git ~/.claude/skills/skill-canvas-video
```

### Kiro

Copy the `skill/` folder into `.kiro/skills/` in your workspace:

```
.kiro/skills/canvas-video/
├── SKILL.md
├── ARCHITECTURE.md
├── ...
└── scripts/
    └── export.js
```

### Manual

Clone the repo and point your agent's skill directory to the `skill/` folder. The agent needs filesystem access to read the markdown files and execute `scripts/export.js`.

## Usage

Once installed, ask your agent to create an animation. Examples:

- "Create a 30-second animated promo video for my CLI tool"
- "Make a TikTok animation showing how our API works"
- "Build a vertical motion graphic with code typing and terminal output"

The agent will follow the workflow in `SKILL.md` — it will ask you about format, duration, style, and content before generating anything.

### Previewing

Open the generated `animation.html` in a browser. Keyboard shortcuts:

- `Space` — play/pause
- `R` — restart

### Exporting

When you're happy with the animation, run the export script yourself:

```bash
node scripts/export.js horizontal
node scripts/export.js vertical
```

The agent will not auto-run export — it provides the command and lets you decide when.

## How it works

The agent follows a structured workflow defined in `skill/SKILL.md`:

1. Clarifies format, duration, style, and content with the user
2. Plans a timeline broken into phases with start/end times
3. Gathers visual references (screenshots, mockups) and redraws them as canvas primitives
4. Builds a single self-contained JS class that renders frame-by-frame on a `<canvas>` element
5. Wraps it in a minimal HTML host page with font loading and keyboard controls
6. Validates in-browser: checks for dead space, smooth transitions, safe zone compliance
7. Iterates until the user is satisfied
8. Hands the user an export command (does not auto-run — export is slow)

## Output

- A self-contained HTML file with a canvas animation (runs in any browser)
- A JavaScript animation class (one class per animation)
- A configured copy of the bundled export script

## Technical constraints

The skill enforces these rules on all generated animations:

- Canvas 2D API only — no DOM animation, no CSS animation, no WebGL
- Time-based animation keyed to elapsed milliseconds, not frame count
- All movement and opacity changes use lerp/easing — nothing pops or jumps
- Phase transitions overlap by 0.5–1s — no gaps
- Every class includes `progress()`, `easeOut()`, `easeInOut()`, `lerp()` utilities

## Supported platforms

The skill includes dimension and safe zone data for:

| Platform | Formats |
|----------|---------|
| YouTube | 16:9, 9:16 (Shorts) |
| Instagram | 9:16 (Reels), 1:1 (Feed), 4:5 (Feed portrait) |
| TikTok | 9:16 |
| X (Twitter) | 16:9, 4:5 |
| LinkedIn | 16:9, 4:5 |

Default when unspecified: 1920×1080 (16:9). Default when "social" is mentioned: 1080×1920 (9:16).

## Defaults

| Setting | Value |
|---------|-------|
| Resolution | 1920×1080 |
| Duration | 30 seconds |
| FPS | 60 |
| Background | Dark radial gradient (`#0a0a1a` → `#000005`) |
| Accent colors | Purple `#8b5cf6`, cyan `#64c8ff` |
| Export scale | 2× |
| Easing | Cubic ease-out (entrances), cubic ease-in-out (transitions) |

## Export

The export script is bundled at `skill/scripts/export.js`. It renders each frame via headless Chromium (Puppeteer), screenshots the canvas to PNG, then stitches frames into MP4 with FFmpeg (libx264, CRF 18, slow preset).

Requirements:
- Node.js
- Puppeteer (`npm install puppeteer`)
- FFmpeg on PATH

Usage:
```bash
node scripts/export.js horizontal
node scripts/export.js vertical
```

## Skill contents

```
skill/
├── SKILL.md               # Entry point — workflow, defaults, principles
├── ARCHITECTURE.md         # Animation class structure and phase patterns
├── TIMELINE.md             # Phase planning and duration guidelines
├── HTML-TEMPLATE.md        # Host page template and font loading
├── EXPORT.md               # Export instructions and configuration
├── ELEMENTS.md             # Reusable drawing patterns (text, panels, chrome, terminals)
├── PLATFORMS.md            # Platform dimensions and safe zones
└── scripts/
    └── export.js           # Puppeteer + FFmpeg export script
```