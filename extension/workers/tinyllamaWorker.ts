// extension/workers/tinyllamaWorker.ts
// TinyLLAMA summarizer worker scaffold.
// TODO: Integrate TinyLLAMA WASM model loading and inference.

// Message types
interface InitMsg { type: "init"; modelUrl?: string }
interface SummarizeMsg { type: "summarize"; text: string }

// Response types
interface SummaryResult {
  type: "summary";
  summary: string;
  actions: string[];
}

declare const self: DedicatedWorkerGlobalScope;

let modelLoaded = false;

self.onmessage = (e) => {
  const data = e.data as InitMsg | SummarizeMsg;
  if (data.type === "init") {
    // TODO: Load TinyLLAMA WASM model from data.modelUrl
    modelLoaded = true;
    self.postMessage({ type: "init", ok: true });
  } else if (data.type === "summarize") {
    if (!modelLoaded) {
      self.postMessage({ type: "error", error: "Model not loaded" });
      return;
    }
    // TODO: Run TinyLLAMA inference on data.text
    // For now, return a dummy summary and action items
    const summary = data.text.split(".").slice(0, 2).join(".") + ".";
    const actions = data.text
      .split("\n")
      .filter((l) => /\b(will|todo|action)\b/i.test(l));
    const result: SummaryResult = { type: "summary", summary, actions };
    self.postMessage(result);
  }
};