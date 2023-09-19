import { EncodedInput, TxIn } from "./types";

export const decodeInput = (encodedInput: EncodedInput): TxIn => {
  const txHash = encodedInput[0].toString("hex");
  const txIndex = encodedInput[1];

  return {
    txHash,
    txIndex,
  };
};
