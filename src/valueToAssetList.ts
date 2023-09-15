import { assetMapToList } from "./assetMapToList";
import { AssetValue, Value } from "./types";

export const valueToAssetList = (value: Value) => {
  const list: AssetValue[] = [];

  if (value.coin) {
    list.push({
      unit: "lovelace",
      quantity: BigInt(value.coin),
    });
  }

  if (value.assets) {
    list.push(...assetMapToList(value.assets));
  }

  return list;
};
