import { getAssetDetails } from "@mutants/cardano-utils";

import { AssetMap, AssetValue, Value } from "./types";

export class ValueBuilder {
  private totalLovelace: bigint;
  private assetMap: AssetMap;

  constructor() {
    this.totalLovelace = 0n;
    this.assetMap = {};
  }

  addAsset(asset: string, quantity: bigint) {
    if (asset === "lovelace") {
      this.addLovelace(quantity);
      return;
    }

    const { assetPolicy: policyId, assetName } = getAssetDetails(asset);

    this.assetMap[policyId] = this.assetMap[policyId] || {};
    this.assetMap[policyId][assetName] =
      (this.assetMap[policyId][assetName] || 0n) + quantity;

    if (this.assetMap[policyId][assetName] === 0n) {
      delete this.assetMap[policyId][assetName];

      if (Object.keys(this.assetMap[policyId]).length === 0) {
        delete this.assetMap[policyId];
      }
    }
  }

  private addLovelace(quantity: bigint) {
    this.totalLovelace += quantity;
  }

  /**
   * Take an array of asset values and load them into the map
   * @param values
   */
  loadValues(values: AssetValue[]) {
    for (const value of values) {
      this.addAsset(value.unit, value.quantity);
    }
  }

  /**
   * Makes all asset quantities absolute
   */
  abs() {
    this.totalLovelace = BigInt(Math.abs(Number(this.totalLovelace)));

    for (const policyId of Object.keys(this.assetMap)) {
      for (const assetName of Object.keys(this.assetMap[policyId])) {
        this.assetMap[policyId][assetName] = BigInt(
          Math.abs(Number(this.assetMap[policyId][assetName]))
        );
      }
    }
  }

  build(): Value {
    return {
      coin: this.totalLovelace,
      assets: this.assetMap,
    };
  }
}
