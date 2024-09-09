import { encode } from "cbor";

import { hexToHash } from "./hexToHash";
import { tagPlutusData } from "./tagPlutusData";
import { PlutusData, Redeemer } from "./types";

export const toScriptDataHash = (
  redeemers: Redeemer[],
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

  return hexToHash(
    encode(redeemers).toString("hex") + encodedPlutusDatas + encodedCostModel
  );
};
