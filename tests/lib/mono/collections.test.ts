import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/mono/client", () => ({
  monoFetch: vi.fn(),
  tenantAccountId: vi.fn(() => "bbtacc_test"),
}));

import { monoFetch } from "@/lib/mono/client";
import { createCollection, getCollection, listCollections } from "@/lib/mono/collections";

const mockedMonoFetch = vi.mocked(monoFetch);

describe("collections domain functions", () => {
  beforeEach(() => {
    mockedMonoFetch.mockReset();
  });

  it("createCollection posts a batch of one collection with the tenant account id", async () => {
    mockedMonoFetch.mockResolvedValue({ created: [], duplicated: [], rejected: [] });

    await createCollection({ external_id: "invoice-1", usage_mode: "single_use" });

    expect(mockedMonoFetch).toHaveBeenCalledWith(
      "/api/v1/collections",
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse((mockedMonoFetch.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toEqual({
      collections: [{ external_id: "invoice-1", usage_mode: "single_use" }],
      tenant_account_id: "bbtacc_test",
    });
  });

  it("getCollection requests the collection by id", async () => {
    mockedMonoFetch.mockResolvedValue({ id: "bbcol_1" });
    await getCollection("bbcol_1");
    expect(mockedMonoFetch).toHaveBeenCalledWith("/api/v1/collections/bbcol_1");
  });

  it("listCollections requests the collections list endpoint", async () => {
    mockedMonoFetch.mockResolvedValue({ collections: [] });
    await listCollections();
    expect(mockedMonoFetch).toHaveBeenCalledWith("/api/v1/collections");
  });
});
