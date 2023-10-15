import { encodeAssetMap } from "./encodeAssetMap";
import { EncodedAssetMap, Value } from "./types";

export const encodeValue = (
  value: Value
): [number, EncodedAssetMap] | number => {
  return value.assets && Object.keys(value.assets).length
    ? [parseInt(value.coin.toString()), encodeAssetMap(value.assets)]
    : parseInt(value.coin.toString());
};
