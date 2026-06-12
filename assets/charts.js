/* ============================================================
   GROUP 6 · shared chart + interaction helpers
   - Animates .hbar-fill / .col-fill / .donut-seg when scrolled into view
   - Floating tooltip for any element with [data-tip]
   - .reveal elements fade in on scroll
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Scroll-triggered animation ---------- */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  document.querySelectorAll(".chart-animate, .reveal").forEach(function (el) {
    observer.observe(el);
  });

  /* ---------- Tooltip ---------- */
  var tip = document.createElement("div");
  tip.className = "g6-tooltip";
  tip.setAttribute("role", "status");
  document.body.appendChild(tip);

  var tipVisible = false;

  function moveTip(e) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = tip.getBoundingClientRect();
    var left = x + 14;
    var top = y - rect.height - 10;
    if (left + rect.width > window.innerWidth - 8) left = x - rect.width - 14;
    if (top < 8) top = y + 18;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }

  document.addEventListener("mouseover", function (e) {
    var t = e.target.closest("[data-tip]");
    if (t) {
      tip.textContent = t.getAttribute("data-tip");
      tip.classList.add("show");
      tipVisible = true;
      moveTip(e);
    } else if (tipVisible) {
      tip.classList.remove("show");
      tipVisible = false;
    }
  });

  document.addEventListener("mousemove", function (e) {
    if (tipVisible) moveTip(e);
  });

  document.addEventListener("scroll", function () {
    if (tipVisible) {
      tip.classList.remove("show");
      tipVisible = false;
    }
  }, { passive: true });

  /* ---------- Nav active-section highlighting ---------- */
  var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (navLinks.length) {
    var sections = [];
    navLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ el: el, link: a });
    });
    var secObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove("active"); });
            var match = sections.find(function (s) { return s.el === entry.target; });
            if (match) match.link.classList.add("active");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach(function (s) { secObserver.observe(s.el); });
  }
})();
