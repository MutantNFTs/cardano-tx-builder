import { AssetMap, EncodedAssetMap } from "./types";

export const decodeAssetMap = (encodedAssetMap: EncodedAssetMap) => {
  const assetMap: AssetMap = {};

  for (const key of encodedAssetMap.keys()) {
    const policyId = key.toString("hex");

    if (!assetMap[policyId]) {
      assetMap[policyId] = {};
    }

    const policyAssetsMap = encodedAssetMap.get(key);

    if (policyAssetsMap) {
      for (const asset of policyAssetsMap.keys()) {
        const quantity = policyAssetsMap.get(asset);
        const assetName = asset.toString("hex");

        if (typeof quantity === "bigint" || typeof quantity === "number") {
          assetMap[policyId][assetName] = BigInt(quantity);
        }
      }
    }
  }

  return assetMap;
};
