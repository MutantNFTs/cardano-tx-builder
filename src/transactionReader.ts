import { decode } from "cbor";

import { BabbageTransactionBody } from "./constants";
import { decodeInput } from "./decodeInput";
import { decodeOutput } from "./decodeOutput";
import {
  DecodedTransaction,
  EncodedInput,
  EncodedOutput,
  EncodedRequiredSigners,
  PostAlonzoEncodedOutput,
  TxIn,
  TxOut,
} from "./types";

export class TransactionReader {
  private body: Map<number, unknown>;
  private inputs: TxIn[] = [];
  private outputs: TxOut[] = [];
  private requiredSigners: string[] = [];

  constructor(tx: string) {
    const decoded = decode(tx) as DecodedTransaction;

    this.body = decoded[0];
    this.decodeInputs();
    this.decodeOutputs();
    this.decodeRequiredSigners();
  }

  private decodeInputs() {
    const encodedInputs = this.body.get(
      BabbageTransactionBody.Inputs
    ) as EncodedInput[];

    for (const encodedInput of encodedInputs) {
      this.inputs.push(decodeInput(encodedInput));
    }
  }

  private decodeOutputs() {
    const encodedOutputs = this.body.get(BabbageTransactionBody.Outputs) as
      | EncodedOutput[]
      | PostAlonzoEncodedOutput[];

    for (const encodedOutput of encodedOutputs) {
      this.outputs.push(decodeOutput(encodedOutput));
    }
  }

  private decodeRequiredSigners() {
    const encodedRequiredSigners = this.body.get(
      BabbageTransactionBody.RequiredSigners
    ) as EncodedRequiredSigners | undefined;

    if (!encodedRequiredSigners) {
      return;
    }

    for (const requiredSigner of encodedRequiredSigners) {
      this.requiredSigners.push(requiredSigner.toString("hex"));
    }
  }

  public getOutputs(): TxOut[] {
    return this.outputs;
  }

  public getInputs(): TxIn[] {
    return this.inputs;
  }

  public getRequiredSigners(): string[] {
    return this.requiredSigners;
  }
}
