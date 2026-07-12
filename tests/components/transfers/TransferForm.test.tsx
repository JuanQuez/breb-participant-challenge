import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransferForm } from "@/components/transfers/TransferForm";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

async function fillAndSubmit() {
  fireEvent.change(screen.getByPlaceholderText("transfer_001"), {
    target: { value: "transfer_001" },
  });
  fireEvent.change(screen.getByPlaceholderText("@MNDESTINATARIO"), {
    target: { value: "@MNDESTINATARIO" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Enviar transferencia/ }));
}

describe("TransferForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves the target and creates the transfer on the happy path", async () => {
    const onCreated = vi.fn();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          id: "bbtres_1",
          state: "resolved",
          state_reason: null,
          target: { id: "bbtgt_1", key_type: "plain_key", key_value: "@MNDESTINATARIO" },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            accepted_transfers: [{ id: "bbot_1", external_id: "transfer_001", state: "created" }],
            rejected_transfers: [],
          },
          201,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<TransferForm onCreated={onCreated} />);
    await fillAndSubmit();

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/transfers",
      expect.objectContaining({
        body: JSON.stringify({ external_id: "transfer_001", target_id: "bbtgt_1" }),
      }),
    );
    expect(screen.queryByText(/no se pudo/i)).not.toBeInTheDocument();
  });

  it("shows an error and does not call onCreated when the transfer is rejected on create", async () => {
    const onCreated = vi.fn();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          id: "bbtres_1",
          state: "resolved",
          state_reason: null,
          target: { id: "bbtgt_1", key_type: "plain_key", key_value: "@MNDESTINATARIO" },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            accepted_transfers: [],
            rejected_transfers: [
              { external_id: "transfer_001", error_code: "insufficient_funds", message: "Fondos insuficientes" },
            ],
          },
          201,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<TransferForm onCreated={onCreated} />);
    await fillAndSubmit();

    expect(await screen.findByText("Fondos insuficientes")).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("shows a pending message (not a false failure) when resolution is not yet terminal", async () => {
    const onCreated = vi.fn();
    const fetchMock = vi.fn().mockResolvedValueOnce(
      jsonResponse({
        id: "bbtres_1",
        state: "created",
        state_reason: null,
        target: null,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<TransferForm onCreated={onCreated} />);
    await fillAndSubmit();

    expect(
      await screen.findByText("La resolución de la llave está en proceso, intenta de nuevo en unos segundos"),
    ).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
    // Only the resolve call should have happened — no transfer creation attempted.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows the state_reason when resolution fails outright", async () => {
    const onCreated = vi.fn();
    const fetchMock = vi.fn().mockResolvedValueOnce(
      jsonResponse({
        id: "bbtres_1",
        state: "failed",
        state_reason: "key_not_found",
        target: null,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<TransferForm onCreated={onCreated} />);
    await fillAndSubmit();

    expect(await screen.findByText("key_not_found")).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
  });
});
