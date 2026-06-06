const RESULT_SELECTOR = "#search a:has(h3)";

const style = document.createElement("style");
style.textContent = `
  #search a:focus,
  #search a:focus-visible {
    outline: 3px solid #1a73e8 !important;
    outline-offset: 2px !important;
    border-radius: 4px;
    background-color: rgba(26, 115, 232, 0.08) !important;
  }
`;
document.documentElement.appendChild(style);

function isVisible(el) {
  if (!el.isConnected) return false;
  if (el.closest("[inert]")) return false;
  if (el.offsetParent === null) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed") return false;
    if (cs.display === "none" || cs.visibility === "hidden") return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getResults() {
  return Array.from(document.querySelectorAll(RESULT_SELECTOR)).filter(isVisible);
}

function focusAt(results, index) {
  const target = results[index];
  if (target) target.focus();
}

document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  const key = e.key;
  if (key !== "Tab" && key !== "ArrowDown" && key !== "ArrowUp") return;

  const results = getResults();
  if (results.length === 0) return;

  const currentIndex = results.indexOf(document.activeElement);
  const onResult = currentIndex !== -1;

  if (key === "Tab" && !e.shiftKey) {
    if (!onResult) {
      e.preventDefault();
      e.stopImmediatePropagation();
      focusAt(results, 0);
      return;
    }
    if (currentIndex < results.length - 1) {
      e.preventDefault();
      e.stopImmediatePropagation();
      focusAt(results, currentIndex + 1);
    }
    return;
  }

  if (key === "Tab" && e.shiftKey) {
    if (onResult && currentIndex > 0) {
      e.preventDefault();
      e.stopImmediatePropagation();
      focusAt(results, currentIndex - 1);
    }
    return;
  }

  if (key === "ArrowDown" && onResult) {
    e.preventDefault();
    focusAt(results, Math.min(currentIndex + 1, results.length - 1));
    return;
  }

  if (key === "ArrowUp" && onResult) {
    e.preventDefault();
    focusAt(results, Math.max(currentIndex - 1, 0));
    return;
  }
}, true);
