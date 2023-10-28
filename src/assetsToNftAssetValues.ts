import { assetToAssetValue } from "./assetToAssetValue";

export const assetsToNftAssetValues = (assets: string[]) => {
  return assets.map((asset) => assetToAssetValue(asset, 1n));
};
