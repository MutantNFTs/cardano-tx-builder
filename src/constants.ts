export enum BabbageTransactionBody {
  Inputs = 0,
  Outputs = 1,
  Fee = 2,
  TTL = 3,
  Certificate = 4,
  Withdrawals = 5,
  Update = 6,
  AuxiliaryDataHash = 7,
  ValidityIntervalStart = 8,
  Mint = 9,
  ScriptDataHash = 11,
  CollateralInputs = 13,
  RequiredSigners = 14,
  NetworkId = 15,
  CollateralReturn = 16,
  TotalCollateral = 17,
  ReferenceInputs = 18,
}

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
export enum BabbageWitnessSet {
  VKeyWitness = 0,
  NativeScript = 1,
  BootstrapWitness = 2,
  PlutusV1Script = 3,
  PlutusData = 4,
  Redeemer = 5,
  PlutusV2Script = 6,
}
