import { ValueBuilder } from "../valueBuilder";

describe("ValueBuilder", () => {
  const mockPolicyId1 =
    "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411";
  const mockPolicyId2 =
    "73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4a";
  const mockAssetName1 = "000de1404d5554414e5432353537";
  const mockAssetName2 = "505245443133383433";

  let valueBuilder: ValueBuilder;

  beforeEach(() => {
    valueBuilder = new ValueBuilder();
  });

  test("should initialize empty", () => {
    expect(valueBuilder.isEmpty()).toBe(true);
  });

  describe("when I add an asset that still does not exist", () => {
    beforeEach(() => {
      valueBuilder.addAsset(mockPolicyId1 + mockAssetName1, 1n);
    });

    it("should add the asset to the map", () => {
      expect(valueBuilder.build()).toEqual({
        coin: 0n,
        assets: { [mockPolicyId1]: { [mockAssetName1]: 1n } },
      });
    });

    describe("when I remove the asset", () => {
      beforeEach(() => {
        valueBuilder.addAsset(mockPolicyId1 + mockAssetName1, -1n);
      });

      it("should return an empty map", () => {
        expect(valueBuilder.build()).toEqual({
          coin: 0n,
          assets: {},
        });
      });

      it("should return isEmpty as true", () => {
        expect(valueBuilder.isEmpty()).toBe(true);
      });

      describe("when I remove the asset again", () => {
        beforeEach(() => {
          valueBuilder.addAsset(mockPolicyId1 + mockAssetName1, -1n);
        });

        it("should return the asset with quantity -1", () => {
          expect(valueBuilder.build()).toEqual({
            coin: 0n,
            assets: {
              [mockPolicyId1]: { [mockAssetName1]: -1n },
            },
          });
        });

        it("should return isEmpty as true", () => {
          expect(valueBuilder.isEmpty()).toBe(true);
        });

        it("should return the asset on getNegativeValues", () => {
          expect(valueBuilder.getNegativeValues()).toEqual({
            assets: {
              "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411": {
                "000de1404d5554414e5432353537": -1n,
              },
            },
            coin: 0,
          });
        });

        describe("when I remove 1 ADA", () => {
          beforeEach(() => {
            valueBuilder.addLovelace(-1000000n);
          });

          it("should return -1000000 from getTotalLovelace", () => {
            expect(valueBuilder.getTotalLovelace()).toBe(-1000000n);
          });

          it("should return the asset along with the negative lovelace on getNegativeValues", () => {
            expect(valueBuilder.getNegativeValues()).toEqual({
              assets: {
                "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411": {
                  "000de1404d5554414e5432353537": -1n,
                },
              },
              coin: -1000000n,
            });
          });
        });
      });
    });

    describe("when I add the asset again", () => {
      beforeEach(() => {
        valueBuilder.addAsset(mockPolicyId1 + mockAssetName1, 1n);
      });

      it("should add the asset to the map and return quantity 2", () => {
        expect(valueBuilder.build()).toEqual({
          coin: 0n,
          assets: {
            [mockPolicyId1]: { [mockAssetName1]: 2n },
          },
        });
      });

      describe("when I remove 3 of the same asset", () => {
        beforeEach(() => {
          valueBuilder.addAsset(mockPolicyId1 + mockAssetName1, -3n);
        });

        it("should return the asset with quantity -1", () => {
          expect(valueBuilder.build()).toEqual({
            coin: 0n,
            assets: {
              [mockPolicyId1]: { [mockAssetName1]: -1n },
            },
          });
        });
      });
    });

    describe("when I add an asset of a different policy", () => {
      beforeEach(() => {
        valueBuilder.addAsset(mockPolicyId2 + mockAssetName2, 1n);
      });

      it("should add the new asset and policy to the map", () => {
        expect(valueBuilder.build()).toEqual({
          coin: 0n,
          assets: {
            [mockPolicyId1]: { [mockAssetName1]: 1n },
            [mockPolicyId2]: { [mockAssetName2]: 1n },
          },
        });
      });

      describe("when I remove an asset that does not exist in the map", () => {
        beforeEach(() => {
          valueBuilder.addAsset(mockPolicyId2 + mockAssetName1, -1n);
        });

        it("should create the asset with quantity -1", () => {
          expect(valueBuilder.build()).toEqual({
            coin: 0n,
            assets: {
              [mockPolicyId1]: { [mockAssetName1]: 1n },
              [mockPolicyId2]: { [mockAssetName1]: -1n, [mockAssetName2]: 1n },
            },
          });
        });

        describe("when I call abs()", () => {
          beforeEach(() => {
            valueBuilder.abs();
          });

          it("should return the absolute value of all assets", () => {
            expect(valueBuilder.build()).toEqual({
              coin: 0n,
              assets: {
                [mockPolicyId1]: { [mockAssetName1]: 1n },
                [mockPolicyId2]: { [mockAssetName1]: 1n, [mockAssetName2]: 1n },
              },
            });
          });
        });
      });
    });
  });

  describe("when I load an array of asset values", () => {
    beforeEach(() => {
      valueBuilder.loadValues([
        {
          unit: "lovelace",
          quantity: 1000000n,
        },
        {
          unit: mockPolicyId1 + mockAssetName1,
          quantity: 1n,
        },
        {
          unit: mockPolicyId2 + mockAssetName2,
          quantity: 1n,
        },
        {
          unit: mockPolicyId2 + mockAssetName1,
          quantity: 1n,
        },
      ]);
    });

    it("should return the correct map with all loaded values", () => {
      expect(valueBuilder.build()).toEqual({
        coin: 1000000n,
        assets: {
          [mockPolicyId1]: { [mockAssetName1]: 1n },
          [mockPolicyId2]: { [mockAssetName1]: 1n, [mockAssetName2]: 1n },
        },
      });
    });
  });
});
