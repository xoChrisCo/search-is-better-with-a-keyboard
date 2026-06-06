const RESULT_SELECTOR = "#rso h3 a";

function getResults() {
  return Array.from(document.querySelectorAll(RESULT_SELECTOR));
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
      focusAt(results, 0);
      return;
    }
    if (currentIndex < results.length - 1) {
      e.preventDefault();
      focusAt(results, currentIndex + 1);
    }
    return;
  }

  if (key === "Tab" && e.shiftKey) {
    if (onResult && currentIndex > 0) {
      e.preventDefault();
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
});
