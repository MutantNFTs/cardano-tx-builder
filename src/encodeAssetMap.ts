import { AssetMap, EncodedAssetMap } from "./types";

export const encodeAssetMap = (assetMap: AssetMap): EncodedAssetMap => {
  const encodedMap = new Map<Buffer, Map<Buffer, bigint | number>>();

  for (const policyId in assetMap) {
    const policyIdAssetsMap = new Map<Buffer, bigint | number>();

    for (const assetName in assetMap[policyId]) {
      policyIdAssetsMap.set(
        Buffer.from(assetName, "hex"),
        parseInt(assetMap[policyId][assetName].toString())
      );
    }

    encodedMap.set(Buffer.from(policyId, "hex"), policyIdAssetsMap);
  }

  return encodedMap;
};
