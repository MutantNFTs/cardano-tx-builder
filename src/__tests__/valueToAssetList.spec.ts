import { valueToAssetList } from "../valueToAssetList";

describe("valueToAssetList", () => {
  test("should correctly convert a value to an asset list", () => {
    expect(
      valueToAssetList({
        coin: 5000000n,
        assets: {
          policyId1: {
            assetName1: 2n,
          },
          policyId2: {
            assetName1: 15n,
          },
        },
      })
    ).toEqual([
      { quantity: 5000000n, unit: "lovelace" },
      { quantity: 2n, unit: "policyId1assetName1" },
      { quantity: 15n, unit: "policyId2assetName1" },
    ]);
  });
});
