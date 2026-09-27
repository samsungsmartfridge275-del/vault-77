/* ==========================================================================
   THE TELL — additive fun layer (Byte's reactions, confetti, 3D badge)
   Loaded after app.js. Never modifies app.js state or logic — only reads
   the DOM it produces and the same localStorage key it already writes to.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STORAGE_KEY = "thetell.ctf.v3"; /* must match app.js STORAGE_KEY */

  /* ============ pause the ambient sign-in video once inside the platform ============
     CSS already fades/hides it via :has(); this just stops it decoding in the
     background too. An additive listener alongside app.js's own — never replaces it. */
  var gateBgVideo = document.getElementById("gateBgVideo");
  var enterBtn = document.getElementById("enterBtn");
  if (gateBgVideo && enterBtn) {
    enterBtn.addEventListener("click", function () {
      setTimeout(function () {
        try { gateBgVideo.pause(); } catch (e) {}
      }, 700);
    });
  }
  if (gateBgVideo && reduceMotion) {
    try { gateBgVideo.pause(); } catch (e) {}
  }

  /* ============ confetti burst (plain canvas, no deps) ============ */
  var confettiCanvas = document.getElementById("confettiCanvas");
  var confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
  var confettiParticles = [];
  var confettiRunning = false;
  var CONFETTI_COLORS = ["#FFC94A", "#33D6C0", "#FF6E8F", "#9B86FF", "#3FCE84"];

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function stepConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    var alive = [];
    for (var i = 0; i < confettiParticles.length; i++) {
      var p = confettiParticles[i];
      p.vy += 0.18;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.life++;
      if (p.life < p.maxLife && p.y < confettiCanvas.height + 40) {
        alive.push(p);
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rot);
        confettiCtx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        confettiCtx.restore();
      }
    }
    confettiParticles = alive;
    if (confettiParticles.length) {
      requestAnimationFrame(stepConfetti);
    } else {
      confettiRunning = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  function burstConfetti() {
    if (!confettiCtx || reduceMotion) return;
    resizeConfetti();
    var originX = confettiCanvas.width / 2;
    var originY = confettiCanvas.height * 0.32;
    for (var i = 0; i < 90; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 3 + Math.random() * 7;
      confettiParticles.push({
        x: originX + (Math.random() - 0.5) * 140,
        y: originY,
        vx: Math.cos(angle) * speed * 0.6,
        vy: Math.sin(angle) * speed - 4,
        size: 5 + Math.random() * 5,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        life: 0,
        maxLife: 70 + Math.random() * 40
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(stepConfetti);
    }
  }

  window.addEventListener("resize", resizeConfetti);
  resizeConfetti();

  /* ============ Byte's celebration toast ============ */
  var toastEl = null;
  var toastTimer = null;

  function ensureToast() {
    if (toastEl) return toastEl;
    var tpl = document.getElementById("byteTemplate");
    if (!tpl) return null;
    var wrap = document.createElement("div");
    wrap.className = "byte-toast";
    wrap.appendChild(tpl.content.cloneNode(true));
    var textWrap = document.createElement("div");
    textWrap.className = "byte-toast-text";
    textWrap.innerHTML = '<div class="headline">Flag captured!</div><div class="sub" id="byteToastSub"></div>';
    wrap.appendChild(textWrap);
    document.body.appendChild(wrap);
    toastEl = wrap;
    return wrap;
  }

  function celebrate(label) {
    var toast = ensureToast();
    burstConfetti();
    if (!toast) return;
    var mascot = toast.querySelector(".byte-mascot");
    var sub = toast.querySelector("#byteToastSub");
    if (sub) sub.textContent = label ? label + " — nice work, agent." : "Nice work, agent.";
    toast.classList.add("show");
    if (mascot && !reduceMotion) mascot.classList.add("celebrate");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
      if (mascot) mascot.classList.remove("celebrate");
    }, 2400);
  }

  /* ============ watch for newly solved challenges (read-only DOM watch) ============ */
  var chalGrid = document.getElementById("chalGrid");
  var seenSolved = {};

  /* pre-seed with anything already solved from a previous visit, so we only
     celebrate genuinely NEW solves, never ones restored from localStorage */
  (function preSeedSolved() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.solved) {
        for (var cid in parsed.solved) seenSolved["cardwrap-" + cid] = true;
      }
    } catch (e) {}
  })();

  if (chalGrid && window.MutationObserver) {
    var observer = new MutationObserver(function () {
      var solvedCards = chalGrid.querySelectorAll(".chal-card.solved");
      for (var i = 0; i < solvedCards.length; i++) {
        var card = solvedCards[i];
        if (card.id && !seenSolved[card.id]) {
          seenSolved[card.id] = true;
          var titleEl = card.querySelector(".chal-title");
          celebrate(titleEl ? titleEl.textContent : "");
        }
      }
    });
    observer.observe(chalGrid, { childList: true, subtree: true });
  }

  /* ============ real 3D badge, rendered with Three.js ============ */
  function initBadge3D() {
    var container = document.getElementById("badge3d");
    if (!container || typeof THREE === "undefined") return;
    var w = container.clientWidth || 176;
    var h = container.clientHeight || 176;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.HemisphereLight(0xfff3cf, 0x201a4d, 0.95));
    var dir = new THREE.DirectionalLight(0xffffff, 1.15);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    var rim = new THREE.PointLight(0x33d6c0, 1.6, 20);
    rim.position.set(-3, -2, 4);
    scene.add(rim);

    var group = new THREE.Group();
    scene.add(group);

    /* shield-shaped badge, extruded into real 3D geometry */
    var shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 2.2);
    shieldShape.quadraticCurveTo(1.9, 1.9, 1.9, 0.6);
    shieldShape.lineTo(1.9, -0.6);
    shieldShape.quadraticCurveTo(1.7, -1.9, 0, -2.6);
    shieldShape.quadraticCurveTo(-1.7, -1.9, -1.9, -0.6);
    shieldShape.lineTo(-1.9, 0.6);
    shieldShape.quadraticCurveTo(-1.9, 1.9, 0, 2.2);

    var shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.55, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 4, curveSegments: 12
    });
    shieldGeo.center();
    var shieldMat = new THREE.MeshStandardMaterial({ color: 0xffc94a, metalness: 0.55, roughness: 0.32 });
    group.add(new THREE.Mesh(shieldGeo, shieldMat));

    /* glowing teal keyhole emblem inset on the face */
    var emblemMat = new THREE.MeshStandardMaterial({ color: 0x1b1640, emissive: 0x33d6c0, emissiveIntensity: 0.95, roughness: 0.4 });
    var circleMesh = new THREE.Mesh(new THREE.CircleGeometry(0.34, 24), emblemMat);
    circleMesh.position.set(0, 0.45, 0.32);
    group.add(circleMesh);

    var triShape = new THREE.Shape();
    triShape.moveTo(-0.22, 0);
    triShape.lineTo(0.22, 0);
    triShape.lineTo(0, -0.5);
    var triMesh = new THREE.Mesh(new THREE.ShapeGeometry(triShape), emblemMat);
    triMesh.position.set(0, 0, 0.32);
    group.add(triMesh);

    group.rotation.x = 0.25;

    var pointer = { x: 0, y: 0 };
    container.addEventListener("pointermove", function (e) {
      var rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    });
    container.addEventListener("pointerleave", function () {
      pointer.x = 0;
      pointer.y = 0;
    });

    var clock = new THREE.Clock();
    function render() {
      var t = clock.getElapsedTime();
      group.rotation.y += 0.008 + pointer.x * 0.01;
      var targetX = 0.25 - pointer.y * 0.25;
      group.rotation.x += (targetX - group.rotation.x) * 0.06;
      group.position.y = Math.sin(t * 1.2) * 0.15;
      renderer.render(scene, camera);
      if (!reduceMotion) requestAnimationFrame(render);
    }
    render();

    function handleResize() {
      var nw = container.clientWidth || w;
      var nh = container.clientHeight || h;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      if (reduceMotion) renderer.render(scene, camera);
    }
    window.addEventListener("resize", handleResize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBadge3D);
  } else {
    initBadge3D();
  }

  /* ============ persistent Byte companion — an interactive helper, ============
     not just decoration. Reacts to wrong guesses, cheers on solves, and
     chimes in on its own sometimes. Read-only with respect to app.js: it
     only ever looks at classes app.js already sets, never edits app.js. */
  var companion = document.getElementById("byteCompanion");
  var companionMascot = companion ? companion.querySelector(".byte-companion-mascot") : null;
  var bubble = document.getElementById("byteBubble");
  var bubbleTimer = null;

  var ENCOURAGE_LINES = [
    "You've got this, agent! Every codebreaker started right where you are.",
    "Stuck? Try reading the clue out loud — it helps more than you'd think.",
    "Remember: flags always look like flag{...}. Small stuff like that trips people up!",
    "Take a breath, look again — you'll spot it.",
    "Every great codebreaker gets stuck sometimes. That's the fun part."
  ];
  var NUDGE_LINES = [
    "Ooh, so close! Look one more time.",
    "Not quite — but you're getting warmer.",
    "Hmm, try reading it nice and slow.",
    "That's not it yet — don't give up on me now!"
  ];
  var IDLE_TIP_LINES = [
    "Psst — View Page Source is a real hacker tool. Try right-clicking the page!",
    "A Caesar cipher just slides every letter forward by a fixed number. Try shifting it back.",
    "If text looks invisible, try selecting it with your mouse or Ctrl+A.",
    "A equals 1, B equals 2, all the way to Z equals 26 — handy for number codes!",
    "Flags always look like flag{...} — capital or lowercase both work."
  ];

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  function showBubble(text, holdMs) {
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.add("show");
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () {
      bubble.classList.remove("show");
    }, holdMs || 4200);
  }

  if (companion) {
    var triggerCompanion = function () {
      showBubble(pick(ENCOURAGE_LINES));
      if (companionMascot && !reduceMotion) {
        companionMascot.classList.add("cheer");
        setTimeout(function () { companionMascot.classList.remove("cheer"); }, 900);
      }
    };
    companion.addEventListener("click", triggerCompanion);
    companion.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerCompanion();
      }
    });

    /* an unprompted friendly tip every so often, in Byte's own voice */
    (function idleTipLoop() {
      var delay = 32000 + Math.random() * 16000;
      setTimeout(function () {
        if (bubble && !bubble.classList.contains("show")) {
          showBubble(pick(IDLE_TIP_LINES), 5200);
        }
        idleTipLoop();
      }, delay);
    })();

    /* a gentle nudge on a wrong guess, read from the feedback classes app.js already sets */
    if (chalGrid) {
      chalGrid.addEventListener("click", function (e) {
        var submitBtn = e.target.closest(".chal-form .btn, [data-action='w2-try'], [data-action='w3-try']");
        if (!submitBtn) return;
        var scope = submitBtn.closest(".chal-card") || chalGrid;
        setTimeout(function () {
          var badFeedback = scope.querySelector(".chal-feedback.no, .console-result.no");
          if (badFeedback) {
            showBubble(pick(NUDGE_LINES), 3200);
            if (companionMascot && !reduceMotion) {
              companionMascot.classList.add("nudge");
              setTimeout(function () { companionMascot.classList.remove("nudge"); }, 550);
            }
          }
        }, 40);
      });
    }

    /* perk up alongside the big celebration toast, so Byte feels present
       during the win itself and not only in the popup */
    var baseCelebrate = celebrate;
    celebrate = function (label) {
      baseCelebrate(label);
      if (companionMascot && !reduceMotion) {
        companionMascot.classList.add("cheer");
        setTimeout(function () { companionMascot.classList.remove("cheer"); }, 1400);
      }
    };
  }

  /* ============ real 3D tilt on cards (perspective + rotateX/rotateY) ============
     Delegated on document so it keeps working through app.js's re-renders
     (tab switches rebuild #chalGrid's innerHTML). Mouse/trackpad only —
     skipped on touch and when the visitor asked for reduced motion. */
  var canTilt = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canTilt && !reduceMotion) {
    var activeTiltEl = null;
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest ? e.target.closest(".chal-card, .stat-card") : null;
      if (activeTiltEl && activeTiltEl !== el) {
        activeTiltEl.style.transform = "";
      }
      if (!el) {
        activeTiltEl = null;
        return;
      }
      activeTiltEl = el;
      var rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = "perspective(700px) rotateX(" + (py * -8).toFixed(2) + "deg) rotateY(" + (px * 10).toFixed(2) + "deg) translateY(-4px)";
    });
    document.addEventListener("pointerleave", function () {
      if (activeTiltEl) {
        activeTiltEl.style.transform = "";
        activeTiltEl = null;
      }
    }, true);
  }
})();
