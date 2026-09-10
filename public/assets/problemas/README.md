# Assets — Problemas page

Every file below is referenced by path in `src/pages/Problemas.jsx` but doesn't
exist yet — the page currently shows soft colored placeholder shapes instead
(see `PlaceholderImg` in that file: it hides the broken-image icon on error
and leaves a tinted circle/box behind, so nothing looks broken while these
are missing). Drop a real file at each path below and it'll appear in place
of its placeholder automatically — no code changes needed.

Style: match the painted reference sketch you shared (soft, storybook,
warm-lit forest) — not flat/vector. Transparent background (PNG) for
everything except `forest-pattern.png`.

## Panda poses

Same character, five different moments. Keep proportions/markings
consistent across all five so it reads as one recurring mascot:

| File | Pose | Where it's used |
|---|---|---|
| `red-panda-sign.png` | Peeking over the top edge of a wooden sign, just head + front paws visible, curious expression | Corner of the "Archivo de Problemas" header |
| `red-panda-branch.png` | Sitting on a branch, relaxed, maybe tail curled around the branch — this is the "hero" pose, biggest and most visible | Center, above the folder cards |
| `red-panda-2.png` | Peeking out from behind leaves/foliage, only head + one paw showing | Left side, smaller, half-hidden |
| `red-panda-3.png` | Looking down curiously, maybe pointing or reaching toward something below | Right side, smaller |
| *(optional, not yet wired up)* | Sitting with a magnifying glass or holding an open scroll, "studying a problem" | Could replace one of the above if you want a more on-theme pose |

## Everything else

| File | What | Notes |
|---|---|---|
| `forest-pattern.png` | Seamless tileable forest texture (trees/vines/leaves) | **Must tile edge-to-edge** — used as a CSS `background-repeat`, not a single image. Test by placing four copies in a 2×2 grid; seams should be invisible. Suggested size ~440×440px. |
| `wood-sign.png` | Wood plank texture with jagged/rough edges | Covers the whole header banner (`object-fit: cover`), roughly a 3:1 or 4:1 wide rectangle |
| `folder-icon.png` | One rustic hand-drawn folder/scroll icon | Reused for all 3 category cards — `tint` (red/orange/gold) colors the circle behind it per category, so the icon art itself can be neutral/brown |
| `branch.png` | A tree branch, roughly horizontal | Sits behind `red-panda-branch.png` so the panda looks perched on it |
| `record-player.png` | Vintage record player | Small decorative prop near the folder cards |
| `camera.png` | Vintage camera | Same |
| `water-lily.png` | A single lily pad/flower (used twice at different sizes) | Same |
| `flag.png` | Red checkpoint flag on a post | Sits at the end of the dashed path |

## Layout notes

- The dashed "treasure map" path and its sparkle twinkles are still plain
  SVG/CSS (not images) — no asset needed there.
- All of the above except `forest-pattern.png` and `wood-sign.png` only
  render on screens ≥1024px wide (`lg:` breakpoint) — on phones/tablets
  they're hidden entirely rather than cramped in, since the filter sidebar
  needs the space more there.
