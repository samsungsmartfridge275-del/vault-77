(function () {
  "use strict";

  /* ============ pure JS SHA-256 (no crypto.subtle dependency) ============ */
  function sha256hex(str) {
    function rrot(x, n) { return (x >>> n) | (x << (32 - n)); }
    var K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var utf8 = unescape(encodeURIComponent(str));
    var bytes = [];
    for (var i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));
    var bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (var b = 7; b >= 0; b--) bytes.push((bitLen / Math.pow(2, b * 8)) & 0xff);

    for (var chunk = 0; chunk < bytes.length; chunk += 64) {
      var w = new Array(64);
      for (var t = 0; t < 16; t++) {
        w[t] = (bytes[chunk + t * 4] << 24) | (bytes[chunk + t * 4 + 1] << 16) |
               (bytes[chunk + t * 4 + 2] << 8) | (bytes[chunk + t * 4 + 3]);
      }
      for (t = 16; t < 64; t++) {
        var s0 = rrot(w[t - 15], 7) ^ rrot(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rrot(w[t - 2], 17) ^ rrot(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = H[0], bb = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rrot(e, 6) ^ rrot(e, 11) ^ rrot(e, 25);
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + K[t] + w[t]) | 0;
        var S0 = rrot(a, 2) ^ rrot(a, 13) ^ rrot(a, 22);
        var maj = (a & bb) ^ (a & c) ^ (bb & c);
        var temp2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + temp1) | 0;
        d = c; c = bb; bb = a; a = (temp1 + temp2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + bb) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = "";
    for (var hi = 0; hi < 8; hi++) {
      out += (H[hi] >>> 0).toString(16).padStart(8, "0");
    }
    return out;
  }

  /* ============ icon set (drawn, not stock) ============ */
  var ICON = {
    magnifier: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="19.5" y1="19.5" x2="15.1" y2="15.1"/></svg>',
    key: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="8.5" r="4"/><line x1="10.5" y1="11.5" x2="20.5" y2="21.5"/><line x1="15.5" y1="16.5" x2="13" y2="19"/><line x1="18" y1="19" x2="15.5" y2="21.5"/></svg>',
    eye: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.6"/></svg>',
    compass: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"><circle cx="12" cy="12" r="8.75"/><path d="M15.3 8.7 13 13l-4.3 2.3L11 11z"/></svg>',
    seal: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.75"/><path d="M8.7 12.3l2.1 2.1 4.3-4.6"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6"/></svg>',
    lock: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="1.75"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>'
  };
  var AVATARS = ["magnifier", "key", "eye", "compass", "seal"];

  var CATEGORIES = [
    { key: "web", label: "Web Exploitation", icon: "compass" },
    { key: "crypto", label: "Cryptography", icon: "lock" },
    { key: "re", label: "Reverse Engineering", icon: "key" },
    { key: "pwn", label: "Pwn / Binary Exploitation", icon: "seal" },
    { key: "forensics", label: "Digital Forensics", icon: "eye" }
  ];

  /* ============ caesar dial (crypto c1) ============ */
  function dialHtml() {
    var plain = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return '<div class="dial" id="dial-widget">' +
      '<div class="dial-row plain">' + plain.map(function (l) { return '<div class="dial-cell">' + l + '</div>'; }).join("") + '</div>' +
      '<div class="dial-row shifted" id="dialShiftedRow">' + renderShiftedRow(0) + '</div>' +
      '<div class="dial-controls">' +
        '<button type="button" class="dial-btn" data-action="dialshift" data-dir="-1">-</button>' +
        '<span class="dial-shift" id="dialShiftLabel">shift: 0</span>' +
        '<button type="button" class="dial-btn" data-action="dialshift" data-dir="1">+</button>' +
      '</div>' +
      '<div class="cipher-code">IODJ{FDHVDU_FLSKHUV_DUH_IXQ}</div>' +
    '</div>';
  }
  function renderShiftedRow(shift) {
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return letters.map(function (_, i) {
      var idx = ((i - shift) % 26 + 26) % 26;
      return '<div class="dial-cell">' + letters[idx] + '</div>';
    }).join("");
  }

  /* ============ challenges: every flag below is real, earned from the embedded material ============ */
  var CHALLENGES = [
    { id: "w1", cat: "web", title: "Secret Note in the Code", difficulty: "easy", points: 100,
      desc: "Web pages are built from code you can look at any time. Right click anywhere on this page and choose View Page Source (or press Ctrl+U / Cmd+Option+U). Somewhere in there, someone left a secret note.",
      hash: "6389360cba81ba697544e5894d9dbdc336e1f7f7456b3c28dbad4b647f45b538" },

    { id: "w2", cat: "web", title: "Secret Password in the Code", difficulty: "medium", points: 250,
      desc: "This pretend login checks your password using the code shown below. Read it carefully. Can you spot the real password hiding in it?",
      hash: "ad92f5c2e84c6cdc963140c48869aaa740298b660e2facb15185d162c7f94153", render: function () { return ''
        + '<div class="artifact-label">login-check.js</div>'
        + '<div class="artifact-block">function checkPassword(password) {\n  if (password === "sunshine88") {\n    unlockDoor();\n  }\n}</div>'
        + '<div class="console-row"><input type="text" id="w2pw" class="console-input" placeholder="Type the password" autocomplete="off" spellcheck="false"><button type="button" class="btn small outline" data-action="w2-try">Log In</button></div>'
        + '<div class="console-result" id="w2Result"></div>'; } },

    { id: "w3", cat: "web", title: "Find the Hidden Page", difficulty: "hard", points: 400,
      desc: "Here is a list of every page on a pretend website. One of them looks pretty suspicious. Find it and click it to see what is inside.",
      hash: "a5f1b80164203a05db231c9363d514c60159fdb347dd906ddeeffb0c3c9a894b", render: function () { return ''
        + '<div class="artifact-label">Website page list</div>'
        + '<div class="page-list">' + ["home", "about", "contact", "gallery", "shhh-dont-tell-anyone", "store"].map(function (p) { return '<button type="button" class="page-btn" data-action="w3-try" data-page="' + p + '">/' + p + '</button>'; }).join('') + '</div>'
        + '<div class="console-result" id="w3Result"></div>'; } },

    { id: "c1", cat: "crypto", title: "Caesar's Secret Wheel", difficulty: "easy", points: 100,
      desc: "Long ago, Julius Caesar sent secret messages by shifting every letter forward in the alphabet. The message below was shifted forward by 3 letters. Use the wheel to shift it back and read the flag.",
      hash: "af320decd2288f9ff5563a7f4a6938c39ddafeb16c56d97b18aeb9c718a32d91", render: function () { return dialHtml(); } },

    { id: "c2", cat: "crypto", title: "Number Code", difficulty: "medium", points: 300,
      desc: "Spies love turning letters into numbers. Using A=1, B=2, C=3 all the way to Z=26 (and 0 for a space or underscore), decode the numbers below to find the flag.",
      hash: "6f1ed36165473bff3aee1ebe4d33dbc385e01dc543ed7a243ec752f44e9300e0", render: function () { return ''
        + '<div class="artifact-label">Secret numbers</div>'
        + '<div class="artifact-block">3 15 4 5 0 2 18 5 1 11 5 18</div>'
        + '<div class="decode-hint">A=1, B=2, C=3, up to Z=26, and 0 = underscore or space.</div>'; } },

    { id: "c3", cat: "crypto", title: "First Letters", difficulty: "hard", points: 450,
      desc: "Secret messages can hide in the very first letter of each sentence. Read only the first letter of each sentence below, in order, to spell a word. Do this three times to get all three words, then join them with underscores.",
      hash: "5d63ab200d6272ca6693370ccc449a221e06fd52f7a6d903ef7bdabf99e05ff0", render: function () { return ''
        + '<div class="artifact-label">Word 1</div>'
        + '<div class="artifact-block">Ninjas train quietly at night. | Elephants never forget a friend. | Volcanoes can be found on many continents. | Everyone loves a good mystery. | Robots can be programmed to dance.</div>'
        + '<div class="artifact-label stacked">Word 2</div>'
        + '<div class="artifact-block">Giraffes have really long necks. | Ice cream tastes best on a hot day. | Video games can be fun and challenging. | Eagles have amazing eyesight.</div>'
        + '<div class="artifact-label stacked">Word 3</div>'
        + '<div class="artifact-block">Umbrellas keep you dry in the rain. | Puzzles make your brain stronger.</div>'
        + '<div class="artifact-note">Join the three words with underscores, like word1_word2_word3.</div>'; } },

    { id: "re1", cat: "re", title: "Backwards Message", difficulty: "easy", points: 150,
      desc: "This tiny program prints letters one at a time, starting from the last one in its list and working backwards to the first. What word does it print?",
      hash: "e9d30390e54d55f34d84c5b8c0be825c42cc71a516c5c6f128a1df9266d3f504", render: function () { return ''
        + '<div class="artifact-label">letters list (in the order they are stored)</div>'
        + '<div class="artifact-block">["b", "o", "j", "_", "t", "a", "e", "r", "g"]</div>'
        + '<div class="artifact-note">Read the list starting from the last letter and going backwards to the first.</div>'; } },

    { id: "re2", cat: "re", title: "Follow the Steps", difficulty: "medium", points: 300,
      desc: "Follow these steps exactly, in order, and see what word you end up with.",
      hash: "4b2d927d3ffb0156b8ea7a58081ce7b2ea91b59006cfcc11e5fd9db1dec99b8f", render: function () { return ''
        + '<div class="artifact-label">Instructions</div>'
        + '<div class="artifact-block">Start with the word: DRAGON\nStep 1: Reverse the word (spell it backwards).\nStep 2: Change every letter O to the number 0 (zero).\nStep 3: Make all the letters lowercase.\nStep 4: Add "the_" to the very front.</div>'; } },

    { id: "re3", cat: "re", title: "Letter Grid Path", difficulty: "insane", points: 500,
      desc: "Start at the highlighted square (top left) and follow the directions below, one step at a time, writing down the letter in every square you land on, including the very first one.",
      hash: "3e01a9d50f9a6d6464359ea3e25e40160f33e7fcd2bf6d3f193aa48b0182f1a0", render: function () { return ''
        + '<div class="artifact-label">Letter grid (start square highlighted)</div>'
        + '<div class="artifact-block" style="font-size:1.1rem;letter-spacing:.4em;line-height:2;"><span style="color:var(--accent);font-weight:800;">W</span><span>E</span><span>A</span><span>X</span><span>I</span><span>H</span>\n<span>H</span><span>L</span><span>L</span><span>D</span><span>V</span><span>X</span>\n<span>R</span><span>C</span><span>D</span><span>O</span><span>B</span><span>A</span>\n<span>C</span><span>G</span><span>H</span><span>N</span><span>E</span><span>A</span>\n<span>R</span><span>G</span><span>W</span><span>U</span><span>W</span><span>R</span>\n<span>N</span><span>H</span><span>O</span><span>S</span><span>I</span><span>Z</span></div>'
        + '<div class="artifact-note">Directions: Right, Down, Right, Down, Right, Down, Right</div>'; } },

    { id: "p1", cat: "pwn", title: "Overflowing Boxes", difficulty: "easy", points: 200,
      desc: "A toy box can only hold 6 toys. If you try to fit 9 toys inside, the extra ones spill over into the next box. How many toys spill over? Submit your answer as flag{spilled_N}.",
      hash: "b96af28557ada921fbdd06c675ba8375a73064cb606c642c136cee17d65109e9" },

    { id: "p2", cat: "pwn", title: "The Invisible Message", difficulty: "medium", points: 300,
      desc: "Some secret messages are hidden by making the text the exact same color as its background, completely invisible until you know the trick. Click at the start of the box below and drag to the end (or press Ctrl+A / Cmd+A) to select all the text and reveal it.",
      hash: "a859d61165667ad6efb92c0fc0921c198537da1cb5a58fdaea6a1e2a51a3ef0a", render: function () { return ''
        + '<div class="hidden-text-box">Nothing to see here, just an empty box, or so it seems. Keep looking, there is definitely more text here than meets the eye. Actually, the real secret is hiding right around here: you_found_me, yes, that was it! Nothing else to see after this.</div>'; } },

    { id: "p3", cat: "pwn", title: "Treasure Map", difficulty: "hard", points: 450,
      desc: "Start at the highlighted square (top left) and follow the directions below, writing down the letter in every square you land on, including the first one, to find the treasure.",
      hash: "94e14a37d161e53a5b2bc5e8a5cd27c3e6f3a4321e189b4f41270a5348928bd3", render: function () { return ''
        + '<div class="artifact-label">Treasure grid (start square highlighted)</div>'
        + '<div class="artifact-block" style="font-size:1.1rem;letter-spacing:.4em;line-height:2;"><span style="color:var(--accent);font-weight:800;">T</span><span>E</span><span>M</span><span>U</span><span>B</span><span>C</span><span>R</span>\n<span>R</span><span>E</span><span>S</span><span>B</span><span>Q</span><span>G</span><span>B</span>\n<span>C</span><span>A</span><span>S</span><span>C</span><span>H</span><span>C</span><span>R</span>\n<span>N</span><span>B</span><span>U</span><span>R</span><span>H</span><span>U</span><span>U</span>\n<span>S</span><span>B</span><span>S</span><span>E</span><span>M</span><span>B</span><span>H</span>\n<span>B</span><span>R</span><span>E</span><span>J</span><span>N</span><span>E</span><span>R</span></div>'
        + '<div class="artifact-note">Directions: Down, Right, Down, Right, Down, Right, Down</div>'; } },

    { id: "f1", cat: "forensics", title: "Spot the Hidden Message", difficulty: "easy", points: 150,
      desc: "Look closely at the image below. Really closely. There is a message hiding in the pattern, almost the same color as the background.",
      hash: "32fe36805b3cd52c3c1cf19ec1a74d14188b762a6349b2851b193f123d4472a6", render: function () { return ''
        + '<div class="artifact-img-wrap"><img class="artifact-img" src="assets/hidden-message.png" alt="a soft patterned image with a faint hidden message"></div>'; } },

    { id: "f2", cat: "forensics", title: "Something's Not Right", difficulty: "medium", points: 250,
      desc: "Here is a list of things a computer did today. Read through it carefully. One line looks very suspicious.",
      hash: "a38607d4f839e7f9ead3622482729d70227b3be12cd89e1c36a4e93d57f2b9ea", render: function () { return ''
        + '<div class="artifact-label">Today\'s activity list</div>'
        + '<div class="artifact-block">9:01 AM  - Computer turned on\n9:02 AM  - Opened web browser\n9:05 AM  - Checked email\n9:10 AM  - Opened a game\n9:15 AM  - Saved a school project\n9:20 AM  - Downloaded a picture\n9:22 AM  - Weird pop-up appeared: flag{spotted_it}\n9:25 AM  - Closed the game\n9:30 AM  - Opened homework folder\n9:35 AM  - Printed a document\n9:40 AM  - Computer went to sleep</div>'; } },

    { id: "f3", cat: "forensics", title: "Spy Chat Messages", difficulty: "hard", points: 400,
      desc: "This message from a spy chat log looks like nonsense, but it is not. Read only every second letter, starting from the second letter, to find the hidden message.",
      hash: "d019118ebda482927575797ebe614289011e2b30428ac4f0e968d23250b5c813", render: function () { return ''
        + '<div class="artifact-label">Intercepted message</div>'
        + '<div class="artifact-block" style="font-size:1.15rem;letter-spacing:.12em;">mdmogutbflheh_eaygceinxt</div>'
        + '<div class="artifact-note">Start from the 2nd letter and read every other letter: letter 2, 4, 6, 8...</div>'; } }
  ];

  var TOTAL_POINTS = CHALLENGES.reduce(function (sum, c) { return sum + c.points; }, 0);

  /* ============ state ============ */
  var STORAGE_KEY = "thetell.ctf.v3";
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { team: "", avatar: "magnifier", solved: {}, dialShift: 0, startedAt: Date.now() };
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  var state = loadState();
  if (!state.startedAt) state.startedAt = Date.now();

  function findChallenge(cid) {
    for (var i = 0; i < CHALLENGES.length; i++) if (CHALLENGES[i].id === cid) return CHALLENGES[i];
    return null;
  }
  function totalCount() { return CHALLENGES.length; }
  function solvedCount() { return Object.keys(state.solved || {}).length; }
  function myScore() {
    var sum = 0;
    for (var cid in state.solved) { var c = findChallenge(cid); if (c) sum += c.points; }
    return sum;
  }
  function categoryMasteryPct(catKey) {
    var all = CHALLENGES.filter(function (c) { return c.cat === catKey; });
    var solved = all.filter(function (c) { return state.solved[c.id]; });
    return all.length ? Math.round((solved.length / all.length) * 100) : 0;
  }
  function categoryCounts(catKey) {
    var all = CHALLENGES.filter(function (c) { return c.cat === catKey; });
    var solved = all.filter(function (c) { return state.solved[c.id]; });
    return { solved: solved.length, total: all.length };
  }
  function overallMasteryAvg() {
    var pcts = CATEGORIES.map(function (c) { return categoryMasteryPct(c.key); });
    return Math.round(pcts.reduce(function (a, b) { return a + b; }, 0) / pcts.length);
  }

  /* ============ static icon fill ============ */
  function renderStaticIcons() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-icon]"), function (el) {
      var name = el.getAttribute("data-icon");
      if (ICON[name]) el.innerHTML = ICON[name];
    });
  }

  /* ============ node network canvas backdrop ============ */
  function initNodeField() {
    var canvas = document.getElementById("nodeField");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var W, H, DPR;
    var nodes = [];
    var NODE_COUNT = 60;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function makeNodes() {
      nodes = [];
      var count = W < 700 ? 28 : NODE_COUNT;
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 1 + Math.random() * 1.6
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      var linkDist = 150;
      for (i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            var alpha = (1 - dist / linkDist) * 0.16;
            ctx.strokeStyle = "rgba(139,178,255," + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        var nd = nodes[i];
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,205,255,0.45)";
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(step);
    }

    resize();
    makeNodes();
    step();

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); makeNodes(); if (reduceMotion) step(); }, 200);
    });
  }

  /* ============ boot sequence ============ */
  function runBoot() {
    var boot = document.getElementById("bootScreen");
    var skip = document.getElementById("bootSkip");
    if (!boot) { enterGate(); return; }
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      boot.classList.add("hidden");
      enterGate();
    }
    setTimeout(finish, 2200);
    if (skip) skip.addEventListener("click", finish);
  }

  function enterGate() {
    var gate = document.getElementById("gate");
    if (gate) gate.classList.remove("hidden");
  }

  /* ============ gate / avatar picker ============ */
  var selectedAvatar = state.avatar || "magnifier";

  function renderAvatarPicker() {
    var avatarPicker = document.getElementById("avatarPicker");
    if (!avatarPicker) return;
    avatarPicker.innerHTML = AVATARS.map(function (a) {
      return '<button type="button" class="avatar-opt' + (a === selectedAvatar ? " selected" : "") + '" data-avatar="' + a + '">' + ICON[a] + '</button>';
    }).join("");
    Array.prototype.forEach.call(avatarPicker.querySelectorAll("[data-avatar]"), function (btn) {
      btn.addEventListener("click", function () { selectedAvatar = btn.getAttribute("data-avatar"); renderAvatarPicker(); });
    });
  }

  function wireGate() {
    var brandMark = document.getElementById("brandMark");
    if (brandMark) brandMark.innerHTML = ICON.key;
    renderAvatarPicker();
    var enterBtn = document.getElementById("enterBtn");
    var nameInput = document.getElementById("teamNameInput");
    if (nameInput && state.team) nameInput.value = state.team;
    if (enterBtn) {
      enterBtn.addEventListener("click", function () {
        var name = (nameInput && nameInput.value.trim()) || "Agent";
        state.team = name; state.avatar = selectedAvatar; saveState();
        document.getElementById("gate").classList.add("hidden");
        enterPlatform();
      });
    }
    if (nameInput) {
      nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); enterBtn.click(); }
      });
    }
  }

  /* ============ view switching ============ */
  var views = { dashboard: 1, challenges: 1, progress: 1, rules: 1 };
  function setView(name) {
    if (!views[name]) name = "dashboard";
    Object.keys(views).forEach(function (v) {
      var el = document.getElementById("view-" + v);
      if (el) el.classList.toggle("active", v === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".nav-link"), function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-view") === name);
    });
    if (name === "dashboard") renderDashboard();
    if (name === "challenges") renderChallengesView();
    if (name === "progress") renderProgress();
  }

  function wireNav() {
    Array.prototype.forEach.call(document.querySelectorAll(".nav-link"), function (btn) {
      btn.addEventListener("click", function () { setView(btn.getAttribute("data-view")); });
    });
  }

  /* ============ topbar / dashboard ============ */
  function renderTopbar() {
    var pct = totalCount() ? Math.round((solvedCount() / totalCount()) * 100) : 0;
    var badge = document.getElementById("rankBadge");
    if (badge) badge.textContent = pct + "% COMPLETE";
    var scoreEl = document.getElementById("tbScore");
    if (scoreEl) scoreEl.textContent = myScore() + " PTS";
    var solvedEl = document.getElementById("tbSolved");
    if (solvedEl) solvedEl.textContent = solvedCount() + "/" + totalCount();
    var callsignEl = document.getElementById("tbCallsign");
    if (callsignEl) callsignEl.textContent = state.team || "Agent";
  }

  function renderCategoryBars(targetId) {
    var el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = CATEGORIES.map(function (cat) {
      var counts = categoryCounts(cat.key);
      var pct = counts.total ? Math.round((counts.solved / counts.total) * 100) : 0;
      return '<div class="cat-row">'
        + '<div class="cat-row-icon">' + ICON[cat.icon] + '</div>'
        + '<div class="cat-row-body">'
          + '<div class="cat-row-top"><span>' + cat.label + '</span><span class="count">' + counts.solved + '/' + counts.total + '</span></div>'
          + '<div class="cat-row-track"><div class="cat-row-fill" style="width:' + pct + '%"></div></div>'
        + '</div>'
      + '</div>';
    }).join("");
  }

  function renderDashboard() {
    renderTopbar();
    var totalScoreEl = document.getElementById("dashTotalScore");
    if (totalScoreEl) totalScoreEl.textContent = myScore();
    var solvedFrac = document.getElementById("dashSolvedFrac");
    if (solvedFrac) solvedFrac.textContent = solvedCount() + " / " + totalCount();
    var masteryEl = document.getElementById("dashMastery");
    if (masteryEl) masteryEl.textContent = overallMasteryAvg() + "%";
    renderCategoryBars("dashBreakdown");
  }

  /* ============ challenges view ============ */
  var activeCat = "all";

  function renderCatTabs() {
    var el = document.getElementById("catTabs");
    if (!el) return;
    var tabs = [{ key: "all", label: "All" }].concat(CATEGORIES.map(function (c) { return { key: c.key, label: c.label }; }));
    el.innerHTML = tabs.map(function (t) {
      return '<button type="button" class="cat-tab' + (t.key === activeCat ? " active" : "") + '" data-cat="' + t.key + '">' + t.label + '</button>';
    }).join("");
    Array.prototype.forEach.call(el.querySelectorAll("[data-cat]"), function (btn) {
      btn.addEventListener("click", function () { activeCat = btn.getAttribute("data-cat"); renderChalGrid(); renderCatTabs(); });
    });
  }

  function renderChalCard(c, idx) {
    var solved = !!state.solved[c.id];
    var delay = Math.min(idx * 0.04, 0.4);
    var body = '<div class="chal-head">'
        + '<span class="chal-cat-tag">' + (CATEGORIES.find(function (x) { return x.key === c.cat; }) || {}).label + '</span>'
        + '<span class="chal-points">' + c.points + ' PTS</span>'
      + '</div>'
      + '<h3 class="chal-title">' + c.title + '</h3>'
      + '<span class="diff-tag diff-' + c.difficulty + '">' + c.difficulty + '</span>'
      + '<p class="chal-desc">' + c.desc + '</p>'
      + (c.render ? '<div class="chal-puzzle">' + c.render() + '</div>' : '');

    if (solved) {
      body += '<div class="chal-solved-row">' + ICON.check + '<span>Solved, flag captured</span></div>';
    } else {
      body += '<div class="chal-form">'
        + '<label class="sr-only" for="flag-' + c.id + '">Flag for ' + c.title + '</label>'
        + '<input type="text" id="flag-' + c.id + '" placeholder="flag{...}" autocomplete="off" spellcheck="false">'
        + '<button type="button" class="btn small">Submit</button>'
      + '</div>'
      + '<div class="chal-feedback" role="status"></div>';
    }
    return '<div class="chal-card' + (solved ? " solved" : "") + '" id="cardwrap-' + c.id + '" data-cat="' + c.cat + '" style="animation-delay:' + delay + 's">' + body + '</div>';
  }

  function renderChalGrid() {
    var grid = document.getElementById("chalGrid");
    if (!grid) return;
    var list = CHALLENGES.filter(function (c) { return activeCat === "all" || c.cat === activeCat; });
    grid.innerHTML = list.map(function (c, i) { return renderChalCard(c, i); }).join("");
    if (state.dialShift) applyDialShift(state.dialShift, true);
  }

  function updateCardInPlace(cid) {
    var idx = CHALLENGES.findIndex(function (c) { return c.id === cid; });
    var c = findChallenge(cid);
    var wrap = document.getElementById("cardwrap-" + cid);
    if (!c || !wrap) return;
    var tmp = document.createElement("div");
    tmp.innerHTML = renderChalCard(c, idx);
    wrap.replaceWith(tmp.firstElementChild);
  }

  function normFlag(s) { return (s || "").trim().toLowerCase(); }

  function attemptFlag(cid, raw) {
    var c = findChallenge(cid);
    if (!c) return false;
    return sha256hex(normFlag(raw)) === c.hash;
  }

  function solveChallenge(cid) {
    if (state.solved[cid]) return;
    var c = findChallenge(cid);
    state.solved[cid] = { ts: Date.now(), val: "" };
    saveState();
    updateCardInPlace(cid);
    renderTopbar();
    if (c) {
      var catLabel = (CATEGORIES.find(function (x) { return x.key === c.cat; }) || {}).label;
      pushTerm("sys", state.team + " solved " + catLabel + " / " + c.title + " (+" + c.points + " PTS)");
    }
  }

  function tryW2Password() {
    var el = document.getElementById("w2pw");
    var result = document.getElementById("w2Result");
    if (!el || !result) return;
    if ((el.value || "").trim().toLowerCase() === "sunshine88") {
      result.className = "console-result ok";
      result.innerHTML = "The door unlocks. A note falls out with this code on it:<br><b>21 14 12 15 3 11 5 4 0 20 8 5 0 4 15 15 18</b><br>Decode it with A=1, B=2, up to Z=26 (0 = underscore) to get the flag.";
      pushTerm("sys", "Correct password found in the code. Door unlocked on w2.");
    } else {
      result.className = "console-result no";
      result.textContent = "Nope, that is not it. Look at the code again.";
    }
  }
  function tryW3Page(pageName) {
    var result = document.getElementById("w3Result");
    if (!result) return;
    if (pageName === "shhh-dont-tell-anyone") {
      result.className = "console-result ok";
      result.innerHTML = "You found it. Behind the page is a note with this code on it:<br><b>19 5 3 18 5 20 0 16 1 7 5 0 6 15 21 14 4</b><br>Decode it with A=1, B=2, up to Z=26 (0 = underscore) to get the flag.";
      pushTerm("sys", "Found the hidden page on w3.");
    } else {
      result.className = "console-result no";
      result.textContent = "Just a normal page. Keep looking.";
    }
  }

  function applyDialShift(shift, silent) {
    state.dialShift = ((shift % 26) + 26) % 26;
    if (!silent) saveState();
    var row = document.getElementById("dialShiftedRow");
    var label = document.getElementById("dialShiftLabel");
    if (row) row.innerHTML = renderShiftedRow(state.dialShift);
    if (label) label.textContent = "shift: " + state.dialShift;
  }

  function wireChalEvents() {
    var grid = document.getElementById("chalGrid");
    if (!grid) return;
    grid.addEventListener("click", function (e) {
      var dialEl = e.target.closest("[data-action='dialshift']");
      if (dialEl) {
        var dir = parseInt(dialEl.getAttribute("data-dir"), 10);
        var newShift = state.dialShift + dir;
        applyDialShift(newShift);
        return;
      }
      var w2Btn = e.target.closest("[data-action='w2-try']");
      if (w2Btn) { tryW2Password(); return; }
      var w3Btn = e.target.closest("[data-action='w3-try']");
      if (w3Btn) { tryW3Page(w3Btn.getAttribute("data-page")); return; }

      var submitBtn = e.target.closest(".chal-form .btn");
      if (submitBtn) {
        var wrap = submitBtn.closest(".chal-card");
        var cid = wrap.id.replace("cardwrap-", "");
        var input = wrap.querySelector(".chal-form input[type=text]");
        var feedback = wrap.querySelector(".chal-feedback");
        if (attemptFlag(cid, input.value)) {
          feedback.className = "chal-feedback ok";
          feedback.textContent = "Correct. Flag captured.";
          solveChallenge(cid);
        } else {
          feedback.className = "chal-feedback no";
          feedback.textContent = "Not quite. Try again.";
        }
      }
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var input = e.target.closest(".chal-form input[type=text]");
      if (!input) return;
      e.preventDefault();
      var btn = input.closest(".chal-form").querySelector(".btn");
      if (btn) btn.click();
    });
    var w2pw = document.getElementById("w2pw");
    if (w2pw) { w2pw.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); tryW2Password(); } }); }
  }

  function renderChallengesView() {
    renderCatTabs();
    renderChalGrid();
  }

  /* ============ progress view ============ */
  function renderProgress() {
    renderTopbar();
    renderCategoryBars("progressBreakdown");
    var solvedTotalEl = document.getElementById("progressSolvedTotal");
    if (solvedTotalEl) solvedTotalEl.textContent = solvedCount() + " / " + totalCount() + " SOLVED";
    var body = document.getElementById("progressTableBody");
    if (!body) return;
    var rows = Object.keys(state.solved).map(function (cid) {
      var c = findChallenge(cid);
      if (!c) return null;
      var ts = state.solved[cid].ts;
      var d = new Date(ts);
      var stamp = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
      var catLabel = (CATEGORIES.find(function (x) { return x.key === c.cat; }) || {}).label;
      return { ts: ts, html: '<tr><td>' + stamp + '</td><td>' + c.title + '</td><td>' + catLabel + '</td><td class="pts">' + c.points + '</td></tr>' };
    }).filter(Boolean).sort(function (a, b) { return a.ts - b.ts; });
    if (!rows.length) {
      body.innerHTML = '';
      var table = document.getElementById("progressTable");
      if (table) table.classList.add("hidden");
      var empty = document.getElementById("progressEmpty");
      if (empty) empty.classList.remove("hidden");
    } else {
      var table2 = document.getElementById("progressTable");
      if (table2) table2.classList.remove("hidden");
      var empty2 = document.getElementById("progressEmpty");
      if (empty2) empty2.classList.add("hidden");
      body.innerHTML = rows.map(function (r) { return r.html; }).join("");
    }
  }

  /* ============ session log ============ */
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function nowStamp() {
    var d = new Date();
    return pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
  }
  function termLine(tag, text) {
    var tagClass = tag === "sys" ? "sys" : (tag === "tip" ? "tip" : "info");
    var tagText = tag === "sys" ? "SYSTEM" : (tag === "tip" ? "TIP" : "INFO");
    return '<div class="term-line"><span class="term-time">' + nowStamp() + '</span><span class="term-tag ' + tagClass + '">[' + tagText + ']</span>' + text + '</div>';
  }
  function pushTerm(tag, text) {
    var body = document.getElementById("terminalBody");
    if (!body) return;
    body.insertAdjacentHTML("beforeend", termLine(tag, text));
    body.scrollTop = body.scrollHeight;
    var lines = body.querySelectorAll(".term-line");
    if (lines.length > 80) lines[0].remove();
  }
  function seedTerminal() {
    pushTerm("sys", "Interface initialized.");
    pushTerm("sys", "Challenge bank loaded: 15 challenges across 5 categories.");
    pushTerm("info", "Flags are verified locally with SHA-256. Nothing is sent to a server.");
    pushTerm("info", "Operator '" + (state.team || "Agent") + "' authenticated locally.");
  }
  var TIPS = [
    "A flag always looks like flag{...}. Type it in any mix of capital or lowercase letters.",
    "If a puzzle shows you a table of letters and numbers, try A equals 1, B equals 2, all the way to Z equals 26.",
    "View Page Source is a real tool real developers use every day. It is not cheating, it is part of the job.",
    "When text looks invisible, try selecting it with your mouse or with Ctrl+A.",
    "A Caesar cipher just slides every letter forward by a fixed number of steps in the alphabet.",
    "Reading carefully is a real cybersecurity skill. Most tricks hide in plain sight."
  ];
  var tipIndex = 0;
  function startTipFeed() {
    setInterval(function () {
      pushTerm("tip", TIPS[tipIndex % TIPS.length]);
      tipIndex++;
    }, 25000);
  }

  /* ============ session timer ============ */
  function formatElapsed(ms) {
    var totalSec = Math.floor(ms / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    return pad2(h) + ":" + pad2(m) + ":" + pad2(s);
  }
  function tickSession() {
    var elapsed = formatElapsed(Date.now() - state.startedAt);
    var el = document.getElementById("sessionTime");
    if (el) el.textContent = elapsed;
    var dashEl = document.getElementById("dashSessionTime");
    if (dashEl) dashEl.textContent = elapsed;
  }

  /* ============ master init ============ */
  function enterPlatform() {
    var shell = document.getElementById("shell");
    if (shell) shell.classList.remove("hidden");
    var totalPointsEl = document.getElementById("dashTotalPoints");
    if (totalPointsEl) totalPointsEl.textContent = TOTAL_POINTS;
    var totalPointsSubEl = document.getElementById("dashTotalPointsSub");
    if (totalPointsSubEl) totalPointsSubEl.textContent = totalCount() + " CHALLENGES / " + TOTAL_POINTS + " PTS";
    var operatorLineEl = document.getElementById("operatorLine");
    if (operatorLineEl) operatorLineEl.innerHTML = ICON.magnifier + " <span>" + (state.team || "Agent") + "</span>";
    wireNav();
    wireChalEvents();
    seedTerminal();
    startTipFeed();
    setInterval(tickSession, 1000);
    tickSession();
    setView("dashboard");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderStaticIcons();
    initNodeField();
    wireGate();
    runBoot();
    if (state.team) {
      document.getElementById("gate").classList.add("hidden");
      enterPlatform();
    }
  });
})();
