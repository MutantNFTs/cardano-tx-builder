import { encode } from "cbor";

import {
  MOCK_ADDRESSES,
  MOCK_ASSET_NAMES,
  MOCK_POLICY_IDS,
} from "../__mocks__/mocks";
import { encodeOutputs } from "../encodeOutputs";
import { TxOut } from "../types";

describe("encodeOutputs", () => {
  test("should correctly encode a simple ADA output", () => {
    expect(
      encode(
        encodeOutputs([
          {
            address: MOCK_ADDRESSES.A,
            value: {
              coin: 50_000_000,
            },
          },
        ])
      ).toString("hex")
    ).toEqual(
      "81a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080"
    );
  });

  test("should correctly encode an output with ADA and assets", () => {
    expect(
      encode(
        encodeOutputs([
          {
            address: MOCK_ADDRESSES.A,
            value: {
              coin: 50_000_000,
              assets: {
                [MOCK_POLICY_IDS.A]: {
                  [MOCK_ASSET_NAMES.A]: 1n,
                },
              },
            },
          },
        ])
      ).toString("hex")
    ).toEqual(
      "81a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a02faf080a1581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701"
    );
  });

  test("should correctly encode an output with ADA, assets and inline datum", () => {
    const output: TxOut = {
      address: MOCK_ADDRESSES.A,
      value: {
        coin: 50_000_000,
        assets: {
          [MOCK_POLICY_IDS.A]: {
            [MOCK_ASSET_NAMES.A]: 1n,
          },
        },
      },
      datumInlined:
        "9f47454e434f494e5347506f6c6c202333581c87a3a41ac8d8c4d31b72de9d74e3c58bb4b295593ba6703876181b5a43596573ff",
    };

    expect(encode(encodeOutputs([output])).toString("hex")).toEqual(
      "81a300583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a02faf080a1581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701028201d81858349f47454e434f494e5347506f6c6c202333581c87a3a41ac8d8c4d31b72de9d74e3c58bb4b295593ba6703876181b5a43596573ff"
    );
  });

  test("should correctly encode an output with ADA, assets and datum hash", () => {
    const output: TxOut = {
      address: MOCK_ADDRESSES.A,
      value: {
        coin: 50_000_000,
        assets: {
          [MOCK_POLICY_IDS.A]: {
            [MOCK_ASSET_NAMES.A]: 1n,
          },
        },
      },
      datumHash:
        "815b18757c19dfbcf303f6f2f215c30a67b53dfe8f3f3a3a3e7a408fd9d9d34c",
    };

    expect(encode(encodeOutputs([output])).toString("hex")).toEqual(
      "81a300583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a02faf080a1581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e5432353537010282005820815b18757c19dfbcf303f6f2f215c30a67b53dfe8f3f3a3a3e7a408fd9d9d34c"
    );
  });

  test("should correctly encode an output with ordered assets and policys", () => {
    const output: TxOut = {
      address: MOCK_ADDRESSES.A,
      value: {
        coin: 50_000_000,
        assets: {
          [MOCK_POLICY_IDS.B]: {
            [MOCK_ASSET_NAMES.B]: 1n,
            [MOCK_ASSET_NAMES.C]: 1n,
          },
          [MOCK_POLICY_IDS.A]: {
            [MOCK_ASSET_NAMES.A]: 1n,
          },
        },
      },
      datumHash:
        "815b18757c19dfbcf303f6f2f215c30a67b53dfe8f3f3a3a3e7a408fd9d9d34c",
    };

    expect(encode(encodeOutputs([output])).toString("hex")).toEqual(
      "81a300583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a02faf080a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa2495052454431333834330149505245443133383434010282005820815b18757c19dfbcf303f6f2f215c30a67b53dfe8f3f3a3a3e7a408fd9d9d34c"
    );
  });
});
