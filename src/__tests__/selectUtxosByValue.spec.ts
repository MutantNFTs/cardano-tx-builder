import { getMinAssetMapCost } from "../getMinUTxOCost";
import { selectUtxosByValue } from "../selectUtxosByValue";

describe("selectUtxosByValue", () => {
  test("should work for simple lovelace values", () => {
    const utxo = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 0,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 49963577n,
          },
        },
        coin: 1500000n,
      },
    };

    expect(
      selectUtxosByValue([utxo], {
        coin: 1000000n,
      })
    ).toEqual({
      fulfilled: true,
      selectedUtxos: [utxo],
      totalValueSelected: utxo.value,
    });
  });

  test("should work for simple asset values", () => {
    const utxo = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 0,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 1500000n,
      },
    };

    expect(
      selectUtxosByValue([utxo], {
        coin: 1000000n,
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
      })
    ).toEqual({
      fulfilled: true,
      missing: undefined,
      selectedUtxos: [utxo],
      totalValueSelected: utxo.value,
    });
  });

  test("should work for composed lovelace values", () => {
    const utxo1 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 0,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 49963577n,
          },
        },
        coin: 1500000n,
      },
    };
    const utxo2 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 1,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 49963577n,
          },
        },
        coin: 5500000n,
      },
    };
    const utxo3 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 2,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 49963577n,
          },
        },
        coin: 1500000n,
      },
    };

    const result = selectUtxosByValue([utxo1, utxo2, utxo3], {
      coin: 7000000n,
    });

    expect(result).toEqual({
      fulfilled: true,
      missing: undefined,
      selectedUtxos: [utxo2, utxo1, utxo3],
      totalValueSelected: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 149890731n,
          },
        },
        coin: 8500000n,
      },
    });

    expect(
      getMinAssetMapCost({
        "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
          "4d494e": 149890731n,
        },
      })
    ).toBeLessThan(1500000n);
  });

  test("should work for composed values with lovelace and assets", () => {
    const utxo1 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 0,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 1500000n,
      },
    };

    const utxo2 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 1,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 5500000n,
      },
    };

    const utxo3 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 2,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 1500000n,
      },
    };

    const result = selectUtxosByValue([utxo1, utxo2, utxo3], {
      coin: 5000000n,
      assets: {
        "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
          "4d494e": 2n,
        },
      },
    });

    expect(result).toEqual({
      fulfilled: true,
      missing: undefined,
      selectedUtxos: [utxo1, utxo2],
      totalValueSelected: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 2n,
          },
        },
        coin: 7000000n,
      },
    });
  });

  test("should prioritize large coin inputs", () => {
    const utxo1 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 0,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 1500000n,
      },
    };

    const utxo2 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 1,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 5500000n,
      },
    };

    const utxo3 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 2,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 100000000n,
      },
    };

    const result = selectUtxosByValue([utxo1, utxo2, utxo3], {
      coin: 5000000n,
    });

    expect(result).toEqual({
      fulfilled: true,
      missing: undefined,
      selectedUtxos: [utxo3],
      totalValueSelected: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 100000000n,
      },
    });
  });

  test("should work correctly when there are missing values", () => {
    const utxo1 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 0,
      value: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 1500000n,
      },
    };

    const utxo2 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 1,
      value: {
        coin: 5500000n,
      },
    };

    const utxo3 = {
      address:
        "addr1q8ew6zde7g6nke27dad7drpqnam4zvy0d66vatvnr9l47vu85wjp4jxccnf3kuk7n46w83vtkjef2kfm5ecrsascrddqvscrlx",
      txHash:
        "aab914f4b36f15b85bc2cd94309bd88b367dc27a1e5b5744773213f527f36eef",
      txIndex: 2,
      value: {
        coin: 1500000n,
      },
    };

    const result = selectUtxosByValue([utxo2, utxo1, utxo3], {
      coin: 7000000n,
      assets: {
        "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
          "4d494e": 2n,
        },
      },
    });

    expect(result).toEqual({
      fulfilled: false,
      missing: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 0n,
      },
      selectedUtxos: [utxo1, utxo2, utxo3],
      totalValueSelected: {
        assets: {
          "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
            "4d494e": 1n,
          },
        },
        coin: 8500000n,
      },
    });
  });
});
