#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── ADAPT THIS BLOCK PER PROJECT ──
const FORMATS = {
    horizontal: { w: 1920, h: 1080, html: 'animation.html', duration: 30000, animClass: 'MyAnimation' },
    vertical:   { w: 1080, h: 1920, html: 'animation-vertical.html', duration: 30000, animClass: 'MyVerticalAnimation' },
};

const FORMAT = process.argv[2] || 'horizontal';
const FPS = 60;
const SCALE = 2; // 2x = 3840x2160 for 1080p source. Use 4 for max quality.

const fmt = FORMATS[FORMAT];
if (!fmt) { console.error(`Unknown format: ${FORMAT}. Use: ${Object.keys(FORMATS).join(', ')}`); process.exit(1); }

const TOTAL_FRAMES = FPS * (fmt.duration / 1000);
const OUT_W = fmt.w * SCALE, OUT_H = fmt.h * SCALE;
const FRAMES_DIR = path.join(__dirname, '..', `frames_${FORMAT}`);
const OUTPUT_FILE = path.join(__dirname, '..', `output_${FORMAT}_${SCALE}x.mp4`);

async function main() {
    if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
    fs.mkdirSync(FRAMES_DIR);

    console.log(`Exporting ${FORMAT} at ${OUT_W}x${OUT_H}, ${FPS}fps, ${fmt.duration/1000}s`);

    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: OUT_W, height: OUT_H, deviceScaleFactor: 1 });

    const htmlPath = path.join(__dirname, '..', fmt.html);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.waitForFunction('window.animation && window.animation.isPlaying');
    await page.evaluate(() => window.animation.stop());

    await page.evaluate((w, h, animClass) => {
        const canvas = document.getElementById('canvas');
        canvas.width = w; canvas.height = h;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        const anim = new window[animClass](canvas);
        window.exportAnim = anim;
        window.renderFrame = function(timeMs) {
            const origRAF = window.requestAnimationFrame;
            window.requestAnimationFrame = function() {};
            const a = window.exportAnim;
            a.isPlaying = true;
            a.startTime = 100000;
            a.animate(100000 + timeMs);
            a.isPlaying = false;
            window.requestAnimationFrame = origRAF;
        };
    }, OUT_W, OUT_H, fmt.animClass);

    await new Promise(r => setTimeout(r, 500));

    for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
        await page.evaluate((t) => window.renderFrame(t), (frame / FPS) * 1000);
        const canvasHandle = await page.$('#canvas');
        await canvasHandle.screenshot({
            path: path.join(FRAMES_DIR, `frame_${String(frame).padStart(5, '0')}.png`),
            type: 'png'
        });
        if (frame % 60 === 0) {
            const pct = ((frame / TOTAL_FRAMES) * 100).toFixed(1);
            console.log(`  Frame ${frame}/${TOTAL_FRAMES} (${pct}%)`);
        }
    }

    await browser.close();

    console.log('Encoding MP4...');
    execSync([
        'ffmpeg', '-y',
        '-framerate', String(FPS),
        '-i', path.join(FRAMES_DIR, 'frame_%05d.png'),
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
        '-pix_fmt', 'yuv420p',
        OUTPUT_FILE
    ].join(' '), { stdio: 'inherit' });

    fs.rmSync(FRAMES_DIR, { recursive: true });
    console.log(`Done: ${OUTPUT_FILE}`);
}

main().catch(err => { console.error(err); process.exit(1); });