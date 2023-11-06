import { assetListToMap } from "./assetListToMap";
import { encodeAssetMap } from "./encodeAssetMap";
import { EncodedAssetMap, Value } from "./types";
import { valueToAssetList } from "./valueToAssetList";

export const encodeValueAsMap = (value: Value): EncodedAssetMap => {
  return encodeAssetMap(assetListToMap(valueToAssetList(value)));
};
