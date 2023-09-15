import { assetMapToList } from "./assetMapToList";
import { getMinUTxOCost } from "./getMinUTxOCost";
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
    const sortedByUnlockedAda = [...utxos].sort((u1, u2) => {
      const unlockedCoin1 =
        parseFloat(u1.value.coin.toString()) -
        parseFloat(getMinUTxOCost(u1).toString());

      const unlockedCoin2 =
        parseFloat(u2.value.coin.toString()) -
        parseFloat(getMinUTxOCost(u2).toString());

        return unlockedCoin2 - unlockedCoin1;
    });

    for (const utxo of sortedByUnlockedAda) {
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
