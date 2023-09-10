import { encode, Tagged } from "cbor";

import { PlutusData, PlutusDataField, PlutusDataFieldValue } from "./types";

export const tagPlutusData = (plutusData: PlutusData): Tagged => {
  const tagNumber = 121 + plutusData.constructor;
  const fields = plutusData.fields.map((field) => wrapPlutusDataField(field));

  return new Tagged(tagNumber, fields);
};

export const wrapPlutusDataField = (
  field: PlutusDataField
): PlutusDataFieldValue => {
  if (field.bytes) {
    return field.bytes instanceof Buffer
      ? encode(field.bytes)
      : encode(Buffer.from(field.bytes, "hex"));
  } else if (field.list) {
    return field.list.map<PlutusDataFieldValue>((item) =>
      wrapPlutusDataField(item)
    );
  } else if (field.int) {
    return field.int;
  } else if (field.map) {
    return field.map;
  } else if (field.plutusData) {
    return tagPlutusData(field.plutusData);
  }

  throw new Error("Invalid PlutusDataField");
};
