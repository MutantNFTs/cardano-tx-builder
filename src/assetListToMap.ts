import { getAssetDetails } from "@mutants/cardano-utils";

import { AssetMap, AssetValue, BlockfrostAssetValue } from "./types";

export const assetListToMap = (
  assets: (AssetValue | BlockfrostAssetValue)[]
) => {
  return assets.reduce<AssetMap>(
    (assetMap: AssetMap, asset: AssetValue | BlockfrostAssetValue) => {
      const details =
        asset.unit === "lovelace"
          ? {
              assetPolicy: "",
              assetName: "",
              name: "",
            }
          : getAssetDetails(asset.unit);

      if (assetMap[details.assetPolicy]?.[details.assetName]) {
        assetMap[details.assetPolicy][details.assetName] += BigInt(
          asset.quantity
        );
      } else {
        assetMap[details.assetPolicy] = {
          ...assetMap[details.assetPolicy],
          [details.assetName]: BigInt(asset.quantity),
        };
      }

      return assetMap;
    },
    {}
  );
};
