import { TransactionReader } from "../transactionReader";

describe("TransactionReader", () => {
  test("should correctly read a transaction inputs", () => {
    const reader = new TransactionReader(
      "84a600828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a00989680a2581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e54323535370102000319014d0b582075be5e37c2a7f07027713f0cf852aabedb84498d31182e96a4d2390dc2817d3f128182582084874669c2826dd22fbb5068d6131325ddd31b80ae2fb7d0c3a556d86077f6d400a0f5f6"
    );

    expect(reader.getInputs()).toEqual([
      {
        txHash:
          "1b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b508",
        txIndex: 0,
      },
      {
        txHash:
          "d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e",
        txIndex: 0,
      },
    ]);
  });

  test("should correctly read a transaction outputs", () => {
    const reader = new TransactionReader(
      "84a600828258201b6480013b12d018e70f206281add49117cfe74a710f9fb57fd0619e8555b50800825820d3d5bb30a2a7dce6c1d2202f7c0f089bd137a4d73c6f5454ccec81b8e587423e000182a200583901f52c28481365fa384138e4085e858e7653794ca6defa93010b30ad73500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf011a02faf080a200583901adde9a635f548fa97b666b25cf4f3ee4d86aedc83b62aa2c3785be28500ed9cebc7535c4c49c9a8f3414ca34dbdfeda4fca29c06cccadbdf01821a00989680a2581c73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4aa14950524544313338343301581c2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411a14e000de1404d5554414e54323535370102000319014d0b582075be5e37c2a7f07027713f0cf852aabedb84498d31182e96a4d2390dc2817d3f128182582084874669c2826dd22fbb5068d6131325ddd31b80ae2fb7d0c3a556d86077f6d400a0f5f6"
    );

    expect(reader.getOutputs()).toEqual([
      {
        address:
          "addr1q86jc2zgzdjl5wzp8rjqsh593em9x72v5m004ycppvc26u6spmvua0r4xhzvf8y63u6pfj35m007mf8u52wqdnx2m00suyn53s",
        datumHash: undefined,
        datumInlined: undefined,
        value: {
          assets: undefined,
          coin: 50000000,
        },
      },
      {
        address:
          "addr1qxkaaxnrta2gl2tmve4jtn608mjds6hdeqak923vx7zmu2zspmvua0r4xhzvf8y63u6pfj35m007mf8u52wqdnx2m00sxl7kzz",
        datumHash: undefined,
        datumInlined: undefined,
        value: {
          assets: {
            "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411": {
              "000de1404d5554414e5432353537": 1n,
            },
            "73056bffdf28f82da5db1f5ac7c06d030c8a551f43889f7f85746a4a": {
              "505245443133383433": 1n,
            },
          },
          coin: 10000000,
        },
      },
    ]);
  });
});
