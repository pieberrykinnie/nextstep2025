// extension/content/inject.tsx
// Injects the LimitlessMeet root container into the page

const ROOT_ID = "limitlessmeet-root";

function ensureRoot() {
  if (document.getElementById(ROOT_ID)) return;
  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.style.all = "initial"; // isolate basics
  document.documentElement.appendChild(root);
  console.debug("[LimitlessMeet] root injected");
}

ensureRoot();

// Example ping to background
chrome.runtime.sendMessage({ ping: "hello" }, (resp) => {
  console.debug("[LimitlessMeet] background replied", resp);
});