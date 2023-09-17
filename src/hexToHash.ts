import { blake2bHex } from "blakejs";

export const hexToHash = (value: string) => {
  return blake2bHex(Buffer.from(value, "hex"), undefined, 32);
};
