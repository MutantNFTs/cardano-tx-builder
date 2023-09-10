import { Tagged } from "cbor";

enum DatumOption {
  Hash = 0,
  Inlined = 1,
}

export const encodeOutputDatum = (encodedDatum: string): [number, Tagged] => {
  return [DatumOption.Inlined, new Tagged(24, Buffer.from(encodedDatum, "hex"))];
};
