// https://github.com/input-output-hk/cardano-ledger/blob/master/eras/babbage/test-suite/cddl-files/babbage.cddl

import { decode, encode } from "cbor";

import { hexToBytes } from "@mutants/cardano-utils";

import PlutusV2CostModel from "./Plutusv2CostModel.json";
import { calculateChange } from "./calculateChange";
import { calculateFee } from "./calculateFee";
import { encodeInputs } from "./encodeInputs";
import { encodeOutput, encodeOutputs } from "./encodeOutputs";
import { tagPlutusData } from "./tagPlutusData";
import { toScriptDataHash } from "./toScriptDataHash";
import {
  PlutusData,
  ProtocolParameters,
  Redeemer,
  TxIn,
  TxOut,
  UTxO,
  VKeyWitness,
} from "./types";

export class TransactionBuilder {
  private inputs: TxIn[] = [];
  private outputs: TxOut[] = [];
  private fee = 0;
  private ttl = 0;
  private collateralInputs: UTxO[] = [];
  private requiredSigners: string[] = [];
  private redeemers: Redeemer[] = [];
  private plutusV2Scripts: string[] = [];
  private plutusDatas: PlutusData[] = [];
  private vKeyWitnesses: VKeyWitness[] = [];
  private withdrawals: Map<Buffer, number> | null = null;
  private validityIntervalStart: number | null = null;
  private totalCollateral = 0;

  /**
   * Initialize a transaction builder.
   *
   * @param protocolParameters The protocol pameters of the currnet epoch.
   * Important: default values should not be used in production.
   */
  constructor(
    private protocolParameters: ProtocolParameters = {
      min_fee_a: 44,
      min_fee_b: 155381,
      price_mem: 0.0577,
      price_step: 0.0000721,
      collateral_percent: 150,
    }
  ) {}

  public setInputs(inputs: TxIn[]) {
    this.inputs = inputs;
  }

  public setOutputs(outputs: TxOut[]) {
    this.outputs = outputs;
  }

  public setTtl(ttl: number) {
    this.ttl = ttl;
  }

  public setWithdrawals(withdrawals: Map<Buffer, number>) {
    this.withdrawals = withdrawals;
  }

  public setValidityIntervalStart(validityIntervalStart: number) {
    this.validityIntervalStart = validityIntervalStart;
  }

  public setCollateralInputs(collateralInputs: UTxO[]) {
    this.collateralInputs = collateralInputs;
  }

  public setRequiredSigners(requiredSigners: string[]) {
    this.requiredSigners = requiredSigners;
  }

  private sortInputs() {
    this.inputs = this.inputs.sort((a, b) => {
      const firstInputBytes = hexToBytes(a.txHash);
      const secondInputBytes = hexToBytes(b.txHash);

      if (firstInputBytes > secondInputBytes) {
        return 1;
      } else if (secondInputBytes > firstInputBytes) {
        return -1;
      }

      return a.txIndex > b.txIndex ? 1 : -1;
    });
  }

  public setFee(fee: number) {
    this.fee = fee;
  }

  public calculateFee() {
    this.setFee(calculateFee(this, this.protocolParameters));
    this.totalCollateral =
      (this.fee * this.protocolParameters.collateral_percent) / 100;
  }

  public setRedeemers(redeemers: Redeemer[]) {
    this.redeemers = redeemers;
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
    /**
      transaction_body =
        { 0 : set<transaction_input>    ; inputs
        , 1 : [* transaction_output]
        , 2 : coin                      ; fee
        , ? 3 : uint                    ; time to live
        , ? 4 : [* certificate]
        , ? 5 : withdrawals
        , ? 6 : update
        , ? 7 : auxiliary_data_hash
        , ? 8 : uint                    ; validity interval start
        , ? 9 : mint
        , ? 11 : script_data_hash
        , ? 13 : set<transaction_input> ; collateral inputs
        , ? 14 : required_signers
        , ? 15 : network_id
        , ? 16 : transaction_output     ; collateral return; New
        , ? 17 : coin                   ; total collateral; New
        , ? 18 : set<transaction_input> ; reference inputs; New
      }
     */
    this.sortInputs(); // This is important to make sure the redeemer tags the correct input index.

    const txBody = new Map();

    txBody.set(0, encodeInputs(this.inputs));
    txBody.set(1, encodeOutputs(this.outputs));
    txBody.set(2, this.fee); // can't serialize BigInt but also don't see a fee going over 2^53

    if (this.ttl) {
      txBody.set(3, this.ttl);
    }

    if (this.withdrawals) {
      txBody.set(5, this.withdrawals);
    }

    if (this.validityIntervalStart !== null) {
      txBody.set(8, this.validityIntervalStart);
    }

    if (this.plutusV2Scripts.length) {
      txBody.set(
        11,
        Buffer.from(
          toScriptDataHash(
            this.redeemers,
            this.plutusDatas,
            PlutusV2CostModel.costModel
          ),
          "hex"
        )
      );
    }

    if (this.collateralInputs.length) {
      txBody.set(13, encodeInputs(this.collateralInputs));
    }

    if (this.requiredSigners.length) {
      txBody.set(
        14,
        this.requiredSigners.map((signer) => Buffer.from(signer, "hex"))
      );
    }

    if (this.collateralInputs.length) {
      txBody.set(
        16,
        encodeOutput({
          address: this.collateralInputs[0].address,
          value: calculateChange(this.collateralInputs, [
            {
              unit: "lovelace",
              quantity: BigInt(this.totalCollateral || 1000000),
            },
          ]),
        })
      );

      txBody.set(17, this.totalCollateral || 1000000); // Total collateral
    }

    return txBody;
  }

  public buildWitnessSet(): Map<number, unknown> {
    /**
      transaction_witness_set =
      { ? 0: [* vkeywitness ]
      , ? 1: [* native_script ]
      , ? 2: [* bootstrap_witness ]
      , ? 3: [* plutus_v1_script ]
      , ? 4: [* plutus_data ]
      , ? 5: [* redeemer ]
      , ? 6: [* plutus_v2_script ] ; New
      }
     */
    const witnessSet = new Map();

    if (this.vKeyWitnesses.length) {
      witnessSet.set(0, this.vKeyWitnesses);
    }

    if (this.plutusDatas.length) {
      witnessSet.set(
        4,
        this.plutusDatas.map((plutusData) => tagPlutusData(plutusData))
      );
    }

    if (this.redeemers.length) {
      witnessSet.set(
        5,
        this.redeemers.map((redeemer) => [
          redeemer[0],
          redeemer[1],
          tagPlutusData(redeemer[2]),
          redeemer[3],
        ])
      );
    }

    if (this.plutusV2Scripts.length) {
      witnessSet.set(
        6,
        this.plutusV2Scripts.map((script) => Buffer.from(script, "hex"))
      );
    }

    return witnessSet;
  }

  public build(isValid = true, metadata: unknown = null) {
    return [this.buildBody(), this.buildWitnessSet(), isValid, metadata];
  }

  public serialize(): string {
    return encode(this.build()).toString("hex");
  }
}
