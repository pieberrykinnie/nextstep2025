# ASR Pipeline Architecture (LimitlessMeet)

```
Tab Audio (16 kHz mono)
        │
        ▼
AudioWorklet buffer (ScriptProcessor 4 096 samples)
        │  Float32 PCM chunks (~256 ms)
        ▼
Background Service Worker (recorder.ts)
        │  posts MessagePort
        ▼
Whisper Worker (whisperWorker.ts)
  • tiny-int4 quantised model (~60 MB)
  • Streaming inference window 2 s, stride 0.2 s
        │  emits text segments (≈ sentence)
        ▼
Content Script
  • Appends to caption buffer (Caption.tsx)
  • Stores full transcript in transcriptLines[]
        │ (every 30 s)
        ▼
Summary Worker (summaryWorker.ts)  ←─────────────┐
  • TinyLLAMA-1.1B chat quantised GGML           │
  • Generates bullet summary + action items ─────┘
```

## Detailed Flow
1. **Tab Capture** – Chrome `tabCapture.capture({audio:true})` streams raw audio to an `AudioContext` configured at 16 kHz to match Whisper small models.
2. **Buffering** – A `ScriptProcessorNode` aggregates 4 096-sample blocks (≈0.256 s). Each block is copied into a detached `Float32Array` and posted to the Whisper worker to avoid main thread jank.
3. **Whisper Inference**
   * `whisper.wasm` (INT4 quantised via WhisperKit-micro) is loaded once (`init` message).
   * Incoming PCM chunks are appended to an internal ring buffer (6 s capacity). When ≥2 s of fresh audio is present, `whisper_full()` is invoked with `translate=false`, `language=auto`, and timestamps enabled.
   * The returned segment string is posted back to the background script with `{type:"transcript", text}`.
4. **Broadcast to UI** – Background relays transcripts via `chrome.runtime.sendMessage` so multiple content scripts (captions panel, test pages) can subscribe without extra ports.
5. **Caption Rendering** – The content script maintains `lines[]` in React state. The `<Caption>` component shows the last N lines with smooth scroll.
6. **Summarisation Cycle** – Every 30 s a snapshot of `lines[]` is sent to `summaryWorker.ts`.
   * For the prototype, a heuristic summariser is used; in full build, TinyLLAMA in WASM will generate concise bullets.
   * Regex extracts actionable phrases (`will`, `todo`, `action:`) into the action list.
7. **Summary Display** – The UI updates `<SummaryPanel>` with the latest summary and actions, aiding real-time comprehension.

## Latency Targets
| Stage | Budget |
|-------|--------|
| Audio capture buffering | ≤ 20 ms |
| Worklet → Worker postMessage | ≤ 2 ms |
| Whisper inference (2 s window on Apple M1) | ≤ 300 ms |
| UI update & React render | ≤ 16 ms |
| **End-to-end caption latency** | **≤ 500 ms** |


## Future Improvements
* Replace `ScriptProcessorNode` with `AudioWorkletProcessor` for lower latency (still experimental in MV3).
* Add VAD (WebRTC) to skip silence and reduce compute cost.
* Experiment with 8-bit quantisation for improved accuracy vs size trade-off.