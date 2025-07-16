import { describe, it, expect } from "vitest";
import { RingBuffer } from "../../src/utils/ringBuffer";

describe("RingBuffer", () => {
  it("pushes and pops", () => {
    const rb = new RingBuffer(8);
    rb.push(Float32Array.from([1, 2, 3]));
    expect(rb.size()).toBe(3);
    const out = rb.pop(2);
    expect(Array.from(out)).toEqual([1, 2]);
    expect(rb.size()).toBe(1);
  });

  it("overwrites oldest when full", () => {
    const rb = new RingBuffer(4);
    rb.push(Float32Array.from([1, 2, 3, 4]));
    rb.push(Float32Array.from([5, 6])); // should overwrite 1,2
    expect(rb.size()).toBe(4);
    const out = rb.pop(4);
    expect(Array.from(out)).toEqual([3, 4, 5, 6]);
  });
});