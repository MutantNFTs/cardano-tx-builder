import { TxIn } from "./types";

export const sortInputs = <T extends TxIn>(inputs: T[]): T[] =>
  [...inputs].sort((a, b) => {
    if (a.txHash > b.txHash) {
      return 1;
    } else if (b.txHash > a.txHash) {
      return -1;
    }

    return a.txIndex > b.txIndex ? 1 : -1;
  });
