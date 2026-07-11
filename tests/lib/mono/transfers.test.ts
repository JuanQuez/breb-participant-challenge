import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/mono/client", () => ({
  monoFetch: vi.fn(),
  tenantAccountId: vi.fn(() => "bbtacc_test"),
}));

import { monoFetch } from "@/lib/mono/client";
import { createTransfer, getTransfer, listTransfers, resolveTarget } from "@/lib/mono/transfers";

const mockedMonoFetch = vi.mocked(monoFetch);

describe("transfers domain functions", () => {
  beforeEach(() => {
    mockedMonoFetch.mockReset();
  });

  it("resolveTarget posts the tenant account id, format and value", async () => {
    mockedMonoFetch.mockResolvedValue({ state: "resolved" });

    await resolveTarget("plain_key", "@MNDESTINATARIO");

    const body = JSON.parse((mockedMonoFetch.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toEqual({
      tenant_account_id: "bbtacc_test",
      format: "plain_key",
      value: "@MNDESTINATARIO",
    });
  });

  it("createTransfer posts a batch of one transfer using the resolved target id", async () => {
    mockedMonoFetch.mockResolvedValue({ accepted_transfers: [], rejected_transfers: [] });

    await createTransfer("transfer_001", "bbtgt_1");

    const body = JSON.parse((mockedMonoFetch.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toEqual({
      tenant_account_id: "bbtacc_test",
      transfers: [{ external_id: "transfer_001", target_id: "bbtgt_1" }],
    });
  });

  it("getTransfer requests the transfer by id", async () => {
    mockedMonoFetch.mockResolvedValue({ id: "bbot_1" });
    await getTransfer("bbot_1");
    expect(mockedMonoFetch).toHaveBeenCalledWith("/api/v1/outgoing_transfers/bbot_1");
  });

  it("listTransfers requests the outgoing transfers list endpoint", async () => {
    mockedMonoFetch.mockResolvedValue({ transfers: [] });
    await listTransfers();
    expect(mockedMonoFetch).toHaveBeenCalledWith("/api/v1/outgoing_transfers");
  });
});
