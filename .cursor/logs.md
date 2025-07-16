2025-07-16 chore(repo): initial scaffold – added README, MIT LICENSE, .gitignore, minimal package.json ✓
2025-07-16 feat(extension): added MV3 scaffold manifest.json with permissions and content script mapping ✓
2025-07-16 feat(bg): added background/recorder.ts service worker bootstrap ✓
2025-07-16 feat(content): added DOM injector inject.tsx creates root div ✓
2025-07-16 feat(ui): React mount added in inject.tsx rendering Hello LimitlessMeet ✓
2025-07-16 feat(ui): added Caption component and integrated into RootApp with demo lines ✓
2025-07-16 feat(recorder): implemented tab audio capture via ScriptProcessor, logging chunk sizes ✓
2025-07-16 build: added whisperWorker.ts and integrated worker into background; inject.tsx now displays real transcripts ✓
2025-07-16 feat(summary): added summaryWorker, SummaryPanel UI, integrated aggregation & messaging ✓
2025-07-16 test: added ringBuffer util and unit tests with vitest ✓
2025-07-16 docs: added docs/arch.md documenting end-to-end ASR pipeline ✓
2025-07-16 feat(accessibility): added Ctrl+Alt+C shortcut to toggle captions visibility ✓