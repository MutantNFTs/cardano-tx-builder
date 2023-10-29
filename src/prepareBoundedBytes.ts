import { Encoder, Simple } from "cbor";

export const prepareBoundedBytes = (str: string) => {
  const strChunks = str.match(/.{1,64}/g);
  const strArray = strChunks?.map((addrPart) => Buffer.from(addrPart));

  if (!strArray) {
    throw new Error("Invalid bounded bytes string - " + str);
  }

  if (strArray.length === 1) {
    return Buffer.from(str);
  }

  /**
   * We have to split the addr into an indefinite length byte
   * that contains N chunks of 64 bytes
   */
  (strArray as unknown as Simple).encodeCBOR = (gen: Encoder) => {
    gen.push("5f", "hex");

    for (const buffer of strArray) {
      gen.pushAny(buffer);
    }

    gen.push("ff", "hex");

    return true;
  };

  return strArray;
};
