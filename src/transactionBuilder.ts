// https://github.com/input-output-hk/cardano-ledger/blob/master/eras/babbage/test-suite/cddl-files/babbage.cddl

import { decode, encode } from "cbor";

import PlutusV2CostModel from "./Plutusv2CostModel.json";
import { areInputsEqual } from "./areInputsEqual";
import { calculateChange } from "./calculateChange";
import { calculateFee } from "./calculateFee";
import { BabbageTransactionBody, BabbageWitnessSet } from "./constants";
import { encodeInputs } from "./encodeInputs";
import { encodeOutput, encodeOutputs } from "./encodeOutputs";
import { findInputIndex } from "./findInputIndex";
import { sortInputs } from "./sortInputs";
import { tagPlutusData } from "./tagPlutusData";
import { toScriptDataHash } from "./toScriptDataHash";
import {
  DecodedTransaction,
  ExUnits,
  PlutusData,
  PreBuildRedeemer,
  ProtocolParameters,
  Redeemer,
  RedeemerEvaluation,
  TxIn,
  TxOut,
  UTxO,
  VKeyWitness,
} from "./types";

export class TransactionBuilder {
  private inputs: UTxO[] = [];
  private referenceInputs: TxIn[] = [];
  private outputs: TxOut[] = [];
  private fee = 0;
  private ttl = 0;
  private collateralInputs: UTxO[] = [];
  private requiredSigners: string[] = [];
  private redeemers: Redeemer[] = [];
  private preBuildRedeemers: PreBuildRedeemer[] = [];
  private plutusV2Scripts: string[] = [];
  private plutusDatas: PlutusData[] = [];
  private vKeyWitnesses: VKeyWitness[] = [];
  private changeAddress: string | null = null;
  private totalCollateral = 0;

  /**
   * Initialize a transaction builder.
   *
   * @param protocolParameters The protocol pameters of the current epoch.
   * Important: default values should not be used in production.
   */
  constructor(
    private protocolParameters: ProtocolParameters = {
      min_fee_a: 44,
      min_fee_b: 155381,
      price_mem: 0.0577,
      price_step: 0.0000721,
      collateral_percent: 150,
      coins_per_utxo_word: "4310",
    }
  ) {}

  public setInputs(inputs: UTxO[]) {
    this.inputs = inputs;
  }

  public setReferenceInputs(inputs: TxIn[]) {
    this.referenceInputs = inputs;
  }

  public setOutputs(outputs: TxOut[]) {
    this.outputs = outputs;
  }

  public setTtl(ttl: number) {
    this.ttl = ttl;
  }

  public setCollateralInputs(collateralInputs: UTxO[]) {
    this.collateralInputs = collateralInputs;
  }

  public setProtocolParameters(protocolParameters: ProtocolParameters) {
    this.protocolParameters = protocolParameters;
  }

  public setRequiredSigners(requiredSigners: string[]) {
    this.requiredSigners = requiredSigners;
  }

  public setChangeAddress(address: string | null) {
    this.changeAddress = address;
  }

  public setFee(fee: number) {
    this.fee = fee;
  }

  public calculateFee() {
    this.buildRedeemers();

    this.setFee(calculateFee(this, this.protocolParameters));
    this.totalCollateral =
      (this.fee * (this.protocolParameters.collateral_percent || 150)) / 100;
  }

  private buildRedeemers() {
    if (this.preBuildRedeemers.length) {
      this.redeemers = this.preBuildRedeemers.map((redeemer) => [
        redeemer[0],
        findInputIndex(this.inputs, redeemer[1]),
        tagPlutusData(redeemer[2]),
        redeemer[3],
      ]);
    }
  }

  public setRedeemers(redeemers: PreBuildRedeemer[]) {
    this.preBuildRedeemers = redeemers;
  }

  public setPlutusDatas(plutusDatas: PlutusData[]) {
    this.plutusDatas = plutusDatas;
  }

  public setEncodedVKeyWitnesses(cborVkeyWitness: string) {
    const decodedVkeyWitness = decode(cborVkeyWitness) as
      | Map<0, VKeyWitness[]>
      | VKeyWitness[];

    if (Array.isArray(decodedVkeyWitness)) {
      this.vKeyWitnesses = decodedVkeyWitness;
    } else if (decodedVkeyWitness instanceof Map) {
      const arr = decodedVkeyWitness.get(0);

      this.vKeyWitnesses = Array.isArray(arr) ? arr : [];
    }
  }

  public setPlutusV2Scripts(scripts: string[]) {
    this.plutusV2Scripts = scripts;
  }

  public getRedeemers() {
    return this.redeemers;
  }

  public buildBody(): Map<number, unknown> {
    this.inputs = sortInputs(this.inputs); // This is important to make sure the redeemer tags the correct input index.

    const txBody = new Map();

    // Simulate an output with current fee value, to make sure
    // we have the necessary coin input.
    const feeOutput = {
      address: this.inputs[0].address,
      value: {
        coin: this.fee,
      },
    };

    const change = calculateChange(this.inputs, [...this.outputs, feeOutput]);

    const changeOutput = {
      address: this.changeAddress || this.inputs[0].address,
      value: change,
    };

    txBody.set(BabbageTransactionBody.Inputs, encodeInputs(this.inputs));
    txBody.set(
      BabbageTransactionBody.Outputs,
      encodeOutputs([...this.outputs, changeOutput])
    );
    txBody.set(BabbageTransactionBody.Fee, this.fee); // can't serialize BigInt but also don't see a fee going over 2^53

    if (this.ttl) {
      txBody.set(BabbageTransactionBody.TTL, this.ttl);
    }

    // TODO: Implement withdrawals
    // if (this.withdrawals) {
    //   txBody.set(BabbageTransactionBody.Withdrawals, this.withdrawals);
    // }

    // TODO: Implement validity interval start
    // if (this.validityIntervalStart !== null) {
    //   txBody.set(
    //     BabbageTransactionBody.ValidityIntervalStart,
    //     this.validityIntervalStart
    //   );
    // }

    if (
      this.plutusV2Scripts.length ||
      this.referenceInputs.some((referenceInput) => referenceInput.hasScript)
    ) {
      txBody.set(
        BabbageTransactionBody.ScriptDataHash,
        Buffer.from(
          toScriptDataHash(
            this.redeemers,
            this.plutusDatas.length ? this.plutusDatas : "",
            PlutusV2CostModel.costModel
          ),
          "hex"
        )
      );
    }

    if (this.collateralInputs.length) {
      txBody.set(
        BabbageTransactionBody.CollateralInputs,
        encodeInputs(this.collateralInputs)
      );
    }

    if (this.requiredSigners.length) {
      txBody.set(
        BabbageTransactionBody.RequiredSigners,
        this.requiredSigners.map((signer) => Buffer.from(signer, "hex"))
      );
    }

    if (this.collateralInputs.length) {
      const totalCollateral =
        BigInt(this.totalCollateral.toFixed(0)) || 1000000n;

      const expectedCollateralOutput: TxOut = {
        address: "", // doesn't matter, it's just to calculate change
        value: {
          coin: totalCollateral,
        },
      };

      txBody.set(
        BabbageTransactionBody.CollateralReturn,
        encodeOutput({
          address: this.collateralInputs[0].address,
          value: calculateChange(this.collateralInputs, [
            expectedCollateralOutput,
          ]),
        })
      );

      txBody.set(
        BabbageTransactionBody.TotalCollateral,
        parseInt(totalCollateral.toString())
      );
    }

    if (this.referenceInputs.length) {
      txBody.set(
        BabbageTransactionBody.ReferenceInputs,
        encodeInputs(this.referenceInputs)
      );
    }

    return txBody;
  }

  public buildWitnessSet(): Map<number, unknown> {
    const witnessSet = new Map();

    if (this.vKeyWitnesses.length) {
      witnessSet.set(BabbageWitnessSet.VKeyWitness, this.vKeyWitnesses);
    }

    if (this.plutusDatas.length || this.plutusV2Scripts.length) {
      witnessSet.set(
        BabbageWitnessSet.PlutusData,
        this.plutusDatas.map((plutusData) => tagPlutusData(plutusData))
      );
    }

    if (this.preBuildRedeemers.length) {
      witnessSet.set(
        BabbageWitnessSet.Redeemer,
        this.preBuildRedeemers.map((redeemer) => [
          redeemer[0],
          findInputIndex(this.inputs, redeemer[1]),
          tagPlutusData(redeemer[2]),
          redeemer[3],
        ])
      );
    }

    if (this.plutusV2Scripts.length) {
      witnessSet.set(
        BabbageWitnessSet.PlutusV2Script,
        this.plutusV2Scripts.map((script) => Buffer.from(script, "hex"))
      );
    }

    return witnessSet;
  }

  public build(isValid = true, metadata: unknown = null): DecodedTransaction {
    return [this.buildBody(), this.buildWitnessSet(), isValid, metadata];
  }

  public evaluateRedeemerByTxIn(txIn: TxIn, exUnits: ExUnits) {
    for (const redeemer of this.preBuildRedeemers) {
      if (areInputsEqual(redeemer[1], txIn)) {
        redeemer[3] = exUnits;
      }
    }
  }

  public evaluateRedeemerByTagIndex(
    tag: number,
    index: number,
    exUnits: ExUnits
  ) {
    this.inputs = sortInputs(this.inputs);

    for (const redeemer of this.preBuildRedeemers) {
      const redeemerIndex = this.inputs.findIndex(
        (input) =>
          input.txHash === redeemer[1].txHash &&
          input.txIndex === redeemer[1].txIndex
      );

      if (redeemer[0] === tag && redeemerIndex === index) {
        redeemer[3] = exUnits;
      }
    }
  }

  public setRedeemerEvaluations(evaluations: RedeemerEvaluation[]) {
    for (const evaluation of evaluations) {
      this.evaluateRedeemerByTagIndex(evaluation.tag, evaluation.index, [
        evaluation.memory,
        evaluation.steps,
      ]);
    }
  }

  public serialize(): string {
    return encode(this.build()).toString("hex");
  }
}
