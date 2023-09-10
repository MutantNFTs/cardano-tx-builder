import { TransactionBuilder } from "./transaction.builder";
import { ProtocolParameters } from "./types";

export const calculateFee = (
  transaction: TransactionBuilder,
  protocolParameters: ProtocolParameters,
  estimateFee = 300000
) => {
  transaction.setFee(estimateFee);

  const tx = transaction.serialize();
  const redeemers = transaction.getRedeemers();

  const scriptCost = redeemers.reduce(
    (acc, redeemer) =>
      acc +
      Math.ceil(
        protocolParameters.price_step * redeemer[3][1] +
          protocolParameters.price_mem * redeemer[3][0]
      ),
    0
  );

  return (
    protocolParameters.min_fee_a * tx.length +
    protocolParameters.min_fee_b +
    scriptCost
  );
};
