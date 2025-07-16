2025-07-16 chore(repo): initial scaffold – added README, MIT LICENSE, .gitignore, minimal package.json ✓
2025-07-16 feat(extension): added MV3 scaffold manifest.json with permissions and content script mapping ✓
2025-07-16 feat(bg): added background/recorder.ts service worker bootstrap ✓
2025-07-16 feat(content): added DOM injector inject.tsx creates root div ✓
2025-07-16 feat(ui): React mount added in inject.tsx rendering Hello LimitlessMeet ✓
2025-07-16 feat(ui): added Caption component and integrated into RootApp with demo lines ✓
2025-07-16 feat(recorder): implemented tab audio capture via ScriptProcessor, logging chunk sizes ✓
2025-07-16 build:added whisperWorker.ts and integrated worker into background; inject.tsx now displays real transcripts ✓
2025-07-16 feat(summary): added summaryWorker, SummaryPanel UI, integrated aggregation & messaging ✓
2025-07-16 feat(summary): 30s aggregation push to LLM – summaryWorker now buffers lines and sends to TinyLLAMA worker every 30s ✓
2025-07-16 test: added ringBuffer util and unit tests with vitest ✓
2025-07-16 docs: added docs/arch.md documenting end-to-end ASR pipeline ✓
2025-07-16 feat(accessibility): added Ctrl+Alt+C shortcut to toggle captions visibility ✓
2025-07-16 feat(search): timeline scrollback & search box – added scrollable caption timeline with real-time search, keyboard navigation, and accessibility ✓
2025-07-16 docs:caption usage – documented timeline scrollback & search in README and arch.md ✓
2025-07-16 build:add TinyLLAMA wasm worker – scaffolded tinyllamaWorker.ts with init/summarize messages, ready for model integration ✓
2025-07-16 feat(nlp): action-item regex extractor – TinyLLAMA worker now extracts '[ ]' tasks as action items ✓
2025-07-16 test:nlp – unit tests for action-item extractor patterns pass ✓
2025-07-16 style:summary panel – refactored to two-panel responsive layout, accessible and resizable ✓
2025-07-16 feat(shortcuts): generic key mapping UI – added ShortcutModal, persistent mappings, and demo shortcut actions ✓
2025-07-16 feat(WebHID): blink-board integration stub – added Connect HID Device button, logs device info or error ✓
2025-07-16 docs:BCI API spec – documented expected HID report format and WebHID usage in arch.md ✓
2025-07-16 feat(export): Markdown/HTML export – added export button to SummaryPanel, downloads meeting data as .md file ✓
2025-07-16 feat(storage): session autosave – added IndexedDB storage worker, loads previous session and auto-saves every 30s ✓
2025-07-16 test:integration save/restore – added Playwright tests for session save/restore functionality ✓
2025-07-16 feat(settings): added SettingsModal with General, Accessibility, and Shortcuts tabs, chrome.storage.sync persistence, and UI integration ✓
2025-07-16 build:fixed Vite config and mock WASM import for successful extension build ✓
2025-07-16 feat(theme): implemented high-contrast and dyslexia-friendly font toggles, Caption now responds to accessibility settings ✓