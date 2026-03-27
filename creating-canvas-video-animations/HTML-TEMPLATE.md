# HTML Template

Use this template as-is. Adapt the font paths and animation class name per project.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animation Title</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
        }
        #canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="canvas" width="1920" height="1080"></canvas>

    <script src="js/animation.js"></script>
    <script>
        // Load custom fonts before starting (if any)
        const fontBold = new FontFace('MyFont', 'url(fonts/Bold.otf)', { weight: '700' });
        const fontLight = new FontFace('MyFont', 'url(fonts/Light.otf)', { weight: '300' });
        Promise.all([fontBold.load(), fontLight.load()]).then(fonts => {
            fonts.forEach(f => document.fonts.add(f));
            const canvas = document.getElementById('canvas');
            const animation = new MyAnimation(canvas);
            animation.start();
            window.animation = animation; // Required for export script
            document.addEventListener('keydown', e => {
                if (e.key === 'r') animation.restart();
                if (e.key === ' ') { e.preventDefault(); animation.isPlaying ? animation.stop() : animation.start(); }
            });
        });
    </script>
</body>
</html>
```

## Key points

- Canvas dimensions set in HTML attributes (not CSS) — this is the actual pixel resolution
- MUST expose `window.animation` — the export script depends on it
- For vertical: change canvas to `width="1080" height="1920"`
- If no custom fonts, skip the FontFace loading and start immediately

## Keyboard shortcuts

- `Space` — play/pause
- `R` — restart
- `F` — toggle face cam zone overlay (if applicable)