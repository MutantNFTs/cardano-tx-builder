import { AssetMap, EncodedAssetMap } from "./types";

export const encodeAssetMap = (assetMap: AssetMap): EncodedAssetMap => {
  const encodedMap = new Map<Buffer, Map<Buffer, bigint | number>>();
  const sortedPolicies = [...Object.keys(assetMap || {})].sort();

  for (const policyId of sortedPolicies) {
    const policyIdAssetsMap = new Map<Buffer, bigint | number>();
    const assets = assetMap[policyId];
    const sortedAssets = [...Object.keys(assets || {})].sort();

    for (const assetName of sortedAssets) {
      policyIdAssetsMap.set(
        Buffer.from(assetName, "hex"),
        parseInt(assets[assetName].toString())
      );
    }

    encodedMap.set(Buffer.from(policyId, "hex"), policyIdAssetsMap);
  }

  return encodedMap;
};
