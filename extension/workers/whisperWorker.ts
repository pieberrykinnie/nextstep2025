// extension/workers/whisperWorker.ts
// WebWorker running Whisper WASM for streaming transcription.
// NOTE: The actual wasm binary (whisper.wasm) must be placed in dist and referenced via import.meta.url.

// import initWhisper, { WhisperContext } from "@limitlessmeet/whisper-wasm"; // hypothetical wrapper
// For now, we'll use a mock implementation
interface WhisperContext {
  transcribe: (pcm: Float32Array) => string | null;
}

type PCMChunk = Float32Array;

declare const self: DedicatedWorkerGlobalScope;

interface InitMsg {
  type: "init";
  wasmPath: string;
}
interface AudioMsg {
  type: "audio";
  pcm: PCMChunk;
}

let ctx: WhisperContext | null = null;

// Mock implementation for now
const mockInitWhisper = async (config: any): Promise<WhisperContext> => {
  return {
    transcribe: (pcm: Float32Array) => {
      // Mock transcription - return some text based on audio length
      if (pcm.length > 1000) {
        return "Hello, this is a mock transcription.";
      }
      return null;
    }
  };
};

self.onmessage = async (event) => {
  const data = event.data as InitMsg | AudioMsg;
  if (data.type === "init") {
    ctx = await mockInitWhisper({ wasmPath: data.wasmPath, modelPath: "tiny-int4.bin" });
    self.postMessage({ type: "ready" });
  } else if (data.type === "audio" && ctx) {
    const text = ctx.transcribe(data.pcm);
    if (text) {
      self.postMessage({ type: "transcript", text });
    }
  }
};