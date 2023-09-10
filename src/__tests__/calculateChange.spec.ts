import { calculateChange } from "../calculateChange";
import { Value } from "../types";

describe("calculateChange", () => {
  let change: Value;

  beforeEach(() => {
    change = calculateChange(
      [
        {
          txHash: "txHash1",
          txIndex: 0,
          address:
            "addr1q8gqarkxy3k5xu4k8ywlur5z6pp0f9eev4ps08wz3zdjkwm6jsglxzcktpmlgc9lhgh48fcge3wwkthk98whdx2a9mss54dtup",
          value: {
            coin: 1344798n,
            assets: {
              ffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d8e: {
                "4d5554414e54": 176498n,
                "4d5554414e55": 1n,
              },
            },
          },
        },
        {
          txHash: "txHash2",
          txIndex: 0,
          address:
            "addr1qyyfd44x5uxr56una2v67x48xuq5w6ceytffu08ac8q685g00vk8lzfy22xhj750smvzzrtzwmsf73ac9mx48gjfqrnsscxmgd",
          value: {
            coin: 1344798n,
            assets: {
              ffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d8e: {
                "4d5554414e54": 5000n,
                "4d5554414e55": 2n,
              },
              ffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d89: {
                "4d5554414e55": 1n,
              },
            },
          },
        },
      ],
      [
        {
          unit: "lovelace",
          quantity: 1000000n,
        },
        {
          unit: "ffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d8e4d5554414e54",
          quantity: 2500n,
        },
      ]
    );
  });

  it("should return the correct change", () => {
    expect(change).toEqual({
      coin: 1344798n * 2n - 1000000n,
      assets: {
        ffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d8e: {
          "4d5554414e54": 2500n + 176498n,
          "4d5554414e55": 3n,
        },
        ffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d89: {
          "4d5554414e55": 1n,
        },
      },
    });
  });
});
