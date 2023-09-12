import { getAssetDetails } from "@mutants/cardano-utils";

import { assetListToMap } from "./assetListToMap";
import { assetMapToList } from "./assetMapToList";
import { getMinAssetMapCost } from "./getMinUTxOCost";
import {
  AssetMap,
  AssetValue,
  BlockfrostAssetValue,
  UTxO,
  Value,
} from "./types";

export class ValueBuilder {
  private totalLovelace: bigint;
  private utxos: UTxO[];
  private assetMap: AssetMap;

  constructor() {
    this.totalLovelace = 0n;
    this.assetMap = {};
    this.utxos = [];
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

    return this;
  }

  hasUTxO(utxo: UTxO) {
    return this.utxos.some(
      (u) => u.txHash === utxo.txHash && u.txIndex === utxo.txIndex
    );
  }

  addUTxO(utxo: UTxO) {
    if (!this.hasUTxO(utxo)) {
      this.addValue(utxo.value);
      this.utxos.push(utxo);
    }

    return this;
  }

  addLovelace(quantity: bigint) {
    this.totalLovelace += quantity;

    return this;
  }

  addValue(value: Value) {
    if (value.coin) {
      this.addLovelace(BigInt(value.coin));
    }

    if (value.assets) {
      assetMapToList(value.assets).forEach((asset) => {
        this.addAsset(asset.unit, asset.quantity);
      });
    }

    return this;
  }

  getAssetQuantity(asset: string) {
    const assetDetails = getAssetDetails(asset);
    return (
      this.assetMap?.[assetDetails.assetPolicy]?.[assetDetails.assetName] || 0n
    );
  }

  getTotalLovelace() {
    return this.totalLovelace;
  }

  getUnlockedLovelace() {
    return this.totalLovelace - getMinAssetMapCost(this.assetMap);
  }

  isEmpty() {
    return (
      this.totalLovelace <= 0n &&
      (Object.keys(this.assetMap).length === 0 ||
        this.areAllAssetsEmptyOrNegative())
    );
  }

  areAllAssetsEmptyOrNegative() {
    return assetMapToList(this.assetMap).every((a) => a.quantity <= 0n);
  }

  hasAnyNegativeAssetOrLovelace() {
    return (
      this.totalLovelace < 0 ||
      assetMapToList(this.assetMap).some((a) => a.quantity <= 0)
    );
  }

  getNegativeValues(): Value {
    return {
      coin: this.totalLovelace < 0 ? this.totalLovelace : 0,
      assets: assetListToMap(
        assetMapToList(this.assetMap).filter((a) => a.quantity <= 0n)
      ),
    };
  }

  getUTxOs(): UTxO[] {
    return this.utxos;
  }

  /**
   * Take an array of asset values and load them into the map
   * @param values
   */
  loadValues(values: (AssetValue | BlockfrostAssetValue)[]) {
    for (const value of values) {
      this.addAsset(value.unit, BigInt(value.quantity));
    }

    return this;
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

    return this;
  }

  /**
   * Revers all asset quantities
   */
  revert() {
    this.totalLovelace = this.totalLovelace * -1n;

    for (const policyId of Object.keys(this.assetMap)) {
      for (const assetName of Object.keys(this.assetMap[policyId])) {
        this.assetMap[policyId][assetName] =
          BigInt(Number(this.assetMap[policyId][assetName])) * -1n;
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
