# Timeline Planning

## Structure

Break the animation into phases. Each phase has:
- **Start/end time** in milliseconds
- **Content**: what appears on screen
- **Transitions**: how it enters and exits

## Planning process

1. List the key beats (what the viewer should see/understand at each moment)
2. Assign rough durations — most phases need 3–6s to read and absorb
3. Add 0.5–1s overlap between adjacent phases for smooth handoffs
4. Title/intro: 2–4s
5. Main content phases: 4–8s each
6. Closing/CTA: 3–5s

## Example timeline (30s)

```
0-3s     Title — text resolves, subtitle fades in
3-12s    Main content A — panel slides in, content animates
12-15s   Transition element — brief interstitial
15-24s   Main content B — second panel, different content
24-28s   Summary/payoff — key message with visual emphasis
28-30s   CTA/closing — final text, hold
```

## Avoiding dead space

The most common issue is gaps where only the background is visible. Prevent by:
- Overlapping phase transitions (one fading out while next fades in)
- Having persistent elements (floating mascot, background particles) that fill visual space
- Checking the timeline math: if Phase A ends at 12s and Phase B starts at 15s, that's a 3s gap — fix it

## Duration guidelines

| Element | Duration |
|---------|----------|
| Title text | 2–3s to read, fade-out 0.5s before next phase |
| Code typing | ~300–400ms per line |
| UI panels | 1s fade-in, 3–6s hold, 1s fade-out |
| Step labels | Change every 3–5s |
| Closing text | Hold 3–5s minimum |
| Rotating content | 1–2s per item with crossfade |