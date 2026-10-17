const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#primary-navigation");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (menuButton && siteNav) {
  const setMenuOpen = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    siteNav.classList.toggle("is-open", open);
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) setMenuOpen(false);
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-project]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.project !== filter;
    });
  });
});

const dialog = document.querySelector("#figma-dialog");
const previewButton = document.querySelector("[data-preview-figma]");
const closeDialog = document.querySelector("[data-close-dialog]");
const figmaFrame = document.querySelector("[data-figma-frame]");
const figmaEmbed = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fcommunity%2Ffile%2F1689188850955327237%2Ftiffin-box";

if (dialog && previewButton && figmaFrame) {
  previewButton.addEventListener("click", () => {
    figmaFrame.src = figmaEmbed;
    dialog.showModal();
  });

  closeDialog.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (figmaFrame.src) figmaFrame.src = "about:blank";
  });
}

const portraitStage = document.querySelector(".portrait-stage");
const orbitButton = document.querySelector(".orbit-toggle");

if (portraitStage && orbitButton) {
  const updateOrbitControl = () => {
    orbitButton.hidden = reducedMotion.matches;
    if (reducedMotion.matches) portraitStage.classList.add("is-orbit-paused");
    else portraitStage.classList.remove("is-orbit-paused");
  };

  updateOrbitControl();
  reducedMotion.addEventListener?.("change", updateOrbitControl);

  orbitButton.addEventListener("click", () => {
    const paused = portraitStage.classList.toggle("is-orbit-paused");
    orbitButton.setAttribute("aria-pressed", String(paused));
    orbitButton.setAttribute("aria-label", paused ? "Play decorative orbit animation" : "Pause decorative orbit animation");
    orbitButton.querySelector(".sr-only").textContent = paused ? "Play decorative orbit animation" : "Pause decorative orbit animation";
    orbitButton.querySelector("[aria-hidden]").textContent = paused ? "▶" : "Ⅱ";
  });
}

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  document.body.classList.add("has-reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
}

const setScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  document.documentElement.style.setProperty("--progress", progress + "%");
};

let scrollQueued = false;
window.addEventListener("scroll", () => {
  if (scrollQueued) return;
  scrollQueued = true;
  window.requestAnimationFrame(() => {
    setScrollProgress();
    scrollQueued = false;
  });
}, { passive: true });
setScrollProgress();

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

