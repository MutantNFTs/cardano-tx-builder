import { Tagged } from "cbor";

// Most of these properties are not really needed to build our transactions, so
// we can give the flexibility of not having to send them all.
export type ProtocolParameters = {
  // id: number;
  // epoch_no: number;
  min_fee_a: number;
  min_fee_b: number;
  // max_block_size: number;
  // max_tx_size: number;
  // max_bh_size: number;
  // key_deposit: number;
  // pool_deposit: number;
  // max_epoch: number;
  // optimal_pool_count: number;
  // influence: number;
  // monetary_expand_rate: number;
  // treasury_growth_rate: number;
  // decentralisation: number;
  // protocol_major: number;
  // protocol_minor: number;
  // min_utxo_value: string;
  // min_pool_cost: number;
  // nonce: number;
  // cost_model_id: number;
  price_mem: number | null;
  price_step: number | null;
  // max_tx_ex_mem: number;
  // max_tx_ex_steps: number;
  // max_block_ex_mem: number;
  // max_block_ex_steps: number;
  // max_val_size: number;
  collateral_percent: number | null;
  coins_per_utxo_word: string;
  // max_collateral_inputs: number;
  // block_id: number;
  // slot_no: string;
};

export type EncodedTxHash = Buffer;
export type EncodedPolicyId = Buffer;
export type EncodedAssetName = Buffer;
export type EncodedAddressHash = Buffer;
export type EncodedRequiredSigner = Buffer;
export type EncodedValue = [Lovelace, EncodedAssetMap] | Lovelace;

export type EncodedAssetMap = Map<
  EncodedPolicyId,
  Map<EncodedAssetName, bigint | number>
>;

export type TxIndex = number;
export type Lovelace = bigint | number;
export type CborTransaction = string;
export type EncodedInput = [EncodedTxHash, TxIndex];
export type EncodedRequiredSigners = EncodedRequiredSigner[];
export type EncodedOutput =
  | [EncodedAddressHash, EncodedValue]
  | [EncodedAddressHash, EncodedValue, Buffer];
export type EncodedDatum = [number, Buffer | Tagged];
export type EncodedSignedData = [Buffer, Map<string, boolean>, Buffer, Buffer];
export type PostAlonzoEncodedOutput = Map<
  number,
  Buffer | EncodedValue | EncodedDatum
>;

export enum DatumOption {
  Hash = 0,
  Inline = 1,
}

export type DecodedUTxO = [EncodedInput, EncodedOutput];

export type AssetMap = {
  [policyId: string]: {
    [assetName: string]: bigint;
  };
};

export type TxIn = {
  txHash: string;
  txIndex: number;
  hasScript?: boolean | null;
};

export type Value = {
  coin: bigint | number;
  assets?: AssetMap | null;
};

export type PlutusDataField = {
  bytes?: string | Buffer | null;
  list?: PlutusDataField[] | null;
  map?: Map<unknown, unknown> | null;
  int?: number | null;
  plutusData?: PlutusData | null;
};

export type PlutusDataFieldValue =
  | string
  | Buffer
  | Map<unknown, unknown>
  | number
  | PlutusDataFieldValue[]
  | Tagged;

export type PlutusData = {
  constructor: number;
  fields: PlutusDataField[];
};

export type TxOut = {
  address: string;
  value: Value;
  datumInlined?: string | null;
  datumHash?: string | null;
};

export type UTxO = {
  txHash: string;
  txIndex: number;
  address: string;
  value: Value;
  datumInlined?: string | null;
  datumHash?: string | null;
};

export type AssetValue = {
  unit: string;
  quantity: bigint;
};

export type BlockfrostAssetValue = {
  unit: string;
  quantity: bigint | string;
};

export enum RedeemerTag {
  Spend = 0,
  Mint = 1,
  Cert = 2,
  Reward = 3,
}

export type VKeyWitness = [Buffer, Buffer];

export type MemUnits = number;

export type StepsUnits = number;

export type ExUnits = [MemUnits, StepsUnits];

export type PreBuildRedeemer = [
  RedeemerTag,
  { txHash: string; txIndex: number },
  PlutusData,
  ExUnits
];

export type Redeemer = [RedeemerTag, number, Tagged, ExUnits];

export type RedeemerEvaluation = {
  tag: number;
  index: number;
  memory: number;
  steps: number;
};

export type DecodedTransaction = [
  Map<number, unknown>,
  Map<number, unknown>,
  boolean,
  unknown
];
