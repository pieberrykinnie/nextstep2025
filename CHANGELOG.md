# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-16

### Added
- **Real-time captions**: On-device speech-to-text using Whisper WASM
- **Meeting summaries**: AI-powered summaries and action item extraction
- **Timeline scrollback**: Searchable caption history with keyboard navigation
- **Keyboard shortcuts**: Customizable shortcuts for accessibility (Ctrl+Alt+C to toggle captions)
- **Settings modal**: Comprehensive settings with General, Accessibility, and Shortcuts tabs
- **High-contrast themes**: Accessibility-first theming with dyslexia-friendly fonts
- **Session autosave**: Automatic saving to IndexedDB with export to Markdown/HTML
- **WebHID integration**: Support for assistive devices and BCI input
- **Export functionality**: Download meeting data as Markdown files
- **Responsive UI**: Two-panel layout for captions and summaries

### Technical Features
- Manifest v3 browser extension
- React-based UI components
- WebAssembly workers for on-device processing
- Chrome storage sync for settings persistence
- TypeScript throughout
- Comprehensive testing with Playwright

### Accessibility
- WCAG-compliant interface
- Screen reader support
- Keyboard navigation
- High-contrast mode
- Dyslexia-friendly fonts
- Alternative input methods

### Security & Privacy
- All processing happens locally
- No audio data leaves the device
- Privacy-preserving design
- Open source and auditable

---

## NextStep Hacks 2025 Submission

This release represents the initial prototype for the NextStep Hacks 2025 hackathon, focusing on making online meetings more accessible for Deaf/HoH, neurodivergent, and motor-impaired users.

### Hackathon Features
- **Limitless theme alignment**: Removes accessibility barriers in communication
- **Future of Work focus**: Reimagines inclusive collaboration tools
- **Privacy-first**: No cloud dependencies, all processing on-device
- **Extensible architecture**: Ready for future enhancements

### Demo Instructions
1. Load extension in Chrome/Edge
2. Navigate to any video call (Zoom, Meet, Teams)
3. Press Ctrl+Alt+C to toggle captions
4. Use Settings button to configure accessibility options
5. Export meeting data via Summary panel