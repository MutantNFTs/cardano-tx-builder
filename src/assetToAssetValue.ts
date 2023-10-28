import { AssetValue } from "./types";

export const assetToAssetValue = (
  asset: string,
  quantity: bigint
): AssetValue => {
  return {
    unit: asset,
    quantity,
  };
};
