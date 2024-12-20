import { encode, Encoder, Simple } from "cbor";

import { tagPlutusData } from "../tagPlutusData";
import { PlutusDataField } from "../types";

describe("tagPlutusData", () => {
  it("should correctly create a tagged plutus data", () => {
    expect(
      encode(
        tagPlutusData({
          constructor: 0,
          fields: [
            {
              bytes: "4d5554414e54",
            },
            {
              bytes: Buffer.from("4d5554414e54", "hex"),
            },
            {
              int: 123,
            },
            {
              list: [
                {
                  plutusData: {
                    constructor: 0,
                    fields: [],
                  },
                },
                {
                  int: 321,
                },
              ],
            },
            {
              map: new Map<Buffer, Buffer>([
                [Buffer.from("name"), Buffer.from("Mutant #7890")],
              ]),
            },
            {
              plutusData: {
                constructor: 0,
                fields: [
                  {
                    int: 100,
                  },
                ],
              },
            },
          ],
        })
      ).toString("hex")
    ).toBe(
      "d87986464d5554414e54464d5554414e54187b82d87980190141a1446e616d654c4d7574616e74202337383930d879811864"
    );
  });

  it("should correctly create a tagged plutus data with indefinite length encoder", () => {
    const fields = [
      {
        bytes: "4d5554414e54",
      },
      {
        bytes: Buffer.from("4d5554414e54", "hex"),
      },
      {
        int: 123,
      },
      {
        list: [
          {
            plutusData: {
              constructor: 0,
              fields: [],
            },
          },
          {
            int: 321,
          },
        ],
      },
      {
        map: new Map<Buffer, Buffer>([
          [Buffer.from("name"), Buffer.from("Mutant #7890")],
        ]),
      },
      {
        plutusData: {
          constructor: 0,
          fields: [
            {
              int: 100,
            },
          ],
        },
      },
    ];

    (fields as unknown as Simple).encodeCBOR = Encoder.encodeIndefinite;

    expect(
      encode(
        tagPlutusData({
          constructor: 0,
          fields,
        })
      ).toString("hex")
    ).toBe(
      "d8799f464d5554414e54464d5554414e54187b82d87980190141a1446e616d654c4d7574616e74202337383930d879811864ff"
    );
  });

  it("should throw an error when one of the fields has an invalid type", () => {
    expect(
      () =>
        tagPlutusData({
          constructor: 0,
          fields: [{ asd: 123 } as unknown as PlutusDataField],
        }) as unknown
    ).toThrow("Invalid PlutusDataField");
  });
});
