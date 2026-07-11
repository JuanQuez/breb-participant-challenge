import { describe, expect, it } from "vitest";
import { formatMoney } from "@/lib/format";

describe("formatMoney", () => {
  it("converts cents to a formatted COP amount", () => {
    const formatted = formatMoney({ amount: 5000000, currency: "COP" });
    expect(formatted.replace(/\s/g, "")).toContain("50.000");
  });
});
