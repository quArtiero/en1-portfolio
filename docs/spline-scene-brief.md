# Spline scene brief — the hero float

The home page hero currently shows a fishing float drawn as an inline SVG
(`index.html`, the `.hero-float` block). This brief describes the 3D scene
that can replace it, built by you in the Spline editor. Until a scene
exists, the SVG stays and nothing is downloaded from Spline.

Know the trade-off before you start: embedding the scene adds a third-party
service to the page (the only one besides Google Fonts) and an idle
animation that the site's reduce-motion switch cannot stop. The SVG float
has neither problem. This is optional — do it only if you want it.

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
low in the frame and the line leaving through the top edge. Narrow field of
view (or orthographic) so the float does not look wide-angle. Frame it tall,
about 1 : 3 (width : height), like the SVG's `viewBox="0 0 240 700"`; the
box it fills on the page is between 1 : 2.5 and 1 : 3.5 depending on the
window, so keep the important part in the middle.

## Colors (from `theme.css`)

| Part                        | Token                                   | Hex                       |
|-----------------------------|-----------------------------------------|---------------------------|
| Float antenna and top       | `--float`                               | `#F0492E`                 |
| Float body below the water  | `--fog` tinted ~55 % with `--surface-water` | `#E6EFEC` over `#12394A` |
| Line                        | `--mist`                                | `#9DB4B5`                 |
| Ripples                     | `--fog` at ~30 %                        | `#E6EFEC`                 |
| Background                  | transparent                             | —                         |

Matte materials, no glossy reflections, no shadows on the (absent) ground.

## States to author in Spline

1. **Idle bob** — a loop: `Float` (and `Line` with it) drift up and down
   about 4 px on screen over ~3.6 s, ease in and out. `Ripples` slowly
   scale up ~25 % while fading out, then restart; offset the two rings by
   half a cycle. Keep it gentle: the page cannot switch this off for people
   who have "reduce motion" turned on.
2. **Dip** — on `Mouse Down` on `Float`: dip about 12 px down and return
   over 0.4 s.
3. **Look** — a subtle `Mouse Hover` on `Float` (a few degrees of tilt).

States 2 and 3 need the mouse to reach the scene; step 3 of the embed
below turns that on. In **Play Settings**, turn *off* Orbit, Pan and Zoom
and turn *on* page scrolling, or the scene will swallow the mouse wheel
when the pointer is over it. If you would rather keep the scene purely
decorative, skip states 2–3 and skip the `pointer-events` line in step 3.

Keep it under **2 MB** total. If the file grows past that, simplify
geometry before anything else. On the free Spline plan a small
"Built with Spline" badge shows in the corner of the embed.

## Export and embed

This site is plain HTML/CSS with no build step, so the scene goes in as an
`<iframe>`, the same way the template's optional video block embeds a
YouTube video:

1. In Spline: **Export → Public URL**. Wait for the link to generate, then
   copy the **Public URL** (not the Embed code). It looks like
   `https://my.spline.design/…/`.
2. In `index.html`, inside `<div class="hero-float" aria-hidden="true">`,
   replace the `<svg>…</svg>` with:

   ```html
   <iframe src="PASTE THE SPLINE URL HERE" title="Fishing float" loading="lazy" tabindex="-1"></iframe>
   ```

   (`tabindex="-1"` keeps the Tab key from wandering into the scene.)

3. In `index.css`, next to `.hero-float svg { … }`, add:

   ```css
   .hero-float iframe { width: 100%; height: 100%; border: 0; pointer-events: auto; }
   ```

   `pointer-events: auto` lets the mouse reach the scene for states 2–3
   (the drawing's box does not overlap the text, so nothing else is
   affected). Leave that line out for a decorative-only scene.

What carries over from the SVG: the drawing is only shown at 900 px and
wider, and it is marked decorative for screen readers. What does not: the
dip on button hover or tap, the hover-in dimension lines, and the first-paint
rise all only work for the SVG (author the dip inside Spline instead); the
tap ripples on the page itself still work; and the page's reduced-motion
switch cannot reach inside the iframe. On phones the block is hidden, but the browser may still fetch
the scene, which is one more reason to keep it small.

If you would rather not add a 3D scene, the SVG float is a finished
design in its own right — leave it as is.
