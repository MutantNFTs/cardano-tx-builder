import { assetMapToList } from "./assetMapToList";
import { UTxO, Value } from "./types";
import { utxoContainsAsset } from "./utxoContainsAsset";
import { ValueBuilder } from "./valueBuilder";

type RequestResponse = {
  fulfilled: boolean;
  missing?: Value;
  totalValueSelected: Value;
  selectedUtxos: UTxO[];
};

export const selectUtxosByValue = (
  utxos: UTxO[],
  valueToSelect: Value
): RequestResponse => {
  const missingValueBuilder = new ValueBuilder();
  const totalSelectedBuilder = new ValueBuilder();

  missingValueBuilder.addValue(valueToSelect);
  missingValueBuilder.revert();

  if (valueToSelect.assets) {
    const assetList = assetMapToList(valueToSelect.assets);

    for (const asset of assetList) {
      const assetUtxos = utxos.filter((utxo) =>
        utxoContainsAsset(utxo, asset.unit)
      );

      if (assetUtxos.length) {
        for (const assetUtxo of assetUtxos) {
          missingValueBuilder.addUTxO(assetUtxo);
          totalSelectedBuilder.addUTxO(assetUtxo);

          if (missingValueBuilder.getAssetQuantity(asset.unit) >= 0) {
            break;
          }
        }
      }
    }
  }

  if (totalSelectedBuilder.getUnlockedLovelace() < valueToSelect.coin) {
    for (const utxo of utxos) {
      const totalUtxoLovelace = BigInt(utxo.value.coin);

      if (totalUtxoLovelace) {
        missingValueBuilder.addUTxO(utxo);
        totalSelectedBuilder.addUTxO(utxo);
      }

      if (totalSelectedBuilder.getUnlockedLovelace() >= valueToSelect.coin) {
        break;
      }
    }
  }

  const isMissingValues = missingValueBuilder.hasAnyNegativeAssetOrLovelace();

  return {
    fulfilled: !isMissingValues,
    missing: isMissingValues
      ? new ValueBuilder()
          .addValue(missingValueBuilder.getNegativeValues())
          .abs()
          .build()
      : undefined,
    selectedUtxos: missingValueBuilder.getUTxOs(),
    totalValueSelected: totalSelectedBuilder.build(),
  };
};
