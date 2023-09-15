import { sortInputs } from "../sortInputs";
import { TxIn } from "../types";

describe("sortInputs", () => {
  let utxos: TxIn[];
  let sortedUtxos: TxIn[];

  describe("case 1", () => {
    beforeEach(() => {
      const utxo0: TxIn = {
        txHash:
          "FCC4C4D79ADD692CB65BC553CACDDAB595BE075A3C29B632BB1AEE45EF2ECEEE",
        txIndex: 1,
      };

      const utxo1: TxIn = {
        txHash:
          "D820D299A39BCDA6A57AD9E361E5003BE624B12DC1A6DC83CF3A342C56CEA64B",
        txIndex: 1,
      };

      const utxo2: TxIn = {
        txHash:
          "9E37F422F1421F2CBDFB69C7931CD0B0192C1C6A651DF84E51760B09B2BE0F89",
        txIndex: 1,
      };

      const utxo3: TxIn = {
        txHash:
          "CDB92DAF2855BDD0CAF24CCBA48E319A7B3033BCB2CE3115DE05BEFE7AA2E6D4",
        txIndex: 1,
      };

      const utxo4: TxIn = {
        txHash:
          "C76209BBCE6B4DC40F4A41A43DDC38259EA5EE816D815BD616E49BAAFFCE9F1B",
        txIndex: 1,
      };

      utxos = [utxo0, utxo1, utxo2, utxo3, utxo4];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "9E37F422F1421F2CBDFB69C7931CD0B0192C1C6A651DF84E51760B09B2BE0F89"
      );
      expect(sortedUtxos[1].txHash).toBe(
        "C76209BBCE6B4DC40F4A41A43DDC38259EA5EE816D815BD616E49BAAFFCE9F1B"
      );
      expect(sortedUtxos[2].txHash).toBe(
        "CDB92DAF2855BDD0CAF24CCBA48E319A7B3033BCB2CE3115DE05BEFE7AA2E6D4"
      );
      expect(sortedUtxos[3].txHash).toBe(
        "D820D299A39BCDA6A57AD9E361E5003BE624B12DC1A6DC83CF3A342C56CEA64B"
      );
      expect(sortedUtxos[4].txHash).toBe(
        "FCC4C4D79ADD692CB65BC553CACDDAB595BE075A3C29B632BB1AEE45EF2ECEEE"
      );
    });
  });

  describe("case 2", () => {
    beforeEach(() => {
      const utxo1 = {
        txHash:
          "050d2022f3b088e4c4f6eab931b850172c5421a37ee290bce341034076266e97",
        txIndex: 1,
      };

      const utxo2 = {
        txHash:
          "84feb8909ba2789e33854815a31356ae2381a7976b5466b389d206fb03605b5d",
        txIndex: 0,
      };

      utxos = [utxo1, utxo2];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "050d2022f3b088e4c4f6eab931b850172c5421a37ee290bce341034076266e97"
      );
      expect(sortedUtxos[1].txHash).toBe(
        "84feb8909ba2789e33854815a31356ae2381a7976b5466b389d206fb03605b5d"
      );
    });
  });

  describe("case 3", () => {
    beforeEach(() => {
      const utxo1 = {
        txHash:
          "39771990a5c9547e4630672ba3e3835a4ebd20743bc0e0198a8a1ed1d798a8cd",
        txIndex: 1,
      };

      const utxo2 = {
        txHash:
          "dcf2bd36be155d1ab2caf9d1499b5cba7440da2f3c09741f7a2ce02338216296",
        txIndex: 2,
      };

      utxos = [utxo1, utxo2];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "39771990a5c9547e4630672ba3e3835a4ebd20743bc0e0198a8a1ed1d798a8cd"
      );
      expect(sortedUtxos[1].txHash).toBe(
        "dcf2bd36be155d1ab2caf9d1499b5cba7440da2f3c09741f7a2ce02338216296"
      );
    });
  });

  describe("case 4", () => {
    beforeEach(() => {
      const utxo1 = {
        txHash:
          "1337a7a8921f4b74eeb8f044b464a24bb308293175bba5d5c51ad785004cdabf",
        txIndex: 1,
      };

      const utxo2 = {
        txHash:
          "953661f31b6488d7c9b09ae580251d4b7db586d21d6e578195d9e2d7db93bcee",
        txIndex: 0,
      };

      utxos = [utxo1, utxo2];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "1337a7a8921f4b74eeb8f044b464a24bb308293175bba5d5c51ad785004cdabf"
      );
      expect(sortedUtxos[1].txHash).toBe(
        "953661f31b6488d7c9b09ae580251d4b7db586d21d6e578195d9e2d7db93bcee"
      );
    });
  });

  describe("case 5", () => {
    beforeEach(() => {
      const utxo1 = {
        txHash:
          "da32b343f5708fbdbc1ce0f08d66314f7e300057a98a9c6d84bb3e9248c7554a",
        txIndex: 1,
      };

      const utxo2 = {
        txHash:
          "96e3fb943d5c4c8104d98d355f6efbf6e6856f56af13c252a5a80f8b2cb6577e",
        txIndex: 0,
      };

      utxos = [utxo1, utxo2];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "96e3fb943d5c4c8104d98d355f6efbf6e6856f56af13c252a5a80f8b2cb6577e"
      );
      expect(sortedUtxos[1].txHash).toBe(
        "da32b343f5708fbdbc1ce0f08d66314f7e300057a98a9c6d84bb3e9248c7554a"
      );
    });
  });

  describe("case 6", () => {
    beforeEach(() => {
      const utxo1 = {
        txHash:
          "f1b38d395f6dac93bd40a3a11f93c93a826f21e2982e17a1b4228304d9ced3e4",
        txIndex: 1,
      };

      const utxo2 = {
        txHash:
          "fc3e6a7f440798fbed49087d32e30412b30162862749957f566b4876d0fe5f3d",
        txIndex: 1,
      };

      utxos = [utxo1, utxo2];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "f1b38d395f6dac93bd40a3a11f93c93a826f21e2982e17a1b4228304d9ced3e4"
      );
      expect(sortedUtxos[1].txHash).toBe(
        "fc3e6a7f440798fbed49087d32e30412b30162862749957f566b4876d0fe5f3d"
      );
    });
  });

  describe("case 7", () => {
    beforeEach(() => {
      const utxo1 = {
        txHash:
          "db0f4d47d50439a817968b9cb17fb6638d472ff9e752d8453c52125bb8a89df2",
        txIndex: 1,
      };

      const utxo2 = {
        txHash:
          "9ccc26e6eeeddfc06d8906974596ec71a876c0f1812af33323b52a8fa6248fcc",
        txIndex: 1,
      };

      utxos = [utxo1, utxo2];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "9ccc26e6eeeddfc06d8906974596ec71a876c0f1812af33323b52a8fa6248fcc"
      );
      expect(sortedUtxos[1].txHash).toBe(
        "db0f4d47d50439a817968b9cb17fb6638d472ff9e752d8453c52125bb8a89df2"
      );
    });
  });

  describe("case 8", () => {
    beforeEach(() => {
      const utxo1 = {
        txHash:
          "353ac8fabb2963d9c5fd2160b706973d70333a87f4b9421bf7404a7eb5ac7a42",
        txIndex: 1,
      };

      const utxo2 = {
        txHash:
          "39c885ad9b66757b9e2c1b7f2c816ff67b8d56af857dc451752926c241f9c46f",
        txIndex: 0,
      };

      utxos = [utxo1, utxo2];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "353ac8fabb2963d9c5fd2160b706973d70333a87f4b9421bf7404a7eb5ac7a42"
      );
      expect(sortedUtxos[1].txHash).toBe(
        "39c885ad9b66757b9e2c1b7f2c816ff67b8d56af857dc451752926c241f9c46f"
      );
    });
  });

  describe("case 9", () => {
    beforeEach(() => {
      const utxo1 = {
        txHash:
          "353ac8fabb2963d9c5fd2160b706973d70333a87f4b9421bf7404a7eb5ac7a42",
        txIndex: 3,
      };

      const utxo2 = {
        txHash:
          "353ac8fabb2963d9c5fd2160b706973d70333a87f4b9421bf7404a7eb5ac7a42",
        txIndex: 1,
      };

      const utxo3 = {
        txHash:
          "353ac8fabb2963d9c5fd2160b706973d70333a87f4b9421bf7404a7eb5ac7a42",
        txIndex: 2,
      };

      utxos = [utxo1, utxo2, utxo3];

      sortedUtxos = sortInputs(utxos);
    });

    test("should sort correctly", () => {
      expect(sortedUtxos[0].txHash).toBe(
        "353ac8fabb2963d9c5fd2160b706973d70333a87f4b9421bf7404a7eb5ac7a42"
      );
      expect(sortedUtxos[0].txIndex).toBe(1);

      expect(sortedUtxos[1].txHash).toBe(
        "353ac8fabb2963d9c5fd2160b706973d70333a87f4b9421bf7404a7eb5ac7a42"
      );
      expect(sortedUtxos[1].txIndex).toBe(2);

      expect(sortedUtxos[2].txHash).toBe(
        "353ac8fabb2963d9c5fd2160b706973d70333a87f4b9421bf7404a7eb5ac7a42"
      );
      expect(sortedUtxos[2].txIndex).toBe(3);
    });
  });
});
