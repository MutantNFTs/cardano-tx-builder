import { getSignedDataPayload } from "../getSignedDataPayload";

describe("getSignedDataPayload", () => {
  test("should correctly return the payload", () => {
    expect(
      getSignedDataPayload(
        "845846a201276761646472657373583901c59dc72ab0bd904dc9a430bd0b6d9d3b3c2d32dfa3dcf5affd309002fa02bb733c2b7f9684260bc4b53fb8655cb4b31bfd879a127cf684b2a166686173686564f44e7369676e6564207061796c6f616458407af1afb4d95652d18f3fc2daf1ebeb1f44bebe9f80a78d269bdf01d53ecf5bc14639444b36c5e3aaff920dcfb0af6aa69b25e4814a31ec69efd19d2baed47904"
      )
    ).toBe("signed payload");
  });
});
