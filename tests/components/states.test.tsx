import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

describe("ErrorState", () => {
  it("renders the message with the danger tone", () => {
    render(<ErrorState message="No se pudo cargar" />);
    const node = screen.getByText("No se pudo cargar");
    expect(node.className).toContain("text-danger");
  });
});

describe("EmptyState", () => {
  it("renders the message", () => {
    render(<EmptyState message="Aún no hay datos" />);
    expect(screen.getByText("Aún no hay datos")).toBeInTheDocument();
  });
});
