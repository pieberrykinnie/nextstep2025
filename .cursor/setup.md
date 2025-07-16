# LimitlessMeet Setup Guidelines

## Development Environment Setup

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm 8+** - `npm install -g pnpm`
- **Chrome/Edge** - For extension testing
- **Git** - Version control

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd limitlessmeet

# Install dependencies
pnpm install

# Build extension
pnpm run build

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the `dist/` directory
```

## Project Structure

```
limitlessmeet/
├── extension/           # Extension source
│   ├── manifest.json   # Extension manifest
│   ├── background/     # Service worker
│   ├── content/        # Content scripts
│   ├── ui/            # React components
│   └── workers/       # Web Workers
├── docs/              # Documentation
├── scripts/           # Build scripts
├── tests/             # Test files
└── dist/              # Built extension
```

## Development Commands

```bash
# Development
pnpm run dev          # Start dev server
pnpm run build        # Build extension
pnpm run lint         # Run linter
pnpm test             # Run tests
pnpm run zip          # Create zip package

# Demo
./scripts/demo.sh     # Launch demo
```

## Configuration

### Environment Variables
- No external API keys required (100% on-device)
- All settings stored in `chrome.storage.sync`

### Extension Permissions
- `storage` - Settings persistence
- `activeTab` - Content script injection
- `tabCapture` - Audio capture
- `scripting` - Dynamic script injection

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
2. Navigate to video call (Zoom, Meet, Teams)
3. Verify captions appear
4. Test keyboard shortcuts (Ctrl+Alt+C)
5. Check settings modal functionality

## Deployment

### Local Development
1. Build: `pnpm run build`
2. Load `dist/` as unpacked extension
3. Test functionality

### Production Build
1. Update version in `extension/manifest.json`
2. Run: `pnpm run build && pnpm run zip`
3. Upload `limitlessmeet-0.1.0.zip` to Chrome Web Store

### CI/CD
- GitHub Actions automatically builds on push
- Artifacts uploaded to releases
- Linting and testing run on all PRs

## Troubleshooting

### Common Issues

**Build fails with WASM import error**
- Check `vite.config.js` external dependencies
- Verify mock implementations in workers

**Extension not loading**
- Check manifest.json syntax
- Verify all files in dist/ directory
- Check Chrome console for errors

**Captions not appearing**
- Verify tabCapture permission
- Check audio input in browser settings
- Test with different video call platforms

**Settings not persisting**
- Check chrome.storage.sync permissions
- Verify settings modal implementation
- Test in incognito mode

### Debug Mode
```bash
# Enable verbose logging
chrome --enable-logging --v=1

# Load extension with debugging
chrome --load-extension=./dist --disable-web-security
```

## Performance Optimization

### Audio Processing
- Ring buffer size: 4096 samples
- Chunk processing: 30ms intervals
- WASM worker initialization: <3s

### Memory Management
- Caption history: 1000 lines max
- Summary aggregation: 30s intervals
- IndexedDB cleanup: Weekly

### Accessibility
- Font size range: 12-32px
- High contrast: 4.5:1 ratio minimum
- Keyboard navigation: Full support

## Security Considerations

### Data Privacy
- No audio leaves device
- All processing local via WASM
- Settings only in chrome.storage.sync
- No external API calls

### Extension Security
- Manifest v3 compliance
- CSP headers enforced
- No eval() or inline scripts
- Sandboxed workers

## Future Enhancements

### Planned Features
- Multilingual support
- ASL gesture recognition
- Cloud-optional backend
- Mobile companion app

### Architecture Improvements
- Real Whisper WASM integration
- TinyLLAMA model optimization
- Performance monitoring
- Error tracking

---

## Support

For issues or questions:
- Check [CONTRIBUTING.md](docs/CONTRIBUTING.md)
- Review [SUBMISSION.md](docs/SUBMISSION.md)
- Open GitHub issue
- Contact team members