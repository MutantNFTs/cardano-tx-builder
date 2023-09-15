import { areInputsEqual } from "./areInputsEqual";
import { TxIn } from "./types";

export const findInputIndex = (inputs: TxIn[], txIn: TxIn) => {
  return inputs.findIndex((input) => areInputsEqual(input, txIn));
};
