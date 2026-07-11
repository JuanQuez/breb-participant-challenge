import { monoFetch, tenantAccountId } from "./client";
import type { Collection, CreateCollectionInput, CreateCollectionsResult } from "./types";

export async function createCollection(
  input: CreateCollectionInput,
): Promise<CreateCollectionsResult> {
  return monoFetch<CreateCollectionsResult>("/api/v1/collections", {
    method: "POST",
    body: JSON.stringify({
      collections: [input],
      tenant_account_id: tenantAccountId(),
    }),
  });
}

export async function getCollection(id: string): Promise<Collection> {
  return monoFetch<Collection>(`/api/v1/collections/${id}`);
}

export async function listCollections(): Promise<{ collections: Collection[] }> {
  return monoFetch<{ collections: Collection[] }>("/api/v1/collections");
}
