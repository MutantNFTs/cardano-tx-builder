import { decodeAssetMap } from "./decodeAssetMap";
import { EncodedValue } from "./types";

export const decodeValue = (value: EncodedValue) => {
  const coin =
    typeof value === "bigint" || typeof value === "number" ? value : value[0];
  const assetsMap =
    typeof value === "bigint" || typeof value === "number"
      ? undefined
      : value[1];

  return {
    coin,
    assets: assetsMap && decodeAssetMap(assetsMap),
  };
};
