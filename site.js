// site.js — the only JavaScript on this site.
//
// The background "depth" (see theme.css) is normally driven by CSS alone:
// --depth goes from 0 at the top of the page to 1 at the bottom using a
// CSS scroll-driven animation. Browsers that don't support that yet skip
// the CSS rule, so this small script does the same job for them.
// If CSS can handle it, this script does nothing at all.

(function () {
    if (window.CSS && CSS.supports("animation-timeline: scroll()")) return;

    var root = document.documentElement;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    var waiting = false;

    function update() {
        waiting = false;
        if (reduced.matches) {
            // Reduced motion: leave --depth to the CSS, which holds the page at mid-depth.
            root.style.removeProperty("--depth");
            return;
        }
        var scrollable = root.scrollHeight - window.innerHeight;
        var depth = scrollable > 0 ? window.scrollY / scrollable : 0;
        root.style.setProperty("--depth", Math.min(1, Math.max(0, depth)));
    }

    // Only recalculate once per animation frame, however often scroll fires.
    function onScroll() {
        if (!waiting) {
            waiting = true;
            window.requestAnimationFrame(update);
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", onScroll);   // react if the OS setting changes
    update();
})();
