import { encode, Tagged } from "cbor";

import { toPaymentAddress } from "@mutants/cardano-utils";

import { MOCK_ADDRESSES, MOCK_TX_HASHES } from "../__mocks__/mocks";
import { BabbageTransactionBody, BabbageWitnessSet } from "../constants";
import { TransactionBuilder } from "../transactionBuilder";
import {
  EncodedAssetMap,
  EncodedInput,
  Lovelace,
  PostAlonzoEncodedOutput,
  RedeemerTag,
} from "../types";

describe("TransactionBuilder", () => {
  let builder: TransactionBuilder;
  let buildResult: ReturnType<typeof builder.build>;

  beforeEach(() => {
    builder = new TransactionBuilder();

    builder.setTtl(333);
  });

  test("should create a transaction builder", () => {
    expect(new TransactionBuilder()).toBeInstanceOf(TransactionBuilder);
  });

  describe("Case 1. Send 50 ADA transaction", () => {
    describe("when I add 2 inputs from address A with 30 Ada each and 1 random NFT on each", () => {
      beforeEach(() => {
        builder.setInputs([
          {
            address: MOCK_ADDRESSES.A,
            txHash: MOCK_TX_HASHES.A,
            txIndex: 0,
            value: {
              coin: 30_000_000,
              assets: {
                "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411": {
                  "000de1404d5554414e5432353537": 1n,
                },
              },
            },
          },
          {
            address: MOCK_ADDRESSES.A,
            txHash: MOCK_TX_HASHES.B,
            txIndex: 0,
            value: {
              coin: 30_000_000,
              assets: {
                "73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4a": {
                  "505245443133383433": 1n,
                },
              },
            },
          },
        ]);
      });

      describe("and I set the output as 50 ADA to address B", () => {
        beforeEach(() => {
          builder.setOutputs([
            {
              address: MOCK_ADDRESSES.B,
              value: {
                coin: 50_000_000,
              },
            },
          ]);

          builder.setChangeAddress(MOCK_ADDRESSES.A);
        });

        describe("when I build the transaction", () => {
          beforeEach(() => {
            builder.calculateFee();

            buildResult = builder.build();
          });

          describe("Inputs", () => {
            let inputs: EncodedInput[];

            beforeEach(() => {
              inputs = buildResult[0].get(0) as EncodedInput[];
            });

            test("should have two inputs", () => {
              expect(inputs).toHaveLength(2);
            });

            test("should have the input with transaction hash B in the first input", () => {
              expect(inputs[0][0].toString("hex")).toEqual(MOCK_TX_HASHES.B);
            });

            test("should have the input with transaction hash A in the second input", () => {
              expect(inputs[1][0].toString("hex")).toEqual(MOCK_TX_HASHES.A);
            });
          });

          describe("Outputs", () => {
            let outputs: PostAlonzoEncodedOutput[];

            beforeEach(() => {
              outputs = buildResult[0].get(1) as PostAlonzoEncodedOutput[];
            });

            test("should have two outputs", () => {
              expect(outputs).toHaveLength(2);
            });

            describe("and the first output", () => {
              let output: PostAlonzoEncodedOutput;

              beforeEach(() => {
                output = outputs[0];
              });

              test("should be for address B", () => {
                const addressBuffer = output.get(0);
                const address =
                  addressBuffer instanceof Buffer
                    ? addressBuffer.toString("hex")
                    : "";

                expect(toPaymentAddress(address)).toEqual(MOCK_ADDRESSES.B);
              });

              test("should have exactly 50 ADA", () => {
                const coin = output.get(1) as Lovelace;

                expect(coin).toBe(50_000_000);
              });
            });

            describe("and the second output", () => {
              let output: PostAlonzoEncodedOutput;

              beforeEach(() => {
                output = outputs[1];
              });

              test("should be for address A", () => {
                const addressBuffer = output.get(0);
                const address =
                  addressBuffer instanceof Buffer
                    ? addressBuffer.toString("hex")
                    : "";

                expect(toPaymentAddress(address)).toEqual(MOCK_ADDRESSES.A);
              });

              test("should have around 10 Ada (less fees)", () => {
                const [coin] = output.get(1) as [Lovelace, EncodedAssetMap];

                expect(coin).toBe(9_816_811);
              });

              test("should have the two NFTs as change", () => {
                const [, assets] = output.get(1) as [Lovelace, EncodedAssetMap];

                expect(encode(assets).toString("hex")).toEqual(
                  "a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301"
                );
              });
            });

            describe("when I remove the change address", () => {
              beforeEach(() => {
                builder.setChangeAddress(null);
                buildResult = builder.build();
              });

              test("should have two outputs", () => {
                expect(outputs).toHaveLength(2);
              });

              describe("and the first output", () => {
                let output: PostAlonzoEncodedOutput;

                beforeEach(() => {
                  output = outputs[0];
                });

                test("should be for address B", () => {
                  const addressBuffer = output.get(0);
                  const address =
                    addressBuffer instanceof Buffer
                      ? addressBuffer.toString("hex")
                      : "";

                  expect(toPaymentAddress(address)).toEqual(MOCK_ADDRESSES.B);
                });

                test("should have exactly 50 ADA", () => {
                  const coin = output.get(1) as Lovelace;

                  expect(coin).toBe(50_000_000);
                });
              });

              describe("and the second output", () => {
                let output: PostAlonzoEncodedOutput;

                beforeEach(() => {
                  output = outputs[1];
                });

                test("should be for address A", () => {
                  const addressBuffer = output.get(0);
                  const address =
                    addressBuffer instanceof Buffer
                      ? addressBuffer.toString("hex")
                      : "";

                  expect(toPaymentAddress(address)).toEqual(MOCK_ADDRESSES.A);
                });

                test("should have around 10 Ada (less fees)", () => {
                  const [coin] = output.get(1) as [Lovelace, EncodedAssetMap];

                  expect(coin).toBe(9_816_811);
                });

                test("should have the two NFTs as change", () => {
                  const [, assets] = output.get(1) as [
                    Lovelace,
                    EncodedAssetMap
                  ];

                  expect(encode(assets).toString("hex")).toEqual(
                    "a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301"
                  );
                });
              });
            });
          });

          test("should have the correct output serialized", () => {
            expect(builder.serialize()).toEqual(
              "84a400828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a0095caeba2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301021a0002cb950319014da0f5f6"
            );
          });
        });

        describe("when I setup a plutus v2 validator to redeem the first input", () => {
          beforeEach(() => {
            builder.setPlutusV2Scripts([
              "58BE010000332323232323232323232232222533300A32001323233001375866010601466010601400690002402000C6002002444A66602000429404C8C94CCC03CCDC78010018A5113330050050010033013003375C60220042930B1BAE00133001001480008888CCCC01CCDC38008018059199980280299B8000448008C0340040080088C014DD5000918019BAA0015734AAE7555CF2AB9F5742AE8930011E581C675061014F3EACE588951DE4B7FAB2DC0A7B4BA16C2944DACE6ED5050001",
            ]);

            builder.setPlutusDatas([
              {
                constructor: 0,
                fields: [
                  {
                    int: 42,
                  },
                ],
              },
            ]);

            builder.setRedeemers([
              [
                RedeemerTag.Spend,
                {
                  txHash: MOCK_TX_HASHES.A,
                  txIndex: 0,
                },
                { constructor: 0, fields: [] },
                [0, 0],
              ],
            ]);

            builder.setRequiredSigners([
              "675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed505",
            ]);

            builder.setCollateralInputs([
              {
                address: MOCK_ADDRESSES.A,
                txHash: MOCK_TX_HASHES.A,
                txIndex: 0,
                value: {
                  coin: 30_000_000,
                  assets: {
                    "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411":
                      {
                        "000de1404d5554414e5432353537": 1n,
                        "000de1404d5554414e5432353536": 1n,
                      },
                    "0d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5414":
                      {
                        "000de1404d5554414e5432353533": 1n,
                        "000de1404d5554414e5432353532": 1n,
                      },
                  },
                },
              },
            ]);
          });

          describe("when I build the transaction", () => {
            beforeEach(() => {
              buildResult = builder.build();
            });

            test("should have the plutus script in the witness set", () => {
              const script = buildResult[1].get(
                BabbageWitnessSet.PlutusV2Script
              ) as Buffer[];

              expect((script[0] as Buffer).toString("hex")).toBe(
                "58be010000332323232323232323232232222533300a32001323233001375866010601466010601400690002402000c6002002444a66602000429404c8c94ccc03ccdc78010018a5113330050050010033013003375c60220042930b1bae00133001001480008888cccc01ccdc38008018059199980280299b8000448008c0340040080088c014dd5000918019baa0015734aae7555cf2ab9f5742ae8930011e581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed5050001"
              );
            });

            test("should have the correct plutus data in the witness set", () => {
              const data = buildResult[1].get(
                BabbageWitnessSet.PlutusData
              ) as Buffer[];

              expect(data[0]).toEqual(new Tagged(121, [42]));
            });

            test("should have the correct redeemer", () => {
              const data = buildResult[1].get(
                BabbageWitnessSet.Redeemer
              ) as Buffer[];

              expect(data[0]).toEqual([0, 1, new Tagged(121, []), [0, 0]]);
            });

            test("should have the correct default total collateral", () => {
              const data = buildResult[0].get(
                BabbageTransactionBody.TotalCollateral
              );

              expect(data).toBe(1000000);
            });

            describe("when I calculate fee", () => {
              beforeEach(() => {
                builder.calculateFee();
                buildResult = builder.build();
              });

              test("should have the correct fee", () => {
                const data = buildResult[0].get(BabbageTransactionBody.Fee);

                expect(data).toBe(229037);
              });

              test("should have the correct total collateral", () => {
                const data = buildResult[0].get(
                  BabbageTransactionBody.TotalCollateral
                );

                expect(data).toBe(343556);
              });

              test("should serialize correctly", () => {
                expect(builder.serialize()).toBe(
                  "84a900828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a009517d3a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301021a00037ead0319014d0b58200f5bac380ea654f04584b7958e67461102ede7aa11b37aa2c67e9663f1e8e0e10d81825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000e81581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed50510a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a01c4857ca2581c0d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5414a24e000de1404d5554414e5432353532014e000de1404d5554414e543235353301581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a24e000de1404d5554414e5432353536014e000de1404d5554414e543235353701111a00053e04a30481d87981182a0581840001d87980820000068158c058be010000332323232323232323232232222533300a32001323233001375866010601466010601400690002402000c6002002444a66602000429404c8c94ccc03ccdc78010018a5113330050050010033013003375c60220042930b1bae00133001001480008888cccc01ccdc38008018059199980280299b8000448008c0340040080088c014dd5000918019baa0015734aae7555cf2ab9f5742ae8930011e581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed5050001f5f6"
                );
              });

              describe("when I change the collateral percent from protocol parameters to 200 instead of 150", () => {
                beforeEach(() => {
                  builder.setProtocolParameters({
                    collateral_percent: 200,
                    min_fee_a: 44,
                    min_fee_b: 155381,
                    price_mem: 0.0577,
                    price_step: 0.0000721,
                    coins_per_utxo_word: "4310",
                  });
                  builder.calculateFee();
                  buildResult = builder.build();
                });

                test("should have the correct total collateral", () => {
                  const data = buildResult[0].get(
                    BabbageTransactionBody.TotalCollateral
                  );

                  expect(data).toBe(458074);
                });
              });

              describe("when I change the collateral percent from protocol parameters to null", () => {
                beforeEach(() => {
                  builder.setProtocolParameters({
                    collateral_percent: null,
                    min_fee_a: 44,
                    min_fee_b: 155381,
                    price_mem: 0.0577,
                    price_step: 0.0000721,
                    coins_per_utxo_word: "4310",
                  });
                  builder.calculateFee();
                  buildResult = builder.build();
                });

                test("should have the correct total collateral", () => {
                  const data = buildResult[0].get(
                    BabbageTransactionBody.TotalCollateral
                  );

                  expect(data).toBe(343556);
                });
              });
            });

            describe("when I set an encoded vkeyWitnesses map", () => {
              beforeEach(() => {
                builder.setEncodedVKeyWitnesses(
                  "a100818258209b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d7666096245840e7c843699b7ecaf079be19b74564fbcc7a5d97f8bdf8aaacdb91fb70753683fadeac24390f5f5a0414eef380d2b6ffea89ce8bc8abd54c4bb7ae0278220f230d"
                );
              });

              describe("when I build the transaction", () => {
                beforeEach(() => {
                  buildResult = builder.build();
                });

                test("should have the correct vkey witnesses", () => {
                  const data = buildResult[1].get(
                    BabbageWitnessSet.VKeyWitness
                  ) as [Buffer, Buffer][];

                  expect(data[0][0].toString("hex")).toBe(
                    "9b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d766609624"
                  );
                  expect(data[0][1].toString("hex")).toBe(
                    "e7c843699b7ecaf079be19b74564fbcc7a5d97f8bdf8aaacdb91fb70753683fadeac24390f5f5a0414eef380d2b6ffea89ce8bc8abd54c4bb7ae0278220f230d"
                  );
                });
              });
            });

            describe("when I set an encoded invalid vkeyWitnesses map", () => {
              beforeEach(() => {
                builder.setEncodedVKeyWitnesses("a10001");
              });

              describe("when I build the transaction", () => {
                beforeEach(() => {
                  buildResult = builder.build();
                });

                test("should have the correct vkey witnesses", () => {
                  const data = buildResult[1].get(
                    BabbageWitnessSet.VKeyWitness
                  ) as [Buffer, Buffer][];

                  expect(data).toEqual(undefined);
                });
              });
            });

            describe("when I set an encoded vkeyWitnesses array", () => {
              beforeEach(() => {
                builder.setEncodedVKeyWitnesses(
                  "818258209b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d7666096245840e7c843699b7ecaf079be19b74564fbcc7a5d97f8bdf8aaacdb91fb70753683fadeac24390f5f5a0414eef380d2b6ffea89ce8bc8abd54c4bb7ae0278220f230d"
                );
              });

              describe("when I build the transaction", () => {
                beforeEach(() => {
                  buildResult = builder.build();
                });

                test("should have the correct vkey witnesses", () => {
                  const data = buildResult[1].get(
                    BabbageWitnessSet.VKeyWitness
                  ) as [Buffer, Buffer][];

                  expect(data[0][0].toString("hex")).toBe(
                    "9b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d766609624"
                  );
                  expect(data[0][1].toString("hex")).toBe(
                    "e7c843699b7ecaf079be19b74564fbcc7a5d97f8bdf8aaacdb91fb70753683fadeac24390f5f5a0414eef380d2b6ffea89ce8bc8abd54c4bb7ae0278220f230d"
                  );
                });
              });
            });

            describe("when I build with multiple redeemers", () => {
              beforeEach(() => {
                builder.setProtocolParameters({
                  collateral_percent: 200,
                  min_fee_a: 44,
                  min_fee_b: 155381,
                  price_mem: null,
                  price_step: null,
                  coins_per_utxo_word: "4310",
                });

                builder.setRedeemers([
                  [
                    RedeemerTag.Spend,
                    {
                      txHash: MOCK_TX_HASHES.A,
                      txIndex: 0,
                    },
                    { constructor: 0, fields: [] },
                    [42879, 15615619],
                  ],
                  [
                    RedeemerTag.Spend,
                    {
                      txHash: MOCK_TX_HASHES.B,
                      txIndex: 0,
                    },
                    { constructor: 0, fields: [] },
                    [100000, 25615619],
                  ],
                ]);

                builder.calculateFee();
                buildResult = builder.build();
              });

              test("should have the correct fee", () => {
                const data = buildResult[0].get(BabbageTransactionBody.Fee);

                expect(data).toBe(2610115);
              });
            });
          });

          describe("and I evaluate the redeemer by TxIn with cost units 42879, 15615619", () => {
            beforeEach(() => {
              builder.evaluateRedeemerByTxIn(
                {
                  txHash: MOCK_TX_HASHES.A,
                  txIndex: 0,
                },
                [42879, 15615619]
              );
            });

            describe("when I build the transaction", () => {
              beforeEach(() => {
                buildResult = builder.build();
              });

              test("should have the correct redeemer", () => {
                const data = buildResult[1].get(
                  BabbageWitnessSet.Redeemer
                ) as Buffer[];

                expect(data[0]).toEqual([
                  0,
                  1,
                  new Tagged(121, []),
                  [42879, 15615619],
                ]);
              });
            });
          });

          describe("and I evaluate the redeemer by tag index with cost units 42879, 15615619", () => {
            beforeEach(() => {
              builder.evaluateRedeemerByTagIndex(0, 1, [42879, 15615619]);
            });

            describe("when I build the transaction", () => {
              beforeEach(() => {
                buildResult = builder.build();
              });

              test("should have the correct redeemer", () => {
                const data = buildResult[1].get(
                  BabbageWitnessSet.Redeemer
                ) as Buffer[];

                expect(data[0]).toEqual([
                  0,
                  1,
                  new Tagged(121, []),
                  [42879, 15615619],
                ]);
              });
            });
          });

          describe("and I set redeemer evaluations with cost units 42879, 15615619", () => {
            beforeEach(() => {
              builder.setRedeemerEvaluations([
                {
                  index: 1,
                  memory: 42879,
                  steps: 15615619,
                  tag: 0,
                },
              ]);
            });

            describe("when I build the transaction", () => {
              beforeEach(() => {
                buildResult = builder.build();
              });

              test("should have the correct redeemer", () => {
                const data = buildResult[1].get(
                  BabbageWitnessSet.Redeemer
                ) as Buffer[];

                expect(data[0]).toEqual([
                  0,
                  1,
                  new Tagged(121, []),
                  [42879, 15615619],
                ]);
              });
            });
          });
        });

        describe("when I setup a plutus v1 validator to redeem the first input", () => {
          beforeEach(() => {
            builder.setPlutusV1Scripts([
              "58BE010000332323232323232323232232222533300A32001323233001375866010601466010601400690002402000C6002002444A66602000429404C8C94CCC03CCDC78010018A5113330050050010033013003375C60220042930B1BAE00133001001480008888CCCC01CCDC38008018059199980280299B8000448008C0340040080088C014DD5000918019BAA0015734AAE7555CF2AB9F5742AE8930011E581C675061014F3EACE588951DE4B7FAB2DC0A7B4BA16C2944DACE6ED5050001",
            ]);

            builder.setPlutusDatas([
              {
                constructor: 0,
                fields: [
                  {
                    bytes: Buffer.from(
                      "D7C4967B97302DF103B002A8C13BD4A5E96BD6AD08CB52D8DC15C121",
                      "hex"
                    ),
                  },
                ],
              },
            ]);

            builder.setRedeemers([
              [
                RedeemerTag.Spend,
                {
                  txHash: MOCK_TX_HASHES.A,
                  txIndex: 0,
                },
                { constructor: 0, fields: [] },
                [0, 0],
              ],
            ]);

            builder.setRequiredSigners([
              "675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed505",
            ]);

            builder.setCollateralInputs([
              {
                address: MOCK_ADDRESSES.A,
                txHash: MOCK_TX_HASHES.A,
                txIndex: 0,
                value: {
                  coin: 30_000_000,
                  assets: {
                    "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411":
                      {
                        "000de1404d5554414e5432353537": 1n,
                        "000de1404d5554414e5432353536": 1n,
                      },
                    "0d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5414":
                      {
                        "000de1404d5554414e5432353533": 1n,
                        "000de1404d5554414e5432353532": 1n,
                      },
                  },
                },
              },
            ]);
          });

          describe("when I build the transaction", () => {
            beforeEach(() => {
              buildResult = builder.build();
            });

            test("should have the plutus script in the witness set", () => {
              const script = buildResult[1].get(
                BabbageWitnessSet.PlutusV1Script
              ) as Buffer[];

              expect((script[0] as Buffer).toString("hex")).toBe(
                "58be010000332323232323232323232232222533300a32001323233001375866010601466010601400690002402000c6002002444a66602000429404c8c94ccc03ccdc78010018a5113330050050010033013003375c60220042930b1bae00133001001480008888cccc01ccdc38008018059199980280299b8000448008c0340040080088c014dd5000918019baa0015734aae7555cf2ab9f5742ae8930011e581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed5050001"
              );
            });

            test("should have the correct plutus data in the witness set", () => {
              const data = buildResult[1].get(
                BabbageWitnessSet.PlutusData
              ) as Buffer[];

              expect(data[0]).toEqual(
                new Tagged(121, [
                  Buffer.from(
                    "D7C4967B97302DF103B002A8C13BD4A5E96BD6AD08CB52D8DC15C121",
                    "hex"
                  ),
                ])
              );
            });

            test("should have the correct redeemer", () => {
              const data = buildResult[1].get(
                BabbageWitnessSet.Redeemer
              ) as Buffer[];

              expect(data[0]).toEqual([0, 1, new Tagged(121, []), [0, 0]]);
            });

            test("should have the correct default total collateral", () => {
              const data = buildResult[0].get(
                BabbageTransactionBody.TotalCollateral
              );

              expect(data).toBe(1000000);
            });

            describe("when I calculate fee", () => {
              beforeEach(() => {
                builder.calculateFee();
                buildResult = builder.build();
              });

              test("should have the correct fee", () => {
                const data = buildResult[0].get(BabbageTransactionBody.Fee);

                expect(data).toBe(231501);
              });

              test("should have the correct total collateral", () => {
                const data = buildResult[0].get(
                  BabbageTransactionBody.TotalCollateral
                );

                expect(data).toBe(347252);
              });

              test("should serialize correctly", () => {
                expect(builder.serialize()).toBe(
                  "84a900828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a00950e33a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301021a0003884d0319014d0b58208cdd4c577aa12ff08f7caac8439081601e9156e1b936cb1da35aaacf477e09b60d81825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000e81581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed50510a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a01c4770ca2581c0d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5414a24e000de1404d5554414e5432353532014e000de1404d5554414e543235353301581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a24e000de1404d5554414e5432353536014e000de1404d5554414e543235353701111a00054c74a30481d87981581cd7c4967b97302df103b002a8c13bd4a5e96bd6ad08cb52d8dc15c1210581840001d87980820000038158c058be010000332323232323232323232232222533300a32001323233001375866010601466010601400690002402000c6002002444a66602000429404c8c94ccc03ccdc78010018a5113330050050010033013003375c60220042930b1bae00133001001480008888cccc01ccdc38008018059199980280299b8000448008c0340040080088c014dd5000918019baa0015734aae7555cf2ab9f5742ae8930011e581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed5050001f5f6"
                );
              });

              describe("when I change the collateral percent from protocol parameters to 200 instead of 150", () => {
                beforeEach(() => {
                  builder.setProtocolParameters({
                    collateral_percent: 200,
                    min_fee_a: 44,
                    min_fee_b: 155381,
                    price_mem: 0.0577,
                    price_step: 0.0000721,
                    coins_per_utxo_word: "4310",
                  });
                  builder.calculateFee();
                  buildResult = builder.build();
                });

                test("should have the correct total collateral", () => {
                  const data = buildResult[0].get(
                    BabbageTransactionBody.TotalCollateral
                  );

                  expect(data).toBe(463002);
                });
              });

              describe("when I change the collateral percent from protocol parameters to null", () => {
                beforeEach(() => {
                  builder.setProtocolParameters({
                    collateral_percent: null,
                    min_fee_a: 44,
                    min_fee_b: 155381,
                    price_mem: 0.0577,
                    price_step: 0.0000721,
                    coins_per_utxo_word: "4310",
                  });
                  builder.calculateFee();
                  buildResult = builder.build();
                });

                test("should have the correct total collateral", () => {
                  const data = buildResult[0].get(
                    BabbageTransactionBody.TotalCollateral
                  );

                  expect(data).toBe(347252);
                });
              });
            });

            describe("when I set an encoded vkeyWitnesses map", () => {
              beforeEach(() => {
                builder.setEncodedVKeyWitnesses(
                  "a100818258209b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d7666096245840e7c843699b7ecaf079be19b74564fbcc7a5d97f8bdf8aaacdb91fb70753683fadeac24390f5f5a0414eef380d2b6ffea89ce8bc8abd54c4bb7ae0278220f230d"
                );
              });

              describe("when I build the transaction", () => {
                beforeEach(() => {
                  buildResult = builder.build();
                });

                test("should have the correct vkey witnesses", () => {
                  const data = buildResult[1].get(
                    BabbageWitnessSet.VKeyWitness
                  ) as [Buffer, Buffer][];

                  expect(data[0][0].toString("hex")).toBe(
                    "9b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d766609624"
                  );
                  expect(data[0][1].toString("hex")).toBe(
                    "e7c843699b7ecaf079be19b74564fbcc7a5d97f8bdf8aaacdb91fb70753683fadeac24390f5f5a0414eef380d2b6ffea89ce8bc8abd54c4bb7ae0278220f230d"
                  );
                });
              });
            });

            describe("when I set an encoded invalid vkeyWitnesses map", () => {
              beforeEach(() => {
                builder.setEncodedVKeyWitnesses("a10001");
              });

              describe("when I build the transaction", () => {
                beforeEach(() => {
                  buildResult = builder.build();
                });

                test("should have the correct vkey witnesses", () => {
                  const data = buildResult[1].get(
                    BabbageWitnessSet.VKeyWitness
                  ) as [Buffer, Buffer][];

                  expect(data).toEqual(undefined);
                });
              });
            });

            describe("when I set an encoded vkeyWitnesses array", () => {
              beforeEach(() => {
                builder.setEncodedVKeyWitnesses(
                  "818258209b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d7666096245840e7c843699b7ecaf079be19b74564fbcc7a5d97f8bdf8aaacdb91fb70753683fadeac24390f5f5a0414eef380d2b6ffea89ce8bc8abd54c4bb7ae0278220f230d"
                );
              });

              describe("when I build the transaction", () => {
                beforeEach(() => {
                  buildResult = builder.build();
                });

                test("should have the correct vkey witnesses", () => {
                  const data = buildResult[1].get(
                    BabbageWitnessSet.VKeyWitness
                  ) as [Buffer, Buffer][];

                  expect(data[0][0].toString("hex")).toBe(
                    "9b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d766609624"
                  );
                  expect(data[0][1].toString("hex")).toBe(
                    "e7c843699b7ecaf079be19b74564fbcc7a5d97f8bdf8aaacdb91fb70753683fadeac24390f5f5a0414eef380d2b6ffea89ce8bc8abd54c4bb7ae0278220f230d"
                  );
                });
              });
            });

            describe("when I build with multiple redeemers", () => {
              beforeEach(() => {
                builder.setProtocolParameters({
                  collateral_percent: 200,
                  min_fee_a: 44,
                  min_fee_b: 155381,
                  price_mem: null,
                  price_step: null,
                  coins_per_utxo_word: "4310",
                });

                builder.setRedeemers([
                  [
                    RedeemerTag.Spend,
                    {
                      txHash: MOCK_TX_HASHES.A,
                      txIndex: 0,
                    },
                    { constructor: 0, fields: [] },
                    [42879, 15615619],
                  ],
                  [
                    RedeemerTag.Spend,
                    {
                      txHash: MOCK_TX_HASHES.B,
                      txIndex: 0,
                    },
                    { constructor: 0, fields: [] },
                    [100000, 25615619],
                  ],
                ]);

                builder.calculateFee();
                buildResult = builder.build();
              });

              test("should have the correct fee", () => {
                const data = buildResult[0].get(BabbageTransactionBody.Fee);

                expect(data).toBe(2612579);
              });
            });
          });

          describe("and I evaluate the redeemer by TxIn with cost units 42879, 15615619", () => {
            beforeEach(() => {
              builder.evaluateRedeemerByTxIn(
                {
                  txHash: MOCK_TX_HASHES.A,
                  txIndex: 0,
                },
                [42879, 15615619]
              );
            });

            describe("when I build the transaction", () => {
              beforeEach(() => {
                buildResult = builder.build();
              });

              test("should have the correct redeemer", () => {
                const data = buildResult[1].get(
                  BabbageWitnessSet.Redeemer
                ) as Buffer[];

                expect(data[0]).toEqual([
                  0,
                  1,
                  new Tagged(121, []),
                  [42879, 15615619],
                ]);
              });
            });
          });

          describe("and I evaluate the redeemer by tag index with cost units 42879, 15615619", () => {
            beforeEach(() => {
              builder.evaluateRedeemerByTagIndex(0, 1, [42879, 15615619]);
            });

            describe("when I build the transaction", () => {
              beforeEach(() => {
                buildResult = builder.build();
              });

              test("should have the correct redeemer", () => {
                const data = buildResult[1].get(
                  BabbageWitnessSet.Redeemer
                ) as Buffer[];

                expect(data[0]).toEqual([
                  0,
                  1,
                  new Tagged(121, []),
                  [42879, 15615619],
                ]);
              });
            });
          });

          describe("and I set redeemer evaluations with cost units 42879, 15615619", () => {
            beforeEach(() => {
              builder.setRedeemerEvaluations([
                {
                  index: 1,
                  memory: 42879,
                  steps: 15615619,
                  tag: 0,
                },
              ]);
            });

            describe("when I build the transaction", () => {
              beforeEach(() => {
                buildResult = builder.build();
              });

              test("should have the correct redeemer", () => {
                const data = buildResult[1].get(
                  BabbageWitnessSet.Redeemer
                ) as Buffer[];

                expect(data[0]).toEqual([
                  0,
                  1,
                  new Tagged(121, []),
                  [42879, 15615619],
                ]);
              });
            });
          });
        });

        describe("when I setup a plutus v2 validator without plutus data", () => {
          beforeEach(() => {
            builder.setPlutusV2Scripts([
              "58BE010000332323232323232323232232222533300A32001323233001375866010601466010601400690002402000C6002002444A66602000429404C8C94CCC03CCDC78010018A5113330050050010033013003375C60220042930B1BAE00133001001480008888CCCC01CCDC38008018059199980280299B8000448008C0340040080088C014DD5000918019BAA0015734AAE7555CF2AB9F5742AE8930011E581C675061014F3EACE588951DE4B7FAB2DC0A7B4BA16C2944DACE6ED5050001",
            ]);

            builder.setRedeemers([
              [
                RedeemerTag.Spend,
                {
                  txHash: MOCK_TX_HASHES.A,
                  txIndex: 0,
                },
                { constructor: 0, fields: [] },
                [0, 0],
              ],
            ]);

            builder.setRequiredSigners([
              "675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed505",
            ]);

            builder.setCollateralInputs([
              {
                address: MOCK_ADDRESSES.A,
                txHash: MOCK_TX_HASHES.A,
                txIndex: 0,
                value: {
                  coin: 30_000_000,
                  assets: {
                    "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411":
                      {
                        "000de1404d5554414e5432353537": 1n,
                      },
                  },
                },
              },
            ]);
          });

          test("should have the correct output serialized", () => {
            expect(builder.serialize()).toEqual(
              "84a900828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a00989680a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa1495052454431333834330102000319014d0b5820dfa43ddd1c44ce5237b8a4598d64368d235ef5ff3117fd9e0095e76ea33466fd0d81825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000e81581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed50510a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a01ba8140a1581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701111a000f4240a304800581840001d87980820000068158c058be010000332323232323232323232232222533300a32001323233001375866010601466010601400690002402000c6002002444a66602000429404c8c94ccc03ccdc78010018a5113330050050010033013003375c60220042930b1bae00133001001480008888cccc01ccdc38008018059199980280299b8000448008c0340040080088c014dd5000918019baa0015734aae7555cf2ab9f5742ae8930011e581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed5050001f5f6"
            );
          });
        });

        describe("when I setup a plutus v1 validator without plutus data", () => {
          beforeEach(() => {
            builder.setPlutusV1Scripts([
              "58BE010000332323232323232323232232222533300A32001323233001375866010601466010601400690002402000C6002002444A66602000429404C8C94CCC03CCDC78010018A5113330050050010033013003375C60220042930B1BAE00133001001480008888CCCC01CCDC38008018059199980280299B8000448008C0340040080088C014DD5000918019BAA0015734AAE7555CF2AB9F5742AE8930011E581C675061014F3EACE588951DE4B7FAB2DC0A7B4BA16C2944DACE6ED5050001",
            ]);

            builder.setRedeemers([
              [
                RedeemerTag.Spend,
                {
                  txHash: MOCK_TX_HASHES.A,
                  txIndex: 0,
                },
                { constructor: 0, fields: [] },
                [0, 0],
              ],
            ]);

            builder.setRequiredSigners([
              "675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed505",
            ]);

            builder.setCollateralInputs([
              {
                address: MOCK_ADDRESSES.A,
                txHash: MOCK_TX_HASHES.A,
                txIndex: 0,
                value: {
                  coin: 30_000_000,
                  assets: {
                    "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411":
                      {
                        "000de1404d5554414e5432353537": 1n,
                      },
                  },
                },
              },
            ]);
          });

          test("should have the correct output serialized", () => {
            expect(builder.serialize()).toEqual(
              "84a900828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a00989680a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa1495052454431333834330102000319014d0b58208c846f73cdef87fc5238f3311cc3b1f2e87eddfdffb0c222586c4a6341a5f5a50d81825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000e81581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed50510a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a01ba8140a1581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701111a000f4240a304800581840001d87980820000038158c058be010000332323232323232323232232222533300a32001323233001375866010601466010601400690002402000c6002002444a66602000429404c8c94ccc03ccdc78010018a5113330050050010033013003375c60220042930b1bae00133001001480008888cccc01ccdc38008018059199980280299b8000448008c0340040080088c014dd5000918019baa0015734aae7555cf2ab9f5742ae8930011e581c675061014f3eace588951de4b7fab2dc0a7b4ba16c2944dace6ed5050001f5f6"
            );
          });
        });

        describe("when I setup a plutus v2 validator through reference inputs", () => {
          beforeEach(() => {
            builder.setReferenceInputs([
              {
                txHash:
                  "84874669c2826dd22fbb5068d6131325ddd31b80ae2fb7d0c3a556d86077f6d4",
                txIndex: 0,
                hasScript: true,
              },
            ]);
          });

          test("should have the correct output serialized", () => {
            expect(builder.serialize()).toEqual(
              "84a600828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a00989680a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa1495052454431333834330102000319014d0b5820dfa43ddd1c44ce5237b8a4598d64368d235ef5ff3117fd9e0095e76ea33466fd128182582084874669c2826dd22fbb5068d6131325ddd31b80ae2fb7d0c3a556d86077f6d400a0f5f6"
            );
          });
        });

        describe("when I add a metadata message label", () => {
          beforeEach(() => {
            builder.setMetadataMsg(["Verify ledger", "token123"]);
            builder.calculateFee();

            buildResult = builder.build();
          });

          test("should have the correct output serialized", () => {
            expect(builder.serialize()).toEqual(
              "84a500828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a0095b3e3a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301021a0002e29d0319014d0758207a8d6ef29cba708854aa839c0de11abc56b3ca3d8173a81b8d3fd2c82ab38748a0f5a11902a2a1636d7367826d566572696679206c656467657268746f6b656e313233"
            );
          });

          describe("when I also add a metadata value", () => {
            beforeEach(() => {
              builder.setMetadataPublicLabel(
                1337,
                new Map().set("data", "test")
              );
              builder.calculateFee();

              buildResult = builder.build();
            });

            test("should have the correct output serialized", () => {
              expect(builder.serialize()).toEqual(
                "84a500828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a0095af13a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301021a0002e76d0319014d075820294e6a48fe09550c41e487a39f76278401962617f85fbd1211f373bccd5edf83a0f5a21902a2a1636d7367826d566572696679206c656467657268746f6b656e313233190539a164646174616474657374"
              );
            });
          });

          describe("when I also add a reference input", () => {
            beforeEach(() => {
              builder.setReferenceInputs([
                {
                  txHash:
                    "84874669c2826dd22fbb5068d6131325ddd31b80ae2fb7d0c3a556d86077f6d4",
                  txIndex: 0,
                  hasScript: true,
                },
              ]);
            });

            test("should have the correct output serialized", () => {
              expect(builder.serialize()).toEqual(
                "84a700828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a0095b3e3a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301021a0002e29d0319014d0758207a8d6ef29cba708854aa839c0de11abc56b3ca3d8173a81b8d3fd2c82ab387480b5820dfa43ddd1c44ce5237b8a4598d64368d235ef5ff3117fd9e0095e76ea33466fd128182582084874669c2826dd22fbb5068d6131325ddd31b80ae2fb7d0c3a556d86077f6d400a0f5a11902a2a1636d7367826d566572696679206c656467657268746f6b656e313233"
              );
            });
          });
        });

        describe("when I add a metadata value", () => {
          beforeEach(() => {
            builder.setMetadataPublicLabel(1337, new Map().set("data", "test"));
            builder.calculateFee();

            buildResult = builder.build();
          });

          test("should have the correct output serialized", () => {
            expect(builder.serialize()).toEqual(
              "84a500828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a0095ba13a2581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e543235353701581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301021a0002dc6d0319014d0758201dee6319c1f99314de54a0289f58a7007fee53e873f08eb1cdcbbae7c3a50c9aa0f5a1190539a164646174616474657374"
            );
          });
        });
      });
    });
  });
});
