import { decode } from "cbor";

import { decodeInput } from "./decodeInput";
import { decodeOutput } from "./decodeOutput";
import { DecodedUTxO, UTxO } from "./types";

export const decodeUtxo = (encodedUtxo: string): UTxO => {
  const decoded = decode(encodedUtxo) as DecodedUTxO;

  const utxo = decodeInput(decoded[0]);
  const output = decodeOutput(decoded[1]);

  return {
    txHash: utxo.txHash,
    txIndex: utxo.txIndex,
    ...output,
  };
};
