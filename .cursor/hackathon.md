# NextStep Hacks 2025 – LimitlessMeet Submission

## Project Name
**LimitlessMeet – Inclusive Meeting Co-Pilot**

## Purpose
LimitlessMeet is an accessibility-focused browser extension designed for the NextStep Hacks 2025 hackathon. Its mission is to make online meetings more inclusive for:
- Deaf/Hard-of-Hearing (HoH) users
- Neurodivergent users
- Motor-impaired users
- Anyone who benefits from real-time captions, summaries, and accessible controls

## Key Features
- **Real-time, on-device captions** (using Whisper.cpp WASM)
- **Timeline scrollback & search** for captions (accessible, keyboard navigable)
- **Meeting summary panel** (periodic summarization with TinyLLAMA)
- **Action item extraction** (regex and LLM-based)
- **Export to Markdown/HTML** (captions, summary, actions)
- **Session autosave & restore** (IndexedDB)
- **Keyboard shortcut mapping UI** (customizable, persistent)
- **WebHID integration stub** (for BCI/blink-board/assistive device input)
- **Settings modal** (General, Accessibility, Shortcuts)
- **High-contrast & dyslexia-friendly theming**
- **Strict accessibility and security best practices**

## Target Users
- Deaf/HoH individuals
- Neurodivergent users (e.g., ADHD, autism)
- Motor-impaired users (e.g., those using assistive devices)
- Anyone seeking more accessible, actionable meeting experiences

## Tech Stack
- **TypeScript**
- **React**
- **WebExtension APIs** (Manifest v3)
- **Whisper.cpp WASM** (on-device ASR)
- **TinyLLAMA** (WASM summarization)
- **IndexedDB** (session storage)
- **Playwright, Vitest** (testing)
- **Tailwind CSS** (theming)

## Accessibility Focus
- Keyboard navigation for all features
- ARIA roles, visible focus, and semantic HTML
- High-contrast and dyslexia-friendly options
- Designed for compatibility with screen readers and assistive tech
- WebHID support for BCI/blink-board input (future work)

## Project Structure
- `extension/` – Main extension code (UI, background, content, workers)
- `tests/` – Unit and integration tests
- `docs/` – Architecture and user documentation
- `.cursor/` – Project management, logs, and hackathon deliverables

## Documentation & Logging
- All features and progress are logged in `.cursor/logs.md`
- Implementation plan and proposal in `.cursor/implementation-plan.md` and `.cursor/proposal.md`
- Architecture and accessibility details in `docs/arch.md`

## Future Improvements
- Multilingual auto-detect
- ASL overlay
- Cloud optional backend
- Mobile companion app

---

*This file summarizes the LimitlessMeet project for the NextStep Hacks 2025 hackathon, including its accessibility mission, features, and technical approach.*