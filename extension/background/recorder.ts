// extension/background/recorder.ts
// Purpose: service worker entrypoint for LimitlessMeet.
// Logs activation and prepares message channel plumbing.

console.info("[LimitlessMeet] background service worker bootstrapped");

// Listen for install / activate events (MV3 service workers are persistent while active).
self.addEventListener("activate", () => {
  console.info("[LimitlessMeet] activated");
  // future initialisation tasks here
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.ping === "hello") {
    sendResponse({ pong: "world" });
  }
});