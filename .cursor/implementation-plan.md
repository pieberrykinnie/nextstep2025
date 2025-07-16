# Implementation Plan – LimitlessMeet

All tasks are broken into atomic steps, each one corresponding to **one Git commit** that follows **Conventional Commits**. After completing a step, record a brief entry in `.cursor/logs.md`, then condense previous logs to keep only key decisions and statuses.

Legend: `[test]` – testing instructions • `[docs]` – documentation updates

---

## 0. Pre-Flight

1. **chore:repo init** – Initialise Git repo, add MIT license, `README.md` seed.  
   [test] `git status` shows clean slate.  
   [docs] Update README purpose.
2. **build:pnpm workspace** – Run `pnpm init && pnpm install -D typescript vite tailwindcss eslint prettier` and commit lockfile.  
   [test] `pnpm ts-node -e "console.log('hello')"` prints.
3. **ci:setup lint & test scripts** – Add lint and test placeholders to `package.json`.  
   [test] `pnpm run lint` exits 0.

---

## 1. Extension Skeleton

4. **feat(extension): manifest v3 scaffold** – Add `extension/manifest.json` with basic permissions (`tabCapture`, `storage`, etc.).  
   [test] Load “unpacked” in Chrome → no errors.
5. **feat(bg): background service worker bootstrap** – Add `background/recorder.ts` printing init message. Build via Vite.  
   [test] Chrome console logs “LimitlessMeet background ready”.
6. **feat(content): DOM injector** – `content/inject.tsx` injects root `div#limitlessmeet`.  
   [test] Inspect meeting page DOM contains root div.
7. **feat(ui): React mount** – Basic React app rendering “Hello LimitlessMeet”.  
   [test] Text visible overlay.
8. **style:tailwind config** – Integrate Tailwind; ensure caption overlay respects high-contrast theme.  
   [test] Tailwind classes compile.

---

## 2. Audio Capture & ASR MVP

9. **feat(recorder): tab audio capture pipeline** – Implement `tabCapture` + `AudioWorklet` buffer.  
   [test] DevTools shows audio chunks length > 0.
10. **build:integrate whisper wasm** – Add quantised `whisper.wasm`, loader util.  
    [test] Worker loads model within 3 s.
11. **feat(asr): real-time transcription loop** – Stream audio → Whisper → console log transcript.  
    [test] Speak; see text printed.
12. **test:unit audio utils** – Jest tests for ring buffer overflow/underflow.  
    [test] `pnpm test` passes.
13. **docs:ASR pipeline** – Document buffer sizes, latency targets in `docs/arch.md`.

---

## 3. Caption Overlay

14. **feat(ui): caption component** – Render scrolling caption region with adjustable font via settings.  
    [test] Toggle font size; CSS updates.
15. **feat(accessibility): keyboard shortcut to toggle captions (Ctrl+Alt+C)**  
    [test] Shortcut shows/hides overlay.
16. **feat(search): timeline scrollback & search box**  ✓
    [test] Type term, highlighted instances appear.
17. **docs:caption usage** – Add to `README.md` & `docs/user-guide.md` ✓

---

## 4. Summariser & NLP

18. **build:add TinyLLAMA wasm worker** – Include model and inference wrapper.  ✓
    [test] Worker returns dummy summary from sample text.
19. **feat(summary): 30 s aggregation push to LLM**  ✓
    [test] Summary panel populates after half-minute.
20. **feat(nlp): action-item regex extractor** – Simple rule-based parse of summary.  ✓
    [test] Strings with "[ ]" tasks listed.
21. **test:nlp** – Unit tests for extractor patterns. ✓
22. **style:summary panel** – Two-panel responsive layout.  ✓
    [test] Resize window / panel persists.

---

## 5. Shortcut & BCI Layer

23. **feat(shortcuts): generic key mapping UI** – Users choose key or HID event.  ✓
    [test] Map “Ctrl+M” to mute; works.
24. **feat(WebHID): blink-board integration stub** – Connect to USB device, log events.  ✓
    [test] Simulated HID sends code triggers action.
25. **docs:BCI API spec** – Describe expected HID report format. ✓
26. **feat(export): Markdown/HTML export** – Button creates file with captions + summary + actions.  ✓
    [test] Download file opens correctly.
27. **feat(storage): session autosave (IndexedDB)**  ✓
    [test] Refresh page; previous transcript loads.
28. **test:integration save/restore** – Playwright script records short meeting, verifies DB entries. ✓
29. **feat(settings): modal with tabs (General, Accessibility, Shortcuts)**  
    [test] Changes persist via `chrome.storage.sync`.

---

## 7. Settings & Theming

30. **feat(theme): high-contrast & dyslexia-friendly fonts**  
    [test] Toggle switches update CSS vars.

---

## 8. Build, CI & Packaging

31. **ci:GitHub Actions build+lint+test** – On push, run `pnpm run lint` & `pnpm test`.  
    [test] PR passes CI.
32. **build:zip artifact** – Script outputs `limitlessmeet.zip` for store upload.  
    [test] Load zip in Edge/Chrome works.

---

## 9. Documentation & Demo

33. **docs:dev setup guide** – `docs/CONTRIBUTING.md` with pnpm, Vite commands.
34. **docs:user guide screenshots** – Alt-text annotated images < 5 added to `docs/` (keeps total ≤10).
35. **docs:architecture diagrams export** – Render `.mmd` to PNG & include.
36. **chore:demo script** – Bash script to launch chromium with flags for hackathon demo.

---

## 10. QA & Release

37. **test:e2e cross-platform** – Manual checklist on Windows, macOS, Linux, Chrome & Firefox.
38. **fix:bug sweep** – Address issues found.
39. **perf:opt audio chunk size** – Reduce latency < 500 ms.
40. **feat:i18n baseline** – Add translation JSON scaffolding.

---

## 11. Deployment & Submission

41. **build:version 0.1.0** – Increment manifest version, changelog entry.  
    [test] Extension ID stable across reloads.
42. **docs:submission readme** – Hackathon-specific deliverables list.
43. **ci:generate release artifact** – Attach zip + docs to GitHub release.

---

## 12. Post-Hackathon Future Work (tracked as GitHub issues)
* Multilingual auto-detect (#1)
* ASL overlay (#2)
* Cloud optional backend (#3)
* Mobile companion (#4)

---

## Testing Summary
* **Unit Tests:** audio utils, NLP extractors (Jest + ts-jest).
* **Component Tests:** React components (Vitest + React Testing Library).
* **End-to-End:** Playwright scripts open Meet page fixture and assert captions overlay.
* **Manual Accessibility:** NVDA + VoiceOver navigation, high-contrast mode.

---

## Documentation Policy
* All user-facing features update **docs/user-guide.md**.
* Any public API or config option documented in **docs/DEV-API.md**.
* Architecture diagrams limited to two PNGs to keep total docs files ≤10.

---

## Logging Protocol
After each commit, append entry to `.cursor/logs.md`:
```
2025-07-16 feat(ui): caption component – implemented scrolling region ✓ manual overlay test pass
```
When log exceeds ~50 lines, condense older entries into a weekly summary block to maintain brevity.