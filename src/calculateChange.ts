import { AssetValue, TxOut, UTxO, Value } from "./types";
import { ValueBuilder } from "./valueBuilder";
import { valueToAssetList } from "./valueToAssetList";

const calculateChangeBasedOnRequiredValue = (
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

export const calculateChange = (inputs: UTxO[], outputs: TxOut[]) => {
  const totalOutputValue = outputs.reduce(
    (valueBuilder: ValueBuilder, output: TxOut) => {
      valueBuilder.addValue(output.value);

      return valueBuilder;
    },
    new ValueBuilder()
  );

  return calculateChangeBasedOnRequiredValue(
    inputs,
    valueToAssetList(totalOutputValue.build())
  );
};
