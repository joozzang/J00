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
function openModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalTargetImg");

  modalImg.src = src; // 클릭한 이미지 경로를 모달 이미지에 주입
  modal.classList.add("show"); // 모달 띄우기
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";
}

// 모달 닫기
function closeModal() {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalTargetImg");

  modal.classList.remove("show");
  modalImg.classList.remove("zoomed"); // 닫힐 때 확대 상태 리셋
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
}

// 모달 내부 이미지 확대/축소 토글
function toggleZoom(event) {
  event.stopPropagation(); // 이미지 클릭 시 부모(모달 배경)의 close 이벤트가 터지는 것 방지
  const modalImg = event.target;
  modalImg.classList.toggle("zoomed"); // zoomed 클래스를 넣었다 뺐다 함
}
/* ------------------ Dark Mode ------------------ */
document.addEventListener("DOMContentLoaded", () => {
  // 타이핑 효과 (index.html에서만)
  const nameElement = document.getElementById("typing-text");
  if (nameElement) setTimeout(typeText, 500);

  // 다크모드
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
