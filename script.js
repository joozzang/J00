/* ------------------ Typing Effect ------------------ */
const text = "JOO GA YEONG";
let index = 0;

function typeText() {
  const nameElement = document.getElementById("typing-text");
  if (index < text.length) {
    nameElement.textContent += text[index++];
    setTimeout(typeText, 150);
  } else {
    nameElement.classList.add("no-cursor");
    setTimeout(() => {
      document.querySelector(".container").classList.add("show-nav");
    }, 1000);
  }
}

window.onload = () => {
  setTimeout(typeText, 500);
};

// ------------------ Star Effect ------------------
const cv = document.getElementById("cc");
const cx = cv.getContext("2d");
let W, H;

function resize() {
  W = cv.width = cv.offsetWidth;
  H = cv.height = cv.offsetHeight;
}
resize();
window.addEventListener("resize", resize);

function rand(a, b) {
  return a + Math.random() * (b - a);
}

const SHAPES = [
  {
    // 오리온
    nodes: [
      [0, -1],
      [0.5, -0.7],
      [0.25, -0.2],
      [-0.25, -0.2],
      [0.35, 0.15],
      [0, 0.2],
      [-0.35, 0.15],
      [0.45, 0.7],
      [-0.45, 0.7],
    ],
    edges: [
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 6],
      [4, 5],
      [5, 6],
      [4, 7],
      [6, 8],
      [2, 3],
    ],
  },
  {
    // 북두칠성
    nodes: [
      [0, 0],
      [0.3, -0.15],
      [0.6, -0.1],
      [0.9, 0],
      [0.95, 0.35],
      [0.65, 0.5],
      [0.3, 0.45],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 3],
    ],
  },
  {
    // 카시오페이아
    nodes: [
      [-1, 0.3],
      [-0.5, -0.3],
      [0, 0.2],
      [0.5, -0.3],
      [1, 0.3],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    // 남십자성
    nodes: [
      [0, -1],
      [0, 1],
      [-0.7, 0],
      [0.7, 0],
      [0.4, -0.5],
    ],
    edges: [
      [0, 1],
      [2, 3],
      [0, 4],
    ],
  },
  {
    // 사자자리
    nodes: [
      [0, -0.8],
      [0.3, -0.4],
      [0.15, 0],
      [-0.3, 0.1],
      [-0.6, -0.2],
      [-0.5, -0.7],
      [0, -0.8],
      [0.8, 0.5],
      [0.5, 0.9],
      [0.15, 0],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [2, 7],
      [7, 8],
      [8, 9],
    ],
  },
  {
    // 전갈자리
    nodes: [
      [0, -1],
      [0.2, -0.6],
      [0.1, -0.2],
      [-0.1, 0.2],
      [-0.2, 0.6],
      [0, 0.9],
      [0.25, 1],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
];

const active = [];
const MAX_ACTIVE = 4;

function spawnConstellation() {
  if (active.length >= MAX_ACTIVE) return;
  const shape = SHAPES[Math.floor(rand(0, SHAPES.length))];
  const scale = rand(55, 100);
  const cx0 = rand(scale + 20, W - scale - 20);
  const cy0 = rand(scale + 20, H - scale - 20);
  const rot = rand(0, Math.PI * 2);
  const cos = Math.cos(rot),
    sin = Math.sin(rot);

  const nodes = shape.nodes.map(([nx, ny]) => ({
    x: cx0 + (nx * cos - ny * sin) * scale,
    y: cy0 + (nx * sin + ny * cos) * scale,
    r: Math.pow(Math.random(), 2) * 2 + 1.2,
    tint: 200 + Math.random() * 55,
    opacity: 0,
  }));

  const edges = shape.edges.map((e, i) => ({
    from: e[0],
    to: e[1],
    progress: 0,
    opacity: 0,
    phase: "wait",
    delay: i * 320 + rand(0, 120),
  }));

  active.push({
    nodes,
    edges,
    born: performance.now(),
    phase: "appearing",
    holdDuration: rand(4000, 7000),
    holdStart: 0,
    fadeStart: 0,
    globalOpacity: 0,
  });
}

setTimeout(() => spawnConstellation(), 100);
setTimeout(() => spawnConstellation(), 2000);
setInterval(() => spawnConstellation(), 2500);

function animate(ts) {
  cx.clearRect(0, 0, W, H);

  for (let ci = active.length - 1; ci >= 0; ci--) {
    const c = active[ci];
    const age = ts - c.born;

    if (c.phase === "appearing") {
      c.globalOpacity = Math.min(age / 500, 1);
      if (age > 500 && !c.holdStart) c.holdStart = ts;
      if (c.holdStart && ts - c.holdStart > c.holdDuration) {
        c.phase = "fading";
        c.fadeStart = ts;
      }
    } else if (c.phase === "fading") {
      c.globalOpacity = 1 - (ts - c.fadeStart) / 1200;
      if (c.globalOpacity <= 0) {
        active.splice(ci, 1);
        continue;
      }
    }

    const go = c.globalOpacity;

    // 선 먼저
    for (const e of c.edges) {
      const ea = age - e.delay;
      if (ea < 0) continue;
      if (e.phase === "wait") e.phase = "drawing";
      if (e.phase === "drawing") {
        e.progress = Math.min(ea / 600, 1);
        e.opacity = Math.min(ea / 100, 1);
        if (e.progress >= 1) e.phase = "done";
      }

      const n1 = c.nodes[e.from],
        n2 = c.nodes[e.to];
      const ex = n1.x + (n2.x - n1.x) * e.progress;
      const ey = n1.y + (n2.y - n1.y) * e.progress;

      cx.beginPath();
      cx.moveTo(n1.x, n1.y);
      cx.lineTo(ex, ey);
      cx.strokeStyle = `rgba(100,180,255,${go * e.opacity * 0.8})`;
      cx.lineWidth = 2;
      cx.stroke();
    }

    // 점
    for (let i = 0; i < c.nodes.length; i++) {
      const n = c.nodes[i];
      const na = age - i * 160;
      if (na < 0) continue;
      n.opacity = Math.min(na / 220, 1);

      cx.beginPath();
      cx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(180,220,255,${go * n.opacity})`;
      cx.fill();
      if (n.r > 2) {
        cx.beginPath();

        const len = n.r * 2.5;

        // 가로
        cx.moveTo(n.x - len, n.y);
        cx.lineTo(n.x + len, n.y);

        // 세로
        cx.moveTo(n.x, n.y - len);
        cx.lineTo(n.x, n.y + len);

        cx.strokeStyle = `rgba(255,255,255,${go * n.opacity * 0.7})`;
        cx.lineWidth = 0.6;
        cx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
