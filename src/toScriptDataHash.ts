import { encode } from "cbor";

import { hexToHash } from "./hexToHash";
import { tagPlutusData } from "./tagPlutusData";
import { PlutusData, Redeemer } from "./types";

export const toScriptDataHash = (
  redeemers: Redeemer[],
  plutusDatas: string | PlutusData[],
  encodedCostModel: string
) => {
  const encodedRedeemers = encode(redeemers).toString("hex");
  const encodedPlutusDatas =
    typeof plutusDatas === "string"
      ? plutusDatas
      : encode(
          plutusDatas.map((plutusData) => tagPlutusData(plutusData))
        ).toString("hex");

  console.log("Generating script data hash", {
    encodedRedeemers,
    encodedPlutusDatas,
    encodedCostModel,
  });

  return hexToHash(
    encode(redeemers).toString("hex") + encodedPlutusDatas + encodedCostModel
  );
};
