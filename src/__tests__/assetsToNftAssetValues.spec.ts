import { MOCK_ASSETS } from "../__mocks__/mocks";
import { assetsToNftAssetValues } from "../assetsToNftAssetValues";

describe("assetsToNftAssetValues", () => {
  test("should convert a list of asset strings to a list of AssetValues with quantity 1", () => {
    expect(assetsToNftAssetValues([MOCK_ASSETS.A, MOCK_ASSETS.B])).toEqual([
      {
        unit: MOCK_ASSETS.A,
        quantity: 1n,
      },
      {
        unit: MOCK_ASSETS.B,
        quantity: 1n,
      },
    ]);
  });
});
