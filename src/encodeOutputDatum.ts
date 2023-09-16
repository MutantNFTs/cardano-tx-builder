import { Tagged } from "cbor";

import { DatumOption, EncodedDatum } from "./types";

export const encodeOutputDatum = (
  encodedDatum: string,
  option: DatumOption
): EncodedDatum => {
  return option === DatumOption.Inline
    ? [DatumOption.Inline, new Tagged(24, Buffer.from(encodedDatum, "hex"))]
    : [DatumOption.Hash, Buffer.from(encodedDatum, "hex")];
};
