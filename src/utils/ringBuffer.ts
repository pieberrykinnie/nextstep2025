/**
 * Simple fixed-size ring buffer for Float32 samples.
 * Not production-grade; sufficient for unit tests & ASR buffering.
 */
export class RingBuffer {
  private readonly data: Float32Array;
  private writeIndex = 0;
  private used = 0;

  constructor(private readonly capacity: number) {
    this.data = new Float32Array(capacity);
  }

  push(samples: Float32Array): void {
    if (samples.length > this.capacity) throw new Error("samples too big");
    if (samples.length > this.freeSpace()) {
      // overwrite oldest
      const overflow = samples.length - this.freeSpace();
      this.discard(overflow);
    }
    for (let i = 0; i < samples.length; i++) {
      this.data[(this.writeIndex + i) % this.capacity] = samples[i];
    }
    this.writeIndex = (this.writeIndex + samples.length) % this.capacity;
    this.used = Math.min(this.used + samples.length, this.capacity);
  }

  pop(n: number): Float32Array {
    const out = new Float32Array(Math.min(n, this.used));
    const startIdx = (this.writeIndex - this.used + this.capacity) % this.capacity;
    for (let i = 0; i < out.length; i++) {
      out[i] = this.data[(startIdx + i) % this.capacity];
    }
    this.discard(out.length);
    return out;
  }

  freeSpace() {
    return this.capacity - this.used;
  }

  size() {
    return this.used;
  }

  private discard(n: number) {
    this.used = Math.max(this.used - n, 0);
  }
}