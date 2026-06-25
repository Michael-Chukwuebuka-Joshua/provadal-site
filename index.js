// ─── Element references ───────────────────────────────────────────────────────
const header = document.querySelector(".header");
const menuBtn = document.querySelector(".menu-btn");
const menuContent = document.querySelector(".menu-content");
const menuIcon = document.querySelector(".menu-icon");
const menuOverlay = document.querySelector(".menu-overlay");
const navMenu = document.querySelector(".nav-menu"); // needed for aria-hidden
const themeToggle = document.querySelector(".toggle-btn");
const target = document.getElementById("typed-word");

// ─── Typewriter ───────────────────────────────────────────────────────────────
const words = ["Private.", "Sovereign.", "Local.", "Unstoppable."];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const currentWord = words[wordIndex];

  if (!deleting) {
    target.textContent = currentWord.slice(0, charIndex++);

    if (charIndex > currentWord.length) {
      deleting = true;
      setTimeout(type, 1500);
      return;
    }
  } else {
    target.textContent = currentWord.slice(0, charIndex--);

    if (charIndex < 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      charIndex = 0;
      target.textContent = "";
    }
  }

  setTimeout(type, deleting ? 50 : 100);
}

type();

// ─── Mobile menu ──────────────────────────────────────────────────────────────
// Centralising open/close into named functions means aria attributes, classes,
// and any future side-effects (focus management, scroll-lock, etc.) only need
// to be updated in one place.

function openMenu() {
  menuContent.classList.add("show");
  menuIcon.classList.add("open");
  menuBtn.classList.add("show");
  menuOverlay.classList.add("show");
  menuBtn.setAttribute("aria-expanded", "true");
  navMenu.setAttribute("aria-hidden", "false");
}

function closeMenu() {
  menuContent.classList.remove("show");
  menuIcon.classList.remove("open");
  menuBtn.classList.remove("show");
  menuOverlay.classList.remove("show");
  menuBtn.setAttribute("aria-expanded", "false");
  navMenu.setAttribute("aria-hidden", "true");
}

menuBtn.addEventListener("click", () => {
  menuContent.classList.contains("show") ? closeMenu() : openMenu();
});

// Close when clicking outside the menu
document.addEventListener("click", (e) => {
  const menuIsOpen = menuContent.classList.contains("show");
  const clickedInsideMenu = menuContent.contains(e.target);
  const clickedMenuButton = menuBtn.contains(e.target);

  if (menuIsOpen && !clickedInsideMenu && !clickedMenuButton) {
    closeMenu();
  }
});

// ─── Header hide-on-scroll ────────────────────────────────────────────────────
let lastScrollY = window.scrollY;
const scrollThreshold = 10;
let isAnchorScrolling = false;

// Temporarily pin the header while smooth-scrolling to an anchor section
// so it doesn't hide mid-scroll. The scroll listener is paused via the flag.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    isAnchorScrolling = true;
    header.style.position = "sticky";
    header.style.top = "0";
    header.style.zIndex = "100";

    window.addEventListener(
      "scrollend",
      () => {
        header.style.position = "";
        header.style.top = "";
        header.style.zIndex = "";
        header.classList.remove("hide");
        lastScrollY = window.scrollY; // sync so the next real scroll starts clean
        isAnchorScrolling = false;

        // If a nav link was clicked while the menu was open, close it on arrival
        if (menuContent.classList.contains("show")) closeMenu();
      },
      { once: true },
    );
  });
});

window.addEventListener("scroll", () => {
  if (isAnchorScrolling) return;

  const currentScrollY = window.scrollY;

  if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) return;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollY = currentScrollY;
});

// ─── Theme toggle ─────────────────────────────────────────────────────────────
const savedTheme = localStorage.getItem("theme");

// Restore persisted preference and reflect it in aria-pressed on page load
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.setAttribute("aria-pressed", String(savedTheme === "dark"));
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToggle.setAttribute("aria-pressed", String(!isDark));
});
