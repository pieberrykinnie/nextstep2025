# Project Proposal: LimitlessMeet

## Solution Name
**LimitlessMeet**

## Overview
LimitlessMeet is an accessibility-focused browser extension designed to make online meetings more inclusive for Deaf/HoH, neurodivergent, and motor-impaired users. It provides real-time, on-device captions, meeting summaries, and action item extraction for video calls, prioritizing privacy, usability, and extensibility.

## Key Features
- **Real-Time Captions:** On-device speech-to-text captions for any video call tab, adjustable for font size, color, and placement.
- **Meeting Summaries:** AI-powered, privacy-preserving meeting summaries and action item extraction using local LLMs.
- **Timeline Scrollback & Search:** Scrollable, searchable caption timeline for reviewing past conversation.
- **Keyboard Shortcuts:** Customizable, accessible key mappings for toggling captions, summaries, and other actions.
- **Assistive Device Input:** WebHID integration for alternative input (e.g., adaptive switches, BCI/EEG devices).
- **Session Autosave:** Automatic saving of captions and summaries to local storage (IndexedDB), with export to Markdown/HTML.
- **Accessibility-First UI:** WCAG-compliant, responsive, and screen reader-friendly interface.

## Tech Stack
- **Frontend:** TypeScript, React, CSS Modules
- **Browser Extension:** Manifest v3, WebExtension APIs
- **Speech-to-Text:** Whisper.cpp WASM (on-device)
- **Summarization/AI:** TinyLLAMA (WASM, local inference)
- **Storage:** IndexedDB (via idb)
- **Testing:** Playwright (integration), Jest (unit)
- **Utilities:** Ring buffer for audio, custom shortcut manager

## Project Structure
```
/cursor
  ├── proposal.md
  ├── implementation-plan.md
  ├── brainstorm.md
  ├── logs.md
/docs
  └── arch.md
/public
/src
  ├── background/         # Service worker, extension logic
  ├── content/            # Content scripts, React mount
  ├── components/         # React UI components (Caption, SummaryPanel, etc.)
  ├── workers/            # WASM workers (Whisper, TinyLLAMA, storage)
  ├── utils/              # Utilities (ring buffer, key mapping, etc.)
  ├── hooks/              # Custom React hooks
  ├── styles/             # CSS modules
  └── types/              # TypeScript types
/tests
  ├── unit/
  └── integration/
```

## Architecture Diagram
```
[Browser Tab Audio]
      │
      ▼
[Content Script] ──► [Whisper WASM Worker] ──► [Captions UI]
      │                                 │
      │                                 └─► [Summary Worker (TinyLLAMA)] ──► [SummaryPanel]
      │
      └─► [Storage Worker] ◄───────────────┘
      │
      └─► [Assistive Device Input (WebHID)]
```

## Future Improvements
- **Multilingual Support:** Expand to support more languages and dialects.
- **Cloud Sync (Opt-In):** Secure, encrypted sync for cross-device access.
- **Advanced Action Item Extraction:** Integrate more powerful LLMs as they become available.
- **Third-Party Integrations:** Export to calendar, task managers, or accessibility tools.
- **Mobile Browser Support:** Extend to mobile browsers and PWA.
- **Community Plugin System:** Allow user-contributed accessibility modules.
- **Live Translation:** Real-time translation for multilingual meetings.

---

This proposal is based on extensive research and brainstorming, with a focus on addressing real accessibility gaps in online communication. LimitlessMeet aims to set a new standard for privacy, inclusivity, and user empowerment in virtual meetings.