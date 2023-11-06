import { AssetMap, AssetValue } from "./types";

export const assetMapToList = (assetMap: AssetMap) => {
  const list: AssetValue[] = [];

  for (const policyId of Object.keys(assetMap)) {
    for (const assetName of Object.keys(assetMap[policyId])) {
      const asset = `${policyId}${assetName}`;
      const quantity = assetMap[policyId][assetName];

      list.push({
        unit: asset || "lovelace",
        quantity,
      });
    }
  }

  return list;
};
