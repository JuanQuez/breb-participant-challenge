import { describe, expect, it } from "vitest";
import { collectionStatusTone, transferStatusTone } from "@/lib/mono/status";

describe("collectionStatusTone", () => {
  it.each([
    ["paid", "success"],
    ["minimum_paid", "pending"],
    ["ready", "pending"],
    ["discarded", "danger"],
    ["failed", "danger"],
    ["created", "neutral"],
  ] as const)("maps %s to %s", (state, tone) => {
    expect(collectionStatusTone(state)).toBe(tone);
  });
});

describe("transferStatusTone", () => {
  it.each([
    ["successful", "success"],
    ["failed", "danger"],
    ["canceled", "danger"],
    ["reversed", "danger"],
    ["processing", "pending"],
    ["created", "pending"],
  ] as const)("maps %s to %s", (state, tone) => {
    expect(transferStatusTone(state)).toBe(tone);
  });
});
