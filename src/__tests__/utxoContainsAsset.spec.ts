import { utxoContainsAsset } from "../utxoContainsAsset";

describe("utxoContainsAsset", () => {
  test("should return true when utxo contains asset", () => {
    expect(
      utxoContainsAsset(
        {
          address:
            "addr1q8zem3e2kz7eqnwf5sct6zmdn5anctfjm73aead0l5cfqqh6q2ahx0pt07tggfstcj6nlwr9tj6txxlas7dpyl8ksjeqn8nrly",
          txHash:
            "0ff96c00a61623b5a08d081a9a2d52800c8f4997f43edfbc0a3ce0b16825a490",
          txIndex: 1,
          datumHash: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411",
          value: {
            assets: {
              "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
                "4d494e": 49963577n,
              },
            },
            coin: 4574332,
          },
        },
        "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e"
      )
    ).toBe(true);
  });

  test("should return false when utxo does not contain asset", () => {
    expect(
      utxoContainsAsset(
        {
          address:
            "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
          txHash:
            "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
          txIndex: 0,
          datumHash: "9f47454e434f494e5347506f6c6c202333581c87",
          value: {
            assets: {
              "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
                "494e9834d": 1n,
              },
            },
            coin: 1500000,
          },
        },
        "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e"
      )
    ).toBe(false);
  });

  test("should return false when utxo has no assets", () => {
    expect(
      utxoContainsAsset(
        {
          address:
            "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
          txHash:
            "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
          txIndex: 0,
          datumHash: "9f47454e434f494e5347506f6c6c202333581c87",
          value: {
            assets: undefined,
            coin: 1500000,
          },
        },
        "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e"
      )
    ).toBe(false);
  });
});
