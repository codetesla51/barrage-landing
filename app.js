/* barrage landing — small, dependency-free */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- github stars ---------- */
  function fmtStars(n) {
    return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
  }
  function setStars(el, n) {
    el.querySelector(".stars-n").textContent = fmtStars(n);
  }
  function loadStars() {
    var el = document.getElementById("gh-stars");
    if (!el) return;
    try {
      var cached = JSON.parse(localStorage.getItem("barrage-stars") || "null");
      if (cached && Date.now() - cached.t < 3600e3) setStars(el, cached.c);
    } catch (e) { /* ignore */ }
    fetch("https://api.github.com/repos/codetesla51/barrage")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) {
        setStars(el, j.stargazers_count);
        try { localStorage.setItem("barrage-stars", JSON.stringify({ c: j.stargazers_count, t: Date.now() })); } catch (e) { /* ignore */ }
      })
      .catch(function () {
        var n = el.querySelector(".stars-n");
        if (n.textContent === "…") n.textContent = "";
      });
  }

  /* ---------- copy buttons on every terminal window ---------- */
  function initCopyButtons() {
    document.querySelectorAll(".term").forEach(function (term) {
      var bar = term.querySelector(".term-bar");
      var pre = term.querySelector("pre");
      if (!bar || !pre || bar.querySelector(".term-copy")) return;
      var btn = document.createElement("button");
      btn.className = "term-copy";
      btn.type = "button";
      btn.setAttribute("aria-label", "Copy to clipboard");
      btn.innerHTML = '<i class="ph ph-copy" aria-hidden="true"></i>';
      btn.addEventListener("click", function () {
        var text = pre.innerText.replace(/\n$/, "");
        function done() {
          btn.innerHTML = '<i class="ph ph-check" aria-hidden="true"></i>';
          btn.classList.add("ok");
          setTimeout(function () {
            btn.innerHTML = '<i class="ph ph-copy" aria-hidden="true"></i>';
            btn.classList.remove("ok");
          }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); } catch (e) { /* ignore */ }
          document.body.removeChild(ta);
          done();
        }
      });
      bar.appendChild(btn);
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- simulated barrage run ---------- */
  var SIM_HEADER = [
    "$ barrage run -c config.yaml",
    "",
    "barrage v0.3.5",
    "duration 15s · bucket 1s · concurrency 10 · ramp 3s",
    "rates    http 10/s · db 5/s · redis 20/s",
    ""
  ];
  var SIM_PATHS = ["GET /todos", "POST /orders", "GET /me", "GET /products"];
  var SIM_Q = [
    ["read", "count(*)"],
    ["read", "orders LIMIT 10"],
    ["write", "INSERT orders"]
  ];
  var SIM_R = ["PING", "GET sess:*", "INCR hits"];

  function pad(s, n) { s = String(s); while (s.length < n) s = "0" + s; return s; }
  function padEnd(s, n) { s = String(s); while (s.length < n) s += " "; return s; }

  function simLine(sec, kind, detail, lat, cls) {
    var t = "[" + pad(Math.floor(sec / 60), 2) + ":" + pad(sec % 60, 2) + "]";
    var k = '<span class="ln-k ln-k-' + kind.toLowerCase() + '">' + padEnd(kind.toUpperCase(), 5) + "</span>";
    return '<span class="ln-t">' + t + "</span> " +
      k + " " +
      detail + "  " +
      (cls === "spike" ? '<span class="ln-spike">' + lat + " ▲</span>"
                       : '<span class="ln-ok">' + lat + "</span>");
  }

  function randomLine(sec) {
    var roll = Math.random();
    if (roll < 0.45) {
      return simLine(sec, "http", SIM_PATHS[Math.floor(Math.random() * SIM_PATHS.length)],
        (0.4 + Math.random() * 4).toFixed(2) + "ms", "");
    }
    if (roll < 0.75) {
      var q = SIM_Q[Math.floor(Math.random() * SIM_Q.length)];
      var slow = Math.random() < 0.18;
      return simLine(sec, "db", q[0] + " " + q[1],
        (slow ? 80 + Math.random() * 60 : 2 + Math.random() * 20).toFixed(1) + "ms",
        slow ? "spike" : "");
    }
    return simLine(sec, "redis", SIM_R[Math.floor(Math.random() * SIM_R.length)],
      (0.2 + Math.random() * 3).toFixed(2) + "ms", "");
  }

  function initSim() {
    var code = document.getElementById("sim-code");
    var box = document.getElementById("sim-box");
    if (!code || !box) return;

    var sec = 0, i = 0, timer = null, running = false;
    var MAXLINES = 16, TOTAL = 26;

    function render(lines, withCaret) {
      // keep the last MAXLINES lines visible, like a real terminal scrolling
      var body = lines.slice(-MAXLINES).join("\n");
      code.innerHTML = withCaret ? body + '\n<span class="caret"></span>' : body;
    }

    function tick() {
      i++; sec++;
      if (i > TOTAL) {
        stop();
        render(SIM_HEADER.concat(
          ['<span class="ln-dim">… run complete — report.html written</span>',
           '<span class="ln-dim">$ </span><span class="caret"></span>']));
        setTimeout(start, 5000); // loop
        return;
      }
      lines.push(randomLine(sec));
      render(lines, true);
      schedule();
    }
    var lines = [];
    function schedule() {
      timer = setTimeout(tick, 260 + Math.random() * 340);
    }
    function start() {
      if (running) return;
      running = true;
      lines = SIM_HEADER.slice();
      sec = 0; i = 0;
      render(lines);
      schedule();
    }
    function stop() {
      running = false;
      if (timer) { clearTimeout(timer); timer = null; }
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      // static transcript: header + a handful of representative lines
      var stat = SIM_HEADER.slice();
      for (var j = 1; j <= 10; j++) stat.push(randomLine(j));
      render(stat);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
    }, { threshold: 0.3 });
    io.observe(box);
  }

  /* ---------- mobile menu ---------- */
  function initNav() {
    var btn = document.getElementById("nav-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;
    function close() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      btn.querySelector("i").className = "ph ph-list text-xl leading-none";
    }
    btn.addEventListener("click", function () {
      var open = !menu.hidden;
      menu.hidden = open;
      btn.setAttribute("aria-expanded", String(!open));
      btn.querySelector("i").className = open ? "ph ph-list text-xl leading-none" : "ph ph-x text-xl leading-none";
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) close();
    });

    // scroll spy: highlight the section currently on screen
    var links = document.querySelectorAll("#desk-nav .nav-link");
    if (!("IntersectionObserver" in window) || !links.length) return;
    var map = {};
    links.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute("href"));
      if (sec) map[sec.id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove("active"); });
          map[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    loadStars();
    initCopyButtons();
    initReveal();
    initSim();
    initNav();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
