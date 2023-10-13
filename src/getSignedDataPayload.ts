import { decode } from "cbor";

import { hexToString } from "@mutants/cardano-utils";

import { EncodedSignedData } from "./types";

export const getSignedDataPayload = (signature: string) => {
  const decodedSignature = decode(signature) as EncodedSignedData;

  const payload = decodedSignature[2].toString("hex");

  return hexToString(payload);
};
