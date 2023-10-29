import { encode } from "cbor";

import { prepareBoundedBytes } from "../prepareBoundedBytes";

describe("prepareBoundedBytes", () => {
  test("should prepare bounded bytes to be encoded properly", () => {
    const boundedBytes = prepareBoundedBytes(
      "addr1q8zem3e2kz7eqnwf5sct6zmdn5anctfjm73aead0l5cfqqh6q2ahx0pt07tggfstcj6nlwr9tj6txxlas7dpyl8ksjeqn8nrly"
    );

    expect(encode(boundedBytes).toString("hex")).toBe(
      "5f5840616464723171387a656d3365326b7a3765716e776635736374367a6d646e35616e6374666a6d373361656164306c35636671716836713261687830707430377458276767667374636a366e6c777239746a367478786c6173376470796c386b736a65716e386e726c79ff"
    );
  });

  test("should prepare bounded bytes to be encoded properly for small strings", () => {
    const boundedBytes = prepareBoundedBytes(
      "addr1q8zem3e2kz7eqnwf5sct6zmdn5an"
    );

    expect(encode(boundedBytes).toString("hex")).toBe(
      "5821616464723171387a656d3365326b7a3765716e776635736374367a6d646e35616e"
    );
  });

  test("should throw an error for invalid strings", () => {
    expect(() => prepareBoundedBytes("")).toThrow(
      "Invalid bounded bytes string -"
    );
  });
});
