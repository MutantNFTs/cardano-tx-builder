import { decode } from "cbor";

import { decodeAssetMap } from "./decodeAssetMap";
import { EncodedValue } from "./types";

export const decodeBalance = (
  balance: string,
  opts?: { ignoreAssets?: boolean }
) => {
  const decodedBalance = decode(balance) as EncodedValue;

  if (Array.isArray(decodedBalance)) {
    const [lovelace, encodedAssets] = decodedBalance;

    if (!opts?.ignoreAssets) {
      const assets = decodeAssetMap(encodedAssets);

      return {
        lovelace,
        assets,
      };
    } else {
      return {
        lovelace,
        assets: {},
      };
    }
  } else {
    return {
      lovelace: decodedBalance,
      assets: {},
    };
  }
};
