import { TxOut } from "./types";

/**
 * @todo
 * Organize outputs is a way to check outputs and break them out if needed.
 */
export const organizeOutputs = (outputs: TxOut[]) => {
  return outputs;

  // return outputs.reduce<TxOut[]>((organizedOutputs, output) => {
  //     // Reorganize if there are too many assets.
  //     if (output.value.assets && Object.keys(output.value.assets).length > 1 && getMinUTxOCost(output,)) {
  //         const policies = Object.keys(output.value.assets);

  //     }

  //     return output;
  // }, []);
};
