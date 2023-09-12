import { AssetValue, BlockfrostAssetValue } from "./types";
import { ValueBuilder } from "./valueBuilder";

export const assetListToValue = (
  assets: (AssetValue | BlockfrostAssetValue)[]
) => {
  return new ValueBuilder().loadValues(assets).build();
};
