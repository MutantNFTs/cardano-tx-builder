import { MOCK_TX_HASHES } from "./__mocks__/mocks";
import { getMinUTxOCost } from "./getMinUTxOCost";
import { Value } from "./types";

/**
 * This function makes sure we create a valid UTxO from a value,
 * respecting the min UTxO value.
 */
export const fromValueToUTxO = (
  address: string,
  value: Value,
  datumInlined?: string
) => {
  const txOut = {
    address,
    value,
    datumInlined,
  };

  return {
    ...txOut,
    value: {
      ...txOut.value,
      coin: Math.max(
        parseFloat(
          getMinUTxOCost({
            ...txOut,
            value: {
              ...txOut.value,
              coin: 1000000, // otherwise the min value is miscalculated
            },
            txHash: MOCK_TX_HASHES.A,
            txIndex: 0,
          }).toString()
        ),
        parseFloat(txOut.value.coin.toString())
      ),
    },
  };
};
