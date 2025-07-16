import { describe, it, expect } from 'vitest';

// Extraction logic (should match TinyLLAMA worker)
function extractActionItems(text: string): string[] {
  return text
    .split('\n')
    .filter((l) => /(^|\s)(-\s*)?\[ \]/.test(l))
    .map((l) => l.trim());
}

describe('Action item extractor', () => {
  it('extracts lines with [ ]', () => {
    const input = `Discuss project timeline\n[ ] Schedule next meeting\nSome other note`;
    expect(extractActionItems(input)).toEqual(['[ ] Schedule next meeting']);
  });

  it('extracts lines with - [ ]', () => {
    const input = `- [ ] Prepare slides\n- [x] Done task\n[ ] Another task`;
    expect(extractActionItems(input)).toEqual(['- [ ] Prepare slides', '[ ] Another task']);
  });

  it('ignores lines without [ ]', () => {
    const input = `No action here\n[x] Not a task\nJust text`;
    expect(extractActionItems(input)).toEqual([]);
  });

  it('trims whitespace', () => {
    const input = `   - [ ]   Task with spaces   `;
    expect(extractActionItems(input)).toEqual(['- [ ]   Task with spaces']);
  });
});