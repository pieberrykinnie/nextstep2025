// extension/background/audioCapture.ts
// Minimal tab audio capture that pipes audio PCM chunks to a callback.

export async function startTabAudioCapture(
  onChunk: (pcm: Float32Array) => void,
): Promise<void> {
  const stream = await new Promise<MediaStream>((resolve, reject) => {
    chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
      if (chrome.runtime.lastError || !stream) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(stream);
      }
    });
  });

  const audioCtx = new AudioContext({ sampleRate: 16000 });
  const source = audioCtx.createMediaStreamSource(stream);

  // ScriptProcessor is deprecated but simplest for quick prototype.
  const processor = audioCtx.createScriptProcessor(4096, 1, 1);

  processor.onaudioprocess = (ev) => {
    const input = ev.inputBuffer.getChannelData(0);
    // Copy to new Float32Array to detach from underlying buffer.
    onChunk(new Float32Array(input));
  };

  source.connect(processor);
  processor.connect(audioCtx.destination);

  console.info("[LimitlessMeet] audio capture started, sampleRate", audioCtx.sampleRate);
}