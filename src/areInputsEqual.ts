import { TxIn } from "./types";

export const areInputsEqual = (txIn1: TxIn, txIn2: TxIn) => {
  return txIn1.txHash === txIn2.txHash && txIn1.txIndex === txIn2.txIndex;
};
