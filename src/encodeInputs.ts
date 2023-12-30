import { sortInputs } from "./sortInputs";
import { EncodedInput, TxIn } from "./types";

export const encodeInputs = (inputs: TxIn[]): Array<EncodedInput> => {
  return sortInputs(inputs).map((input) => [
    Buffer.from(input.txHash, "hex"),
    input.txIndex,
  ]);
};
