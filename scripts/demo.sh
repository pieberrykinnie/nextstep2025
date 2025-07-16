#!/bin/bash

# LimitlessMeet Hackathon Demo Script
# Launches Chromium with extension loaded and opens demo meeting

set -e

echo "🚀 Starting LimitlessMeet Demo..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root"
    exit 1
fi

# Build the extension if not already built
if [ ! -d "dist" ]; then
    echo "📦 Building extension..."
    pnpm run build
fi

# Find Chromium/Chrome executable
CHROME_PATH=""
if command -v google-chrome &> /dev/null; then
    CHROME_PATH="google-chrome"
elif command -v chromium-browser &> /dev/null; then
    CHROME_PATH="chromium-browser"
elif command -v chromium &> /dev/null; then
    CHROME_PATH="chromium"
else
    echo "❌ Error: Chrome/Chromium not found"
    exit 1
fi

echo "🔧 Using: $CHROME_PATH"

# Create a temporary user data directory for demo
DEMO_PROFILE_DIR="/tmp/limitlessmeet-demo-$(date +%s)"
mkdir -p "$DEMO_PROFILE_DIR"

echo "🎯 Launching Chromium with extension..."

# Launch Chromium with extension and demo flags
"$CHROME_PATH" \
    --user-data-dir="$DEMO_PROFILE_DIR" \
    --load-extension="$(pwd)/dist" \
    --disable-web-security \
    --disable-features=VizDisplayCompositor \
    --no-first-run \
    --no-default-browser-check \
    --disable-default-apps \
    --disable-popup-blocking \
    --disable-translate \
    --disable-background-timer-throttling \
    --disable-renderer-backgrounding \
    --disable-backgrounding-occluded-windows \
    --disable-ipc-flooding-protection \
    --enable-logging \
    --v=1 \
    "https://meet.google.com/test-call" \
    &

echo "✅ Demo launched!"
echo "📝 Instructions:"
echo "   1. The extension should be loaded automatically"
echo "   2. Navigate to any video call (Zoom, Meet, Teams)"
echo "   3. Press Ctrl+Alt+C to toggle captions"
echo "   4. Click 'Settings' button to configure options"
echo "   5. Use 'Shortcuts' button to set up keyboard mappings"
echo ""
echo "🔧 Demo profile directory: $DEMO_PROFILE_DIR"
echo "🗑️  To clean up: rm -rf $DEMO_PROFILE_DIR"