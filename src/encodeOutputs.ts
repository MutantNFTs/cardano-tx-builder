import { toHexAddress } from "@mutants/cardano-utils";

import { encodeOutputDatum } from "./encodeOutputDatum";
import { encodeValue } from "./encodeValue";
import { PostAlonzoEncodedOutput, TxOut } from "./types";

export const encodeOutputs = (
  outputs: TxOut[]
): Array<PostAlonzoEncodedOutput> => {
  const arr = outputs.map((output) => {
    return encodeOutput(output);
  });

  return arr;
};

export const encodeOutput = (output: TxOut) => {
  const hexAddress = Buffer.from(toHexAddress(output.address), "hex");
  const encodedValue = encodeValue(output.value);

  const map = new Map() as PostAlonzoEncodedOutput;

  map.set(0, hexAddress);
  map.set(1, encodedValue);

  if (output.datumInlined) {
    map.set(2, encodeOutputDatum(output.datumInlined));
  }

  return map;
};
