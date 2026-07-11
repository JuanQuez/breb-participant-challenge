import type { CollectionState, TransferState } from "./types";

export type StatusTone = "neutral" | "pending" | "success" | "danger";

export function collectionStatusTone(state: CollectionState): StatusTone {
  switch (state) {
    case "paid":
      return "success";
    case "minimum_paid":
    case "ready":
      return "pending";
    case "discarded":
    case "failed":
      return "danger";
    case "created":
    default:
      return "neutral";
  }
}

export function transferStatusTone(state: TransferState): StatusTone {
  switch (state) {
    case "successful":
      return "success";
    case "failed":
    case "canceled":
    case "reversed":
      return "danger";
    case "created":
    case "processing":
    case "target_resolved":
    case "held":
    case "sent_to_breb_provider":
    case "reapplied":
    default:
      return "pending";
  }
}
