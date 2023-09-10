import { blake2bHex } from "blakejs";
import { encode } from "cbor";

import { Buffer } from "buffer";

import { tagPlutusData } from "./tagPlutusData";
import { PlutusData, Redeemer } from "./types";

const hexToHash = (value: string) => {
  return blake2bHex(Buffer.from(value, "hex"), undefined, 32);
};

export const toScriptDataHash = (
  redeemers: Redeemer[],
  plutusDatas: string | PlutusData[],
  encodedCostModel: string
) => {
  return hexToHash(
    encode(redeemers).toString("hex") +
      (typeof plutusDatas === "string"
        ? plutusDatas
        : encode(
            plutusDatas.map((plutusData) => tagPlutusData(plutusData))
          ).toString("hex")) +
      encodedCostModel
  );
};
