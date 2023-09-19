import { Tagged } from "cbor";

import { toPaymentAddress } from "@mutants/cardano-utils";

import { decodeAssetMap } from "./decodeAssetMap";
import {
  DatumOption,
  EncodedDatum,
  EncodedOutput,
  EncodedValue,
  PostAlonzoEncodedOutput,
} from "./types";

export const decodeOutput = (
  output: EncodedOutput | PostAlonzoEncodedOutput
) => {
  let address = "";
  let value: EncodedValue;
  let datumInlined: string | undefined;
  let datumHash: string | undefined;

  // Post Alonzo format
  if (output instanceof Map) {
    const addr = output.get(0) as Buffer;

    address = toPaymentAddress(addr.toString("hex"));
    value = output.get(1) as EncodedValue;

    if (Array.isArray(output.get(2))) {
      const datumOption = output.get(2) as EncodedDatum;

      if (datumOption[0] === DatumOption.Inline) {
        const datumValue = datumOption[1];

        if (datumValue instanceof Buffer) {
          datumInlined = datumValue.toString("hex");
        } else if (datumValue instanceof Tagged) {
          datumInlined = datumValue.value.toString("hex");
        }
      } else if (datumOption[0] === DatumOption.Hash) {
        datumHash = datumOption[1].toString("hex");
      }
    }
  } else {
    // Pre Alonzo format
    address = toPaymentAddress(output[0].toString("hex"));
    value = output[1];

    if (output[2]) {
      datumHash = output[2].toString("hex");
    }
  }

  const coin =
    typeof value === "bigint" || typeof value === "number" ? value : value[0];
  const assetsMap =
    typeof value === "bigint" || typeof value === "number"
      ? undefined
      : value[1];

  return {
    address,
    datumInlined,
    datumHash,
    value: {
      coin,
      assets: assetsMap && decodeAssetMap(assetsMap),
    },
  };
};
