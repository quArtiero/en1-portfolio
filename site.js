// site.js — the only JavaScript on this site. Two small, independent parts.

// Part 1 — background depth fallback.
//
// The background "depth" (see theme.css) is normally driven by CSS alone:
// --depth goes from 0 at the top of the page to 1 at the bottom using a
// CSS scroll-driven animation. Browsers that don't support that yet skip
// the CSS rule, so this part does the same job for them. If CSS can handle
// it, this part does nothing at all.

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

// Part 2 — touch the surface (home page only).
//
// A click or tap anywhere in the hero spreads two thin rings from that point
// (the CSS in index.css draws and animates them), and the float dips once
// the ripple has had time to reach it. Pressing Enter on the button does the
// same from the button, so keyboard users get it too. Under reduced motion
// nothing is created.

(function () {
    var home = document.querySelector(".home");
    if (!home) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    var dipTimer = null;

    home.addEventListener("click", function (event) {
        if (reduced.matches || home.querySelectorAll(".tap-ring").length > 8) return;

        var box = home.getBoundingClientRect();
        var x, y;
        if (event.detail === 0 && event.target.getBoundingClientRect) {
            // Keyboard activation: start the rings at the middle of the button.
            var t = event.target.getBoundingClientRect();
            x = t.left + t.width / 2 - box.left;
            y = t.top + t.height / 2 - box.top;
        } else {
            x = event.clientX - box.left;
            y = event.clientY - box.top;
        }

        ["tap-ring", "tap-ring second"].forEach(function (className) {
            var ring = document.createElement("span");
            ring.className = className;
            ring.style.left = x + "px";
            ring.style.top = y + "px";
            ring.addEventListener("animationend", function () { ring.remove(); });
            home.appendChild(ring);
        });

        // The float dips after the ripple travels to it, at about 0.6 px per ms.
        // The drawing's own waterline datum says exactly where the water is.
        var float = home.querySelector(".hero-float");
        var waterline = home.querySelector(".hero-float .float-wl line");
        if (float && waterline && getComputedStyle(float).display !== "none") {
            var f = float.getBoundingClientRect();
            var w = waterline.getBoundingClientRect();
            var distance = Math.hypot(f.left + f.width / 2 - box.left - x, w.top - box.top - y);
            var delay = Math.round(distance / 0.6);
            // Start a fresh dip even if one is still pending or playing.
            clearTimeout(dipTimer);
            home.classList.remove("disturbed");
            void home.offsetWidth;   // lets the browser register the removal, so the animation restarts
            home.style.setProperty("--reach", delay + "ms");
            home.classList.add("disturbed");
            dipTimer = setTimeout(function () { home.classList.remove("disturbed"); }, delay + 450);   // 450 > the 0.4s dip
        }
    });
})();
