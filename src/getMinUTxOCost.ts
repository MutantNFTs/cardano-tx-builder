import { encode } from "cbor";

import { encodeOutput } from "./encodeOutputs";
import { ProtocolParameters, UTxO } from "./types";

export const getMinUTxOCost = (
  utxo: UTxO,
  coinsPerUTxOWord: ProtocolParameters["coins_per_utxo_word"] = "4310"
) => {
  const encodedOutput = encode(encodeOutput(utxo)).toString("hex");

  if (!utxo.value.assets && !utxo.datumHash && !utxo.datumInlined) {
    return 0n;
  }

  return BigInt((encodedOutput.length / 2 + 160) * parseInt(coinsPerUTxOWord));
};
