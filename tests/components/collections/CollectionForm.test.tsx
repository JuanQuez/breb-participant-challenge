import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CollectionForm } from "@/components/collections/CollectionForm";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

async function fillAndSubmit() {
  fireEvent.change(screen.getByPlaceholderText("invoice-12345"), {
    target: { value: "invoice-12345" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Crear recaudo/ }));
}

describe("CollectionForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates the collection and calls onCreated on the happy path", async () => {
    const onCreated = vi.fn();
    const fetchMock = vi.fn().mockResolvedValueOnce(
      jsonResponse(
        {
          created: [{ id: "bbcol_1", external_id: "invoice-12345", state: "created" }],
          duplicated: [],
          rejected: [],
        },
        201,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<CollectionForm onCreated={onCreated} />);
    await fillAndSubmit();

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(/no se pudo|rechazado/i)).not.toBeInTheDocument();
  });

  it("shows an error and does not call onCreated when the collection is rejected", async () => {
    const onCreated = vi.fn();
    const fetchMock = vi.fn().mockResolvedValueOnce(
      jsonResponse(
        {
          created: [],
          duplicated: [],
          rejected: [
            {
              external_id: "invoice-12345",
              error_code: "invalid_external_id",
              message: "El ID externo ya existe",
            },
          ],
        },
        201,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<CollectionForm onCreated={onCreated} />);
    await fillAndSubmit();

    expect(await screen.findByText("El ID externo ya existe")).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
  });
});
