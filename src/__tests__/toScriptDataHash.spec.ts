import PlutusV2CostModel from "../Plutusv2CostModel.json";
import { toScriptDataHash } from "../toScriptDataHash";
import { Redeemer } from "../types";

describe("toScriptDataHash", () => {
  it("should return the correct hash", () => {
    const redeemers: Redeemer[] = [
      [0, 1, { constructor: 0, fields: [] }, [42879, 15615619]],
    ];

    const encodedPlutusDatas =
      "81d87983a54a61747472696275746573a84a4261636b67726f756e6445426569676545436c6f7468524d54545320507572706c6520486f6f64696543456172444e6f6e65444579657346436c6f73656444486561644d4f72616e6765204265616e6965454d6f75746845536d69726b444e6f736546436f6d6d6f6e44536b696e46507572706c654566696c657383a3496d656469615479706549696d6167652f706e67446e616d654c4d7574616e74202337383930437372635835697066733a2f2f516d6644324c79426b674a61636556427564653354473433626a3941456b7a3547797254573868324d73754e7257a3496d656469615479706549696d6167652f706e67446e616d654f4d7574616e7443726f633033353033437372635835697066733a2f2f516d52734878696d73656264424a46354d6739744770655a46515850364a6d7747596557394d6746433666327335a3496d656469615479706549696d6167652f706e67446e616d65504d7574616e744d6f7573653034353433437372635835697066733a2f2f516d6544797747634a694835597562546237363850544d617a727a595a70464559336f643465657675535277535045696d6167655835697066733a2f2f516d6644324c79426b674a61636556427564653354473433626a3941456b7a3547797254573868324d73754e7257496d656469615479706549696d6167652f706e67446e616d654c4d7574616e7420233738393001d87981a0";

    expect(
      toScriptDataHash(
        redeemers,
        encodedPlutusDatas,
        PlutusV2CostModel.costModel
      )
    ).toBe("7e00ef9a1a00e610b435e9f173131c1a6d911d568195caec64bb72a468fe1233");
  });

  it("should return the correct hash", () => {
    const redeemers: Redeemer[] = [
      [0, 2, { constructor: 0, fields: [] }, [0, 0]],
    ];

    const data = [{ constructor: 0, fields: [] }];

    expect(toScriptDataHash(redeemers, data, PlutusV2CostModel.costModel)).toBe(
      "ca0580637ccfd7d2844d80c59af29c0ccf2e78df36993f3888a540482de2bfbe"
    );
  });
});
