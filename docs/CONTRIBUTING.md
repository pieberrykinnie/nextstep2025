# Contributing to LimitlessMeet

Thank you for your interest in contributing to LimitlessMeet! This guide will help you get started with development.

## Prerequisites

- Node.js 18+ 
- pnpm 8+
- Chrome/Edge browser for testing

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd limitlessmeet
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the extension**
   ```bash
   pnpm run build
   ```

4. **Load in Chrome/Edge**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` directory

## Development Commands

```bash
# Start development server (for UI components)
pnpm run dev

# Build extension for production
pnpm run build

# Run linting
pnpm run lint

# Run tests
pnpm test

# Create zip package for store upload
pnpm run zip
```

## Project Structure

```
limitlessmeet/
├── extension/           # Extension source code
│   ├── manifest.json   # Extension manifest
│   ├── background/     # Service worker
│   ├── content/        # Content scripts
│   ├── ui/            # React components
│   └── workers/       # Web Workers (WASM)
├── docs/              # Documentation
├── scripts/           # Build scripts
├── tests/             # Test files
└── dist/              # Built extension (generated)
```

## Architecture

- **Background Service Worker**: Handles audio capture and ASR pipeline
- **Content Scripts**: Inject React UI into meeting pages
- **Web Workers**: Run WASM modules (Whisper, TinyLLAMA) off-main-thread
- **React Components**: Caption overlay, summary panel, settings modal

## Testing

### Unit Tests
```bash
pnpm test
```

### Integration Tests
```bash
pnpm test:e2e
```

### Manual Testing
1. Load extension in Chrome
2. Navigate to a video call (Zoom, Meet, Teams)
3. Verify captions appear and settings work

## Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use conventional commits for git messages
- Write tests for new features

## Accessibility Guidelines

- All UI components must be keyboard navigable
- Use semantic HTML and ARIA labels
- Test with screen readers (NVDA, VoiceOver)
- Support high-contrast themes
- Provide alternative input methods

## Security

- No audio data leaves the device
- All processing happens locally via WASM
- Use chrome.storage.sync for settings only
- Validate all user inputs

## Submitting Changes

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Run linting and tests
5. Submit a pull request

## Questions?

Feel free to open an issue or reach out to the maintainers!