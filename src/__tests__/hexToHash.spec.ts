import { hexToHash } from "../hexToHash";
import { TransactionBuilder } from "../transactionBuilder";

describe("hexToHash", () => {
  test("should encode a tx cbor", () => {
    expect(
      hexToHash(
        // fulltx: "84a6008182582010dc6bf2afc37fc24ebc40653cd6dc8cb7cb7d463695199bf066b2bf9a3126a600018282583901c59dc72ab0bd904dc9a430bd0b6d9d3b3c2d32dfa3dcf5affd309002fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b21a000f424082583901c59dc72ab0bd904dc9a430bd0b6d9d3b3c2d32dfa3dcf5affd309002fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b21a003c04aa021a0002a9b9031a0735c4e905a1581de1fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b21a0001a5630800a10082825820f4aade804831e3b6da820d48b4b9eca27065a7182ea93d873764adf6b3732b555840b1b54b9a51c1fa8fa3d0b10f41309b9e43c0b6789e2b449a61daa3ad24108bb1ff6bd021188ca211741d3982d76eb9b579bb6b085595b3aa8f76e74a9134a60b8258209b3667e7d92d74c1efcb7eb4e0e2157dc2d6334b87167833eede33d7666096245840aca38a5e23eeb9c5166175d6955922ef8590fe55a2560dc90df68ecd70d1db87dfb3408f09c5afccc76aa3b0d441f53ecf151298cbcb684202522e1d93b38608f5f6"
        "a6008182582010dc6bf2afc37fc24ebc40653cd6dc8cb7cb7d463695199bf066b2bf9a3126a600018282583901c59dc72ab0bd904dc9a430bd0b6d9d3b3c2d32dfa3dcf5affd309002fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b21a000f424082583901c59dc72ab0bd904dc9a430bd0b6d9d3b3c2d32dfa3dcf5affd309002fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b21a003c04aa021a0002a9b9031a0735c4e905a1581de1fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b21a0001a5630800"
      )
    ).toBe("23ad92e4eae5d8941c52c71c3606781854c59e732bdedeea8161677f3c488f5a");
  });

  test("should encode a tx cbor with transaction builder", () => {
    const txBuilder = new TransactionBuilder();

    txBuilder.setInputs([
      {
        address:
          "addr1q8zem3e2kz7eqnwf5sct6zmdn5anctfjm73aead0l5cfqqh6q2ahx0pt07tggfstcj6nlwr9tj6txxlas7dpyl8ksjeqn8nrly",
        txHash:
          "10dc6bf2afc37fc24ebc40653cd6dc8cb7cb7d463695199bf066b2bf9a3126a6",
        txIndex: 0,
        value: {
          coin: 5000000,
        },
      },
    ]);

    txBuilder.setOutputs([
      {
        address:
          "addr1q8zem3e2kz7eqnwf5sct6zmdn5anctfjm73aead0l5cfqqh6q2ahx0pt07tggfstcj6nlwr9tj6txxlas7dpyl8ksjeqn8nrly",
        value: {
          coin: 1000000,
        },
      },
      {
        address:
          "addr1q8zem3e2kz7eqnwf5sct6zmdn5anctfjm73aead0l5cfqqh6q2ahx0pt07tggfstcj6nlwr9tj6txxlas7dpyl8ksjeqn8nrly",
        value: {
          coin: 4000000,
        },
      },
    ]);

    txBuilder.calculateFee();
    const bodyCbor = txBuilder.serializeBody();

    expect(bodyCbor).toEqual(
      "a3008182582010dc6bf2afc37fc24ebc40653cd6dc8cb7cb7d463695199bf066b2bf9a3126a6000183a200583901c59dc72ab0bd904dc9a430bd0b6d9d3b3c2d32dfa3dcf5affd309002fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b2011a000f4240a200583901c59dc72ab0bd904dc9a430bd0b6d9d3b3c2d32dfa3dcf5affd309002fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b2011a003d0900a200583901c59dc72ab0bd904dc9a430bd0b6d9d3b3c2d32dfa3dcf5affd309002fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b2011a0002b595021a0002b595"
    );

    expect(hexToHash(bodyCbor)).toBe(
      "0b5847d17046509a8f133edd54f9e5c488888bc19b9ba17b8728a249d9442a31"
    );
  });
});
