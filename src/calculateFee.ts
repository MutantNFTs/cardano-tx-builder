import { TransactionBuilder } from "./transactionBuilder";
import { ProtocolParameters } from "./types";

export const calculateFee = (
  transaction: TransactionBuilder,
  protocolParameters: ProtocolParameters,
  estimateFee = 1000000
) => {
  transaction.setFee(estimateFee);

  const tx = transaction.serialize();
  const redeemers = transaction.getRedeemers();

  const scriptCost = redeemers.reduce(
    (acc, redeemer) =>
      acc +
      Math.ceil(
        (protocolParameters.price_step || 0.0577) * redeemer[3][1] +
          (protocolParameters.price_mem || 0.0000721) * redeemer[3][0]
      ),
    0
  );

  return (
    protocolParameters.min_fee_a * tx.length +
    protocolParameters.min_fee_b +
    scriptCost
  );
};
