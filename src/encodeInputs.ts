import { EncodedInput, TxIn } from "./types";

export const encodeInputs = (inputs: TxIn[]): Array<EncodedInput> => {
  return inputs.map((input) => [
    Buffer.from(input.txHash, "hex"),
    input.txIndex,
  ]);
};
