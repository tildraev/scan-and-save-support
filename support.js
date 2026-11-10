"use strict";

(() => {
  const input = document.getElementById("help-search");
  if (!input) return;
  const sections = [...document.querySelectorAll(".help-section")];
  const status = document.getElementById("search-status");
  const empty = document.getElementById("no-results");
  const initialOpen = new Map();
  input.disabled = false;

  function filterHelp() {
    const query = input.value.trim().toLocaleLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    let matches = 0;
    for (const section of sections) {
      let visible = 0;
      for (const detail of section.querySelectorAll("details")) {
        const text = `${section.dataset.topic} ${detail.textContent}`.toLocaleLowerCase();
        const match = words.every(word => text.includes(word));
        detail.hidden = !match;
        if (query) {
          if (!initialOpen.has(detail)) initialOpen.set(detail, detail.open);
          detail.open = match;
        } else if (initialOpen.has(detail)) {
          detail.open = initialOpen.get(detail);
          initialOpen.delete(detail);
        }
        if (match) visible++;
      }
      section.hidden = visible === 0;
      matches += visible;
    }
    status.hidden = !query;
    status.textContent = matches === 1 ? "1 matching answer" : `${matches} matching answers`;
    empty.hidden = !query || matches > 0;
  }

  input.addEventListener("input", filterHelp);
  document.getElementById("clear-search").addEventListener("click", () => {
    input.value = "";
    filterHelp();
    input.focus();
  });
  // Topic links always reveal their guide, even after a search hid it.
  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", () => {
      const target = document.getElementById(link.getAttribute("href").slice(1));
      if (target && target.classList.contains("help-section") && input.value) {
        input.value = "";
        filterHelp();
      }
    });
  });
})();
