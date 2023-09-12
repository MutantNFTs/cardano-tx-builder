import { getAssetDetails } from "@mutants/cardano-utils";

import { UTxO } from "./types";

export const utxoContainsAsset = (utxo: UTxO, asset: string) => {
  const assetDetails = getAssetDetails(asset);

  const quantity =
    utxo.value?.assets?.[assetDetails.assetPolicy]?.[assetDetails.assetName];

  return !!quantity && quantity > 0n;
};
