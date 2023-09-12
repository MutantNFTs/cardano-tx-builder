import { assetListToMap } from "../assetListToMap";
import { AssetValue } from "../types";

describe("assetListToMap", () => {
  test("should return the correct asset map", () => {
    const assets: AssetValue[] = [
      {
        unit: "lovelace",
        quantity: 2000000n,
      },
      {
        quantity: 2500n,
        unit: "0c442180dd6163682d8e03b271caefb4944a24412bdd07adafb04ccb50494e41434f4c414441",
      },
      {
        quantity: 2500n,
        unit: "0c442180dd6163682d8e03b271caefb4944a24412bdd07adafb04ccb50494e41434f4c414441",
      },
      {
        quantity: 50000000n,
        unit: "16fdd33c86af604e837ae57d79d5f0f1156406086db5f16afb3fcf5144474f4c44",
      },
      {
        quantity: 49963577n,
        unit: "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5430313439",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5430343131",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5430353332",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5430353939",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5430363235",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5430383832",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5431303131",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5431323138",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5431323937",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5431333833",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5431363035",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5431383239",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5431383533",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5432313730",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5432333230",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5432343533",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5432383432",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5433313634",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5433323233",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5433333238",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5434333138",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5434333731",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5434343434",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5434363838",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5434393634",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5435313939",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5435353733",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5435363038",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5436323336",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5436343238",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5436353035",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5437313334",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5437343339",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5437363830",
      },
      {
        quantity: 1n,
        unit: "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411000de1404d5554414e5437383930",
      },
      {
        quantity: 1n,
        unit: "5b2fa063c299c443dbbad0a186574abbdcbbc323318cccb8f207e2245370616365746f6b656e73466f756e646572734e465431303435",
      },
      {
        quantity: 20n,
        unit: "6194158d24d71eca5cc5601c45de123bf78d02c297e851be2608810a44454144",
      },
      {
        quantity: 1n,
        unit: "74b71d095053bb189ebcae39caaf00d53a178f1d1436a98f41eebb1b53746f6e6564417065556e697665727369747930373936",
      },
      {
        quantity: 1000000000n,
        unit: "af2e27f580f7f08e93190a81f72462f153026d06450924726645891b44524950",
      },
      {
        quantity: 100000000n,
        unit: "b3ad8b975d24235a43cb2a54d58c717ed9dd11560b4deba2273ffb1d0014df104b574943",
      },
      {
        quantity: 2n,
        unit: "b6408f665a71750e622a3f6430f35a1a6d6cde0d0b6c41bc027c035650726f6a656374426f6f6b776f726d",
      },
      {
        quantity: 5000000n,
        unit: "b6a7467ea1deb012808ef4e87b5ff371e85f7142d7b356a40d9b42a0436f726e75636f70696173205b76696120436861696e506f72742e696f5d",
      },
      {
        quantity: 1000000000n,
        unit: "b7c783f6304eddbdf8f0dece4715d63cb9f453be89d97c8fba155d5752455349",
      },
      {
        quantity: 1000000n,
        unit: "cfee97ff8359f07a0a395a72b424bc6e030503390d864b86d4e0ecf84b41495a454e",
      },
      {
        quantity: 500n,
        unit: "d01794c4604f3c0e544c537bb1f4268c0e81f45880c00c09ebe4b4a74d595354",
      },
      {
        quantity: 221931000000n,
        unit: "dbc31b04d90b37332813cb4cee3e8f79994643d899a5366797e745ee465544",
      },
      {
        quantity: 171113n,
        unit: "ffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d8e4d5554414e54",
      },
    ];

    expect(assetListToMap(assets)).toEqual({
      "": {
        "": 2000000n,
      },
      "0c442180dd6163682d8e03b271caefb4944a24412bdd07adafb04ccb": {
        "50494e41434f4c414441": 5000n,
      },
      "16fdd33c86af604e837ae57d79d5f0f1156406086db5f16afb3fcf51": {
        "44474f4c44": 50000000n,
      },
      "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6": {
        "4d494e": 49963577n,
      },
      "2d37295347d9fbd197ecfd0e4ddef32ef757083c23985049326a5411": {
        "000de1404d5554414e5430313439": 1n,
        "000de1404d5554414e5430343131": 1n,
        "000de1404d5554414e5430353332": 1n,
        "000de1404d5554414e5430353939": 1n,
        "000de1404d5554414e5430363235": 1n,
        "000de1404d5554414e5430383832": 1n,
        "000de1404d5554414e5431303131": 1n,
        "000de1404d5554414e5431323138": 1n,
        "000de1404d5554414e5431323937": 1n,
        "000de1404d5554414e5431333833": 1n,
        "000de1404d5554414e5431363035": 1n,
        "000de1404d5554414e5431383239": 1n,
        "000de1404d5554414e5431383533": 1n,
        "000de1404d5554414e5432313730": 1n,
        "000de1404d5554414e5432333230": 1n,
        "000de1404d5554414e5432343533": 1n,
        "000de1404d5554414e5432383432": 1n,
        "000de1404d5554414e5433313634": 1n,
        "000de1404d5554414e5433323233": 1n,
        "000de1404d5554414e5433333238": 1n,
        "000de1404d5554414e5434333138": 1n,
        "000de1404d5554414e5434333731": 1n,
        "000de1404d5554414e5434343434": 1n,
        "000de1404d5554414e5434363838": 1n,
        "000de1404d5554414e5434393634": 1n,
        "000de1404d5554414e5435313939": 1n,
        "000de1404d5554414e5435353733": 1n,
        "000de1404d5554414e5435363038": 1n,
        "000de1404d5554414e5436323336": 1n,
        "000de1404d5554414e5436343238": 1n,
        "000de1404d5554414e5436353035": 1n,
        "000de1404d5554414e5437313334": 1n,
        "000de1404d5554414e5437343339": 1n,
        "000de1404d5554414e5437363830": 1n,
        "000de1404d5554414e5437383930": 1n,
      },
      "5b2fa063c299c443dbbad0a186574abbdcbbc323318cccb8f207e224": {
        "5370616365746f6b656e73466f756e646572734e465431303435": 1n,
      },
      "6194158d24d71eca5cc5601c45de123bf78d02c297e851be2608810a": {
        "44454144": 20n,
      },
      "74b71d095053bb189ebcae39caaf00d53a178f1d1436a98f41eebb1b": {
        "53746f6e6564417065556e697665727369747930373936": 1n,
      },
      af2e27f580f7f08e93190a81f72462f153026d06450924726645891b: {
        "44524950": 1000000000n,
      },
      b3ad8b975d24235a43cb2a54d58c717ed9dd11560b4deba2273ffb1d: {
        "0014df104b574943": 100000000n,
      },
      b6408f665a71750e622a3f6430f35a1a6d6cde0d0b6c41bc027c0356: {
        "50726f6a656374426f6f6b776f726d": 2n,
      },
      b6a7467ea1deb012808ef4e87b5ff371e85f7142d7b356a40d9b42a0: {
        "436f726e75636f70696173205b76696120436861696e506f72742e696f5d":
          5000000n,
      },
      b7c783f6304eddbdf8f0dece4715d63cb9f453be89d97c8fba155d57: {
        "52455349": 1000000000n,
      },
      cfee97ff8359f07a0a395a72b424bc6e030503390d864b86d4e0ecf8: {
        "4b41495a454e": 1000000n,
      },
      d01794c4604f3c0e544c537bb1f4268c0e81f45880c00c09ebe4b4a7: {
        "4d595354": 500n,
      },
      dbc31b04d90b37332813cb4cee3e8f79994643d899a5366797e745ee: {
        "465544": 221931000000n,
      },
      ffb1abe9fe93ee9f13874403a3d4f8addaa65fbf22d5d7f41c087d8e: {
        "4d5554414e54": 171113n,
      },
    });
  });
});
