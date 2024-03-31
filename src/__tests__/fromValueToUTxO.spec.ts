import {
  MOCK_ADDRESSES,
  MOCK_ASSET_NAMES,
  MOCK_POLICY_IDS,
} from "../__mocks__/mocks";
import { fromValueToUTxO } from "../fromValueToUTxO";

describe("fromValueToUTxO", () => {
  test("should create a utxo from a value", () => {
    expect(
      fromValueToUTxO(
        MOCK_ADDRESSES.A,
        {
          coin: 1000000,
          assets: {
            [MOCK_POLICY_IDS.A]: {
              [MOCK_ASSET_NAMES.A]: 1n,
            },
          },
        },
        "1234"
      )
    ).toEqual({
      address:
        "addr1qxkaaxnrta2gl2tmve4jtn608mjds6hdeqak923vx7zmu2zspmvua0r4xhzvf8y63u6pfj35m007mf8u52wqdnx2m00sxl7kzz",
      datumInlined: "1234",
      value: {
        assets: {
          "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411": {
            "000de1404d5554414e5432353537": 1n,
          },
        },
        coin: 1224040,
      },
    });
  });
});
