import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

describe("UI primitives", () => {
  it("Button renders its children and applies the primary variant by default", () => {
    render(<Button>Crear</Button>);
    const button = screen.getByRole("button", { name: "Crear" });
    expect(button.className).toContain("bg-brand-pink");
  });

  it("Card renders children inside a bordered container", () => {
    render(<Card data-testid="card">contenido</Card>);
    expect(screen.getByTestId("card")).toHaveTextContent("contenido");
  });

  it("StatusBadge renders the label with the tone-specific class", () => {
    render(<StatusBadge label="paid" tone="success" />);
    const badge = screen.getByText("paid");
    expect(badge.className).toContain("text-success");
  });
});
