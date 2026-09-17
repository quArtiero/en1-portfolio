# Spline scene brief — the hero float

The home page hero currently shows a fishing float drawn as an inline SVG
(`index.html`, the `.hero-float` block). This brief describes the 3D scene
that can replace it, built by you in the Spline editor. Until a scene
exists, the SVG stays and nothing is downloaded from Spline.

## What the scene is

A single fishing float resting at the water's surface, seen from slightly
above, with its line rising out of frame and a couple of ripple rings
around it. Quiet, small, one object of interest. **No water, no sky, no
background** — the page's own CSS gradient is the water, so the scene's
background must be transparent.

## Objects (use these exact names)

| Name      | What it is                                                     |
|-----------|----------------------------------------------------------------|
| `Float`   | The float: a slim body with a thin antenna on top.             |
| `Line`    | A thin line from the top of `Float` straight up, out of frame. |
| `Ripples` | Two flat rings on the water plane, centered on `Float`.        |

## Camera

Slightly above the waterline, looking down at about 20°, the float centered
and the line leaving through the top edge. Narrow field of view (or
orthographic) so the float does not look wide-angle. Frame it tall, roughly
1 : 2 (width : height), matching the SVG's `viewBox="0 0 240 520"`.

## Colors (from `theme.css`)

| Part                     | Token             | Hex       |
|--------------------------|-------------------|-----------|
| Float antenna and top    | `--float`         | `#F0492E` |
| Float body below the top | `--fog`           | `#E6EFEC` |
| Line                     | `--mist`          | `#9DB4B5` |
| Ripples                  | `--fog` at ~30 %  | `#E6EFEC` |
| Background               | transparent       | —         |

Matte materials, no glossy reflections, no shadows on the (absent) ground.

## States and events to author in Spline

1. **Idle bob** — a loop: `Float` (and `Line` with it) drift up and down
   about 4 px on screen over ~3.6 s, ease in and out. `Ripples` slowly
   scale up ~25 % while fading out, then restart; offset the two rings by
   half a cycle.
2. **Dip** — on `Mouse Down` on `Float`: dip about 12 px down and return
   over 0.4 s.
3. **Look** — a subtle `Mouse Hover` / cursor-follow on `Float` (a few
   degrees of tilt), so it feels alive without being a toy.

Keep it under **2 MB** total. If the file grows past that, simplify
geometry before anything else.

## Export and embed

This site is plain HTML/CSS with no build step, so the scene goes in as an
`<iframe>` (the same way YouTube videos are embedded on project pages):

1. In Spline: **Export → Viewer** (public link). Copy the URL, which looks
   like `https://my.spline.design/…/`.
2. In `index.html`, inside `<div class="hero-float" aria-hidden="true">`,
   replace the `<svg>…</svg>` with:

   ```html
   <iframe src="PASTE THE SPLINE URL HERE" title="Fishing float" loading="lazy"></iframe>
   ```

3. In `index.css`, next to `.hero-float svg { … }`, add the same sizing for
   the iframe: `.hero-float iframe { width: 100%; height: 100%; border: 0; }`.

Two things carry over automatically: the drawing is only shown at 900 px
and wider (phones keep the lighter page), and it is marked decorative for
screen readers. Two things do not: the CSS "dip on button hover" only works
for the SVG, so author the dip inside Spline (state 2 above), and the
`prefers-reduced-motion` switch cannot reach inside the iframe, so keep
the idle loop gentle.

If you would rather not add a 3D scene, the SVG float is a finished
design in its own right — leave it as is.
