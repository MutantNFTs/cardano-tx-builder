import { MOCK_ASSET_NAMES, MOCK_POLICY_IDS } from "../__mocks__/mocks";
import { encodeValueAsMap } from "../encodeValueAsMap";
import { EncodedAssetMap } from "../types";

describe("encodeValueAsMap", () => {
  test("should correctly encode value as map", () => {
    const expectedMap: EncodedAssetMap = new Map();

    const coinMap = new Map<Buffer, number>();
    coinMap.set(Buffer.from(""), 50_000_000);

    expectedMap.set(Buffer.from(""), coinMap);

    expect(
      encodeValueAsMap({
        coin: 50_000_000,
      })
    ).toEqual(expectedMap);
  });

  test("should correctly encode value as map when there are assets", () => {
    const expectedMap: EncodedAssetMap = new Map();

    const coinMap = new Map<Buffer, number>();
    coinMap.set(Buffer.from(""), 50_000_000);

    const policyAssetsMap = new Map<Buffer, number>();
    policyAssetsMap.set(Buffer.from(MOCK_ASSET_NAMES.A, "hex"), 1);

    expectedMap.set(Buffer.from(""), coinMap);
    expectedMap.set(Buffer.from(MOCK_POLICY_IDS.A, "hex"), policyAssetsMap);

    expect(
      encodeValueAsMap({
        coin: 50_000_000,
        assets: {
          [MOCK_POLICY_IDS.A]: {
            [MOCK_ASSET_NAMES.A]: 1n,
          },
        },
      })
    ).toEqual(expectedMap);
  });
});
