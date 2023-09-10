import { AssetValue, UTxO, Value } from "./types";
import { ValueBuilder } from "./valueBuilder";

export const calculateChange = (
  inputs: UTxO[],
  required: AssetValue[]
): Value => {
  const valueBuilder = new ValueBuilder();

  valueBuilder.loadValues(required);

  for (const input of inputs) {
    valueBuilder.addAsset("lovelace", -BigInt(input.value.coin));

    if (input.value.assets) {
      for (const policyId of Object.keys(input.value.assets)) {
        for (const assetName of Object.keys(input.value.assets[policyId])) {
          const quantity = input.value.assets[policyId][assetName];

          valueBuilder.addAsset(`${policyId}${assetName}`, -quantity);
        }
      }
    }
  }

  valueBuilder.abs();

  return valueBuilder.build();
};
