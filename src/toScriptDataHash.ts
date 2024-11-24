import { encode } from "cbor";

import { hexToHash } from "./hexToHash";
import { tagPlutusData } from "./tagPlutusData";
import { PlutusData, Redeemer } from "./types";

export const toScriptDataHash = (
  redeemers: string | Redeemer[],
  plutusDatas: string | PlutusData[],
  encodedCostModel: string
) => {
  console.log("toScriptDataHash", {
    redeemers,
    plutusDatas,
    encodedCostModel,
  });

  const encodedPlutusDatas =
    typeof plutusDatas === "string"
      ? plutusDatas
      : encode(
          plutusDatas.map((plutusData) => tagPlutusData(plutusData))
        ).toString("hex");

  const encodedRedeemers =
    typeof redeemers === "string"
      ? redeemers
      : encode(redeemers).toString("hex");

  return hexToHash(encodedRedeemers + encodedPlutusDatas + encodedCostModel);
};
