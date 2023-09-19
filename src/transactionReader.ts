import { decode } from "cbor";

import { decodeInput } from "./decodeInput";
import { decodeOutput } from "./decodeOutput";
import {
  DecodedTransaction,
  EncodedInput,
  EncodedOutput,
  PostAlonzoEncodedOutput,
  TxIn,
  TxOut,
} from "./types";

export class TransactionReader {
  private body: Map<number, unknown>;
  private inputs: TxIn[] = [];
  private outputs: TxOut[] = [];

  constructor(tx: string) {
    const decoded = decode(tx) as DecodedTransaction;

    this.body = decoded[0];
    this.decodeInputs();
    this.decodeOutputs();
  }

  private decodeInputs() {
    const encodedInputs = this.body.get(0) as EncodedInput[];

    for (const encodedInput of encodedInputs) {
      this.inputs.push(decodeInput(encodedInput));
    }
  }

  private decodeOutputs() {
    const encodedOutputs = this.body.get(1) as
      | EncodedOutput[]
      | PostAlonzoEncodedOutput[];

    for (const encodedOutput of encodedOutputs) {
      this.outputs.push(decodeOutput(encodedOutput));
    }
  }

  public getOutputs(): TxOut[] {
    return this.outputs;
  }

  public getInputs(): TxIn[] {
    return this.inputs;
  }
}
