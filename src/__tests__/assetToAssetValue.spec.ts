import { MOCK_ASSETS } from "../__mocks__/mocks";
import { assetToAssetValue } from "../assetToAssetValue";

describe("assetToAssetValue", () => {
  test("should convert an asset string to an AssetValue", () => {
    expect(assetToAssetValue(MOCK_ASSETS.A, 1n)).toEqual({
      unit: MOCK_ASSETS.A,
      quantity: 1n,
    });
  });
});
