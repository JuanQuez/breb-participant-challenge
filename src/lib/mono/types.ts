export type Money = {
  amount: number;
  currency: string;
};

export type CollectionState =
  | "created"
  | "ready"
  | "minimum_paid"
  | "paid"
  | "discarded"
  | "failed";

export type CollectionStateReason =
  | "key_already_registered"
  | "key_registration_failed"
  | "expired"
  | "inactivity"
  | "key_canceled"
  | "deleted"
  | null;

export type CollectionKey = {
  name: string;
  state: string;
  type: string;
  value: string;
};

export type Collection = {
  id: string;
  external_id: string;
  usage_mode: "single_use" | "multiple_use";
  state: CollectionState;
  state_reason: CollectionStateReason;
  tenant_account_id: string;
  total_maximum_amount: Money;
  total_minimum_amount: Money;
  paid_amount: Money;
  custom_key_value?: string | null;
  custom_merchant_name?: string | null;
  nickname?: string | null;
  reference?: string | null;
  keys: CollectionKey[];
  inserted_at: string;
  updated_at: string;
};

export type CreateCollectionInput = {
  external_id: string;
  usage_mode: "single_use" | "multiple_use";
  custom_key_value?: string;
  custom_merchant_name?: string;
  nickname?: string;
  reference?: string;
  total_maximum_amount?: Money;
  total_minimum_amount?: Money;
};

export type CreateCollectionsResult = {
  created: Collection[];
  duplicated: Collection[];
  rejected: Array<{ external_id: string; error_code: string; message: string }>;
};

export type TransferState =
  | "created"
  | "processing"
  | "target_resolved"
  | "held"
  | "sent_to_breb_provider"
  | "successful"
  | "failed"
  | "canceled"
  | "reversed"
  | "reapplied";

export type TransferStateReason =
  | "key_not_found"
  | "key_suspended"
  | "invalid_key_format"
  | "target_creditor_mismatch"
  | "insufficient_funds"
  | "amount_exceeds_balance_limit"
  | "creditor_account_not_found"
  | "invalid_creditor_account"
  | "risk_control"
  | "breb_timeout"
  | "provider_unavailable"
  | "internal_error"
  | null;

export type OutgoingTransfer = {
  id: string;
  external_id: string;
  state: TransferState;
  state_reason: TransferStateReason;
  amount: Money;
  description?: string | null;
  tenant_account_id: string;
  payer_name?: string | null;
  inserted_at: string;
  updated_at: string;
};

export type ResolveTargetFormat = "plain_key" | "image" | "emvco" | "emvco_b64";

export type ResolvedTarget = {
  id: string;
  state: "created" | "retrying" | "resolved" | "failed";
  state_reason: string | null;
  target: {
    id: string;
    key_type: string;
    key_value: string;
    creditor: {
      full_name: string;
      document_number: string;
      document_type: string;
      type: string;
    };
  } | null;
};

export type MonoErrorEnvelope = {
  code: string;
  message: string;
  id: string;
  errors: Array<{ error_code: string; message: string; path: string | null; url: string | null }>;
};
