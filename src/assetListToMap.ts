import { getAssetDetails } from "@mutants/cardano-utils";

import { AssetMap, AssetValue } from "./types";

export const assetListToMap = (assets: AssetValue[]) => {
  return assets.reduce((assetMap: AssetMap, asset) => {
    const details = getAssetDetails(asset.unit);

    if (assetMap[details.assetPolicy]?.[details.assetName]) {
      assetMap[details.assetPolicy][details.assetName] += asset.quantity;
    } else {
      assetMap[details.assetPolicy] = {
        ...assetMap[details.assetPolicy],
        [details.assetName]: asset.quantity,
      };
    }

    return assetMap;
  }, {});
};
