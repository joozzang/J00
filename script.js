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

/* ------------------ Modal Open/Close ------------------ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("show");

    // 아코디언 다시 초기화
    initAccordions(modal);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("show");

    const projectModals = [
      "proj1DetailModal",
      "proj2DetailModal",
      "proj3DetailModal",
    ];
    if (projectModals.includes(id)) {
      openModal("projectsModal");
    }
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("show");
    });
  }
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });
});

/* ------------------ Theme Toggle ------------------ */

const toggleBtn = document.getElementById("theme-toggle");

function updateIconImagesForTheme(isDark) {
  const icons = document.querySelectorAll(".icon-img");
  icons.forEach((img) => {
    const newSrc = isDark ? img.dataset.dark : img.dataset.light;
    if (newSrc) img.src = newSrc;
  });
}

toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  updateIconImagesForTheme(isDark);
});

window.addEventListener("DOMContentLoaded", () => {
  const isDark = document.body.classList.contains("dark-mode");
  updateIconImagesForTheme(isDark);
});

/* ------------------ Accordion ------------------ */
function initAccordions(scope = document) {
  const accordions = scope.querySelectorAll(".accordion");
  accordions.forEach((acc) => {
    // 중복 방지: 이미 이벤트가 있으면 패스
    if (acc.dataset.initialized === "true") return;
    acc.dataset.initialized = "true";

    acc.addEventListener("click", function () {
      this.classList.toggle("active");
      const panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.classList.remove("open");
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.classList.add("open");
      }
    });
  });
}

/* ------------------ Project Section ------------------ */
const projectCards = document.querySelectorAll(".project-card");
const detailBtn = document.getElementById("project-detail-btn");
const instructionText = document.getElementById("project-instruction");

let selectedProjectIndex = -1;

const descriptions = [
  "🍊 제주 맞춤 여행<br>AI 추천 플랫폼",
  "📖 이민자를 위한<br>한국 법률 번역 챗봇",
  "✏️ 난독증 아동을 위한 <br>AI 동화책 생성<br>학습 플랫폼",
];

projectCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    selectedProjectIndex = selectedProjectIndex === index ? -1 : index;
    updateCardStates();
  });
});

function updateCardStates() {
  projectCards.forEach((card, index) => {
    const descDiv = card.querySelector(".project-description-inline");
    if (index === selectedProjectIndex) {
      card.classList.add("active");
      card.style.opacity = "1";
      descDiv.innerHTML = descriptions[index].replace(/\n/g, "<br>");
    } else {
      card.classList.remove("active");
      card.style.opacity = "1";
      descDiv.innerHTML = "";
    }
  });
  instructionText.style.display =
    selectedProjectIndex === -1 ? "block" : "none";
  detailBtn.style.display = selectedProjectIndex === -1 ? "none" : "block";
}

detailBtn.addEventListener("click", () => {
  if (selectedProjectIndex === -1) return;
  const projectIds = [
    "proj1DetailModal",
    "proj2DetailModal",
    "proj3DetailModal",
  ];
  const targetModalId = projectIds[selectedProjectIndex];
  closeModal("projectsModal");
  openModal(targetModalId);
});

/* ------------------ Slide Navigation (Multi Modal) ------------------ */ function setupSlideNavigation(
  modalId,
  prevId,
  nextId,
  slideClass,
  socialSlideId = null,
) {
  const modal = document.getElementById(modalId);
  const slides = modal.querySelectorAll(slideClass);
  const nextButton = modal.querySelector(`#${nextId}`);
  const prevButton = modal.querySelector(`#${prevId}`);
  const linkIcons = modal.querySelector(".link-icons");
  let currentSlide = 0;

  function updateButtons() {
    if (!prevButton || !nextButton) return;
    prevButton.style.display = currentSlide === 0 ? "none" : "block";
    nextButton.style.display =
      currentSlide === slides.length - 1 ? "none" : "block";
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
    });
    const target = slides[index];
    if (target) {
      target.classList.add("active");

      // ✅ 해당 슬라이드 내부 accordion 다시 init
      initAccordions(target);

      // ✅ 소셜 아이콘은 특정 페이지에서만 보이게
      if (linkIcons && socialSlideId) {
        linkIcons.style.display = target.id === socialSlideId ? "flex" : "none";
      }
    }

    updateButtons();
  }

  if (nextButton && prevButton) {
    nextButton.addEventListener("click", () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
      }
    });

    prevButton.addEventListener("click", () => {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
      }
    });
  }

  showSlide(currentSlide);
}

setupSlideNavigation(
  "proj1DetailModal",
  "jejuPrevButton",
  "jejuNextButton",
  ".slide",
  "jejuPage1",
);
setupSlideNavigation(
  "proj2DetailModal",
  "lawprevButton",
  "lawnextButton",
  ".slide",
  "lawpage1",
);
setupSlideNavigation(
  "proj3DetailModal",
  "prevButton",
  "nextButton",
  ".slide",
  "page1",
);

/* ------------------ Image Sliders ------------------ */
function setupImageSlider(modalId, imagePrefix) {
  const modal = document.getElementById(modalId);
  const imageSlides = modal.querySelectorAll(".image-slide");
  const prevImageBtn = modal.querySelector(`#${imagePrefix}prevImageBtn`);
  const nextImageBtn = modal.querySelector(`#${imagePrefix}nextImageBtn`);
  const pageImageNumber = modal.querySelector(`#${imagePrefix}pageImageNumber`);
  const toggleSlideBtn = modal.querySelector(`#${imagePrefix}toggleSlideBtn`);

  let currentImage = 0;
  let autoSlideInterval;

  function showImageSlide(index) {
    imageSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    if (pageImageNumber)
      pageImageNumber.textContent = `${currentImage + 1}/${imageSlides.length}`;
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentImage = (currentImage + 1) % imageSlides.length;
      showImageSlide(currentImage);
    }, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  if (toggleSlideBtn) {
    toggleSlideBtn.addEventListener("click", () => {
      if (autoSlideInterval) {
        stopAutoSlide();
        toggleSlideBtn.textContent = "▶️";
        autoSlideInterval = null;
      } else {
        startAutoSlide();
        toggleSlideBtn.textContent = "⏸️";
      }
    });
  }

  if (nextImageBtn) {
    nextImageBtn.addEventListener("click", () => {
      currentImage = (currentImage + 1) % imageSlides.length;
      showImageSlide(currentImage);
    });
  }

  if (prevImageBtn) {
    prevImageBtn.addEventListener("click", () => {
      currentImage =
        (currentImage - 1 + imageSlides.length) % imageSlides.length;
      showImageSlide(currentImage);
    });
  }

  showImageSlide(currentImage);
  startAutoSlide();
}

setupImageSlider("proj1DetailModal", "jeju");
setupImageSlider("proj2DetailModal", "law");
setupImageSlider("proj3DetailModal", "");

/* ------------------ Tab Section ------------------ */
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabGroup = button.closest(".tab-container");
    const buttonsInGroup = tabGroup.querySelectorAll(".tab-button");
    const contentsInGroup = tabGroup.querySelectorAll(".tab-content");

    buttonsInGroup.forEach((btn) => btn.classList.remove("active"));
    contentsInGroup.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    const targetTab = button.getAttribute("data-tab");
    tabGroup.querySelector(`#${targetTab}`).classList.add("active");
  });
});

document.querySelectorAll(".tab-button").forEach((btn) => {
  const text = btn.textContent.trim();
  const icon = text.slice(0, 2); // 이모지 한 개는 보통 2글자
  const label = text.slice(2).trim();

  btn.innerHTML = `
    <span class="icon">${icon}</span>
    <span class="label">${label}</span>
  `;
});

/* ------------------ Inner Accordion ------------------ */
const innerAccordions = document.querySelectorAll(".inner-accordion");
innerAccordions.forEach((btn) => {
  btn.addEventListener("click", function () {
    this.classList.toggle("active");
    const panel = this.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});

/* ------------------ Scroll Spacer Toggle ------------------ */
const accordionButtons = document.querySelectorAll(
  ".accordion, .inner-accordion",
);

accordionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimeout(() => {
      const anyOpen = document.querySelector(
        ".panel.open, .inner-panel[style*='block']",
      );
      const currentSlide = btn.closest(".slide");
      const spacer = currentSlide?.querySelector(".scroll-spacer");
      if (anyOpen && spacer) {
        spacer.style.display = "block";
        currentSlide.classList.add("scroll-expanded");
      } else if (spacer) {
        spacer.style.display = "none";
        currentSlide.classList.remove("scroll-expanded");
      }
    }, 300);
  });
});

const openProblemModalButtons = document.querySelectorAll(
  ".open-problem-modal",
);
const closeProblemModalButtons = document.querySelectorAll(
  ".problem-modal-close",
);
const projectModal = document.getElementById("proj3DetailModal");

openProblemModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-target");
    const modal = document.getElementById(target);

    if (modal) {
      modal.classList.add("show");
    }
  });
});

closeProblemModalButtons.forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    const modal = closeBtn.closest(".problem-modal");

    if (modal) {
      modal.classList.remove("show");
    }
  });
});

window.addEventListener("click", (e) => {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (e.target === modal) {
      modal.classList.remove("show");

      const projectModals = [
        "proj1DetailModal",
        "proj2DetailModal",
        "proj3DetailModal",
      ];
      if (projectModals.includes(modal.id)) {
        openModal("projectsModal");
      }
      if (
        modal.id === "microModal" ||
        modal.id === "oledModal" ||
        modal.id === "howModal"
      ) {
        openModal("experienceModal");
      }
    }
  });
  const modals = document.querySelectorAll(".problem-modal");
  modals.forEach((modal) => {
    if (e.target === modal) {
      modal.classList.remove("show");

      if (projectModal) {
        projectModal.classList.add("show");
      }
    }
  });
});
if (window.innerWidth <= 768) {
  document.querySelectorAll(".panel br").forEach((br) => br.remove());
}
document.getElementById("openImageModalBtn").addEventListener("click", () => {
  window.open(
    "https://www.canva.com/design/DAGlMSJ5xeg/2PVKRreWPLVpfWLJmbnX6w/view?utm_content=DAGlMSJ5xeg&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hd4436208f9",
    "_blank",
  );
});
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
