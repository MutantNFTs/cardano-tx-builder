import { AssetMap, UTxO } from "./types";

export const getMinUTxOCost = (utxo: UTxO) => {
  const hasDatum = !!utxo.datumHash || !!utxo.datumInlined;

  return getMinAssetMapCost(utxo.value.assets, hasDatum);
};

export const getMinAssetMapCost = (assetMap?: AssetMap, hasDatum?: boolean) => {
  if (!assetMap || !Object.keys(assetMap).length) return 0n;

  // All those costs are in WORD size
  // More info: https://github.com/input-output-hk/cardano-ledger/blob/master/doc/explanations/min-utxo-alonzo.rst
  const ASSET_BASE_COST = 12;
  const POLICY_COST = 28;
  const ADDITIONAL_COST_PRE_DIVIDING = 7;
  const ADDITIONAL_COST_POST_DIVIDING = 6;
  const BASE_UTXO_ENTRY_SIZE_WITHOUT_VAL = 27;
  const DATUM_HASH_VALUE = hasDatum ? 10 : 0;

  const policies = Object.keys(assetMap);
  const totalAssetsInfo = Object.keys(assetMap).reduce(
    (acc, key) => {
      return {
        total: acc.total + Object.keys(assetMap[key]).length,
        charactersSum:
          acc.charactersSum +
          Object.keys(assetMap[key]).reduce((characterSum, asset) => {
            return characterSum + asset.length;
          }, 0),
      };
    },
    {
      total: 0,
      charactersSum: 0,
    }
  );

  const totalByteCost =
    ASSET_BASE_COST * totalAssetsInfo.total +
    totalAssetsInfo.charactersSum / 2 +
    policies.length * POLICY_COST +
    ADDITIONAL_COST_PRE_DIVIDING;

  const totalWordCost =
    Math.floor(totalByteCost / 8) + ADDITIONAL_COST_POST_DIVIDING;

  return BigInt(
    (totalWordCost + BASE_UTXO_ENTRY_SIZE_WITHOUT_VAL + DATUM_HASH_VALUE) *
      34482
  );
};
