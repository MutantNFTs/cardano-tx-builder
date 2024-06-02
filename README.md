# Cardano Tx Builder (By Mutants)
![example workflow](https://github.com/MutantNFTs/cardano-tx-builder/actions/workflows/ci.yml/badge.svg)

Cardano Tx Builder is a library that helps building your Cardano transaction without the need for WebAssembly or any rust libraries, like [cardano-serialization-lib](https://github.com/Emurgo/cardano-serialization-lib).
The goal is to provide an alternative for those that prefer the use of Typescript libraries and have more knowledge with this programming language.

This library also has no dependency from Blockfrost API, but you must provide the protocol parameters in order to build a transaction.

The code is open source and also makes use of a small open-source library also created by Mutants team: [@mutants/cardano-utils](https://github.com/MutantNFTs/cardano-utils)

## Warning
The code here is already being used in our production apps but is far from being as robust as [cardano-serialization-lib](https://github.com/Emurgo/cardano-serialization-lib).
There are several options in the cardano transaction spec that are not implemented yet (contributions are welcome!).

## How to use (Step by step)

The core of this library is the [TransactionBuilder](https://github.com/MutantNFTs/cardano-tx-builder/blob/main/src/transactionBuilder.ts) class, which we can use to describe our transaction using Typescript.

### Step 1: Creating the builder
```ts
import { TransactionBuilder } from "@mutants/cardano-tx-builder";

// Here you must implement your own way to fetch the protocol parameters of the current epoch.
// These parameters are dynamic so it's easier to have an API that provides them.
// If you are new to Cardano development, we suggest using Blockfrost to fetch those values:
// https://docs.blockfrost.io/#tag/Cardano-Epochs/paths/~1epochs~1latest~1parameters/get
const currentProtocolParameters = await fetchProtocolParameters();

const transactionBuilder = new TransactionBuilder(currentProtocolParameters);
```

### Step 2: Setting up our inputs and outputs
Once you have your transaction builder created the most common operation would be to setup the transaction inputs.
This information you would usually get from the Wallet API, which is where you can get the available UTxOs from the connected user.

Since this is not the kind of problem this library aims to solve, let's say we already have the two UTxOs and they have 2 ADA each:

```ts
import { toLovelace } from "@mutants/cardano-utils";

transactionBuilder.setInputs([{
  txHash: '037546cba8a7f352c5d9802b2aeb17395776a6c5b60253a75d3a1a90fbc6e3b7',
  txIndex: 0,
  address: 'addr1qxn93q92eatt544gu9fytkkddlr3m87hm2ly280692w45zcrdquesr9ddx2uarwu8dasltwd7986dzkw95tgv3hvqxxqmemh6s';
  value: {
    coin: toLovelace(2)
  }
}, {
  txHash: 'fc9020aa87eb00e25d819c930968ff3e0d227f853fc3cd5f121de268c94938e8',
  txIndex: 3,
  address: 'addr1qxn93q92eatt544gu9fytkkddlr3m87hm2ly280692w45zcrdquesr9ddx2uarwu8dasltwd7986dzkw95tgv3hvqxxqmemh6s';
  value: {
    coin: toLovelace(2)
  }
}])
```

Now let's say our connected user wants to send 1 ADA to another wallet with payment address `addr1qx25trx4q5rmrkwx853suyk2dvpv93fytuv67qpc6kgzaqyw90fc7d6ehwz992ffmccptm4crsfvfs5qfd5z4hfpt55s5sfljx`

In that case we have to set an output specific for this wallet:

```ts
transactionBuilder.setOutputs([{
  address: paymentAddress,
  value: {
    coin: toLovelace(1)
  }
}])
```

### Step 3: The change
After we have our operation set, we must also tell our TransactionBuilder what to do with the 3 ADA that will be left from those 2 inputs.

In that case we have the `setChangeAddress` method, which tells where all the remaining assets that weren't specific in the setOutputs must go after this transaction:

```ts
transactionBuilder.setChangeAddress('addr1qxn93q92eatt544gu9fytkkddlr3m87hm2ly280692w45zcrdquesr9ddx2uarwu8dasltwd7986dzkw95tgv3hvqxxqmemh6s');
```

Most of the times the change address will be the connected user address, to make sure all the remaining assets from their input will go back to them.

### Step 4: The transaction fee
Once we have everything set up we can tell the transaction builder to calculate the fee.
This is the step where the protocol parameters will be used, so make sure to provide them correctly or the fee calculated will be incorrect.

```ts
transactionBuilder.calculateFee();
```

### Step 5: Getting the signature
In order to spend inputs, we must have authorization from the input owner. Again, to do that, we usually rely on a connected Cardano wallet API.

To ask for a signature we must provide a valid transaction, so let's serialize our builder's transaction!

```ts
const unsignedTx = transactionBuilder.serialize();
```

Now that we have our transaction serialized, we can ask for user's signature. We will simulate the use of a connected Cardano wallet api:

```ts
const signature = await walletApi.signTx(unsignedTx);
```

### Step 6: Adding the witness
In order to submit the transaction we have to provide witnesses and that's why we need the signature from the inputs' owner.
The wallet api will return the signature encoded in [CBOR](https://cbor.io/) so it's ready to be used by our TransactionBuilder.

```ts
transactionBuilder.setEncodedVKeyWitnesses(signature);
```

### Step 7: Submit
We have inputs, outputs, permission to spend the inputs and the fee is calculated, now the only thing that is left is.. submit!
To do that we must first serialize our tx and then we can submit the result through the connected wallet api:

```ts
const signedTx = transactionBuilder.serialize();

try {
  const txHash = await walletApi.submitTx(signedTx);

  if (tx) {
    // celebrate
  } else {
    throw new Error('Unexpected error'); // Wallet API gave us an unexpected result
  }
} catch (e) {
  // Something went wrong :(
  // Transaction submission can throw errors in case you provided invalid inputs, for example.
  // You can check the wallet error for more details.
}
```

### Advanced usage
This library also supports more complex operations, like using validators.
You can setup PlutusV2 scripts and collateral inputs, for example:

```ts
transactionBuilder.setCollateralInputs(collateralInputs); // Same format of regular inputs, change is also calculated automatically

// Inline PlutusV2 script
transactionBuilder.setPlutusV2Scripts(['REPLACE_FULL_CBOR_SCRIPT']);

// OR you can use PlutusV2 script with reference inputs
// Make sure to send hasScript as true for the reference input to be setup properly
transactionBuilder.setReferenceInputs([
  {
    txHash: 'REPLACE_TX_HASH',
    txIndex: 0,
    hasScript: true,
  }
]);

// Setting up redeemers
builder.setRedeemers([
  [
    RedeemerTag.Spend,
    {
      txHash: 'REPLACE_VALIDATOR_INPUT_TX_HASH',
      txIndex: REPLACE_VALIDATOR_INPUT_TX_INDEX,
    },
    { constructor: 0, fields: [] },
    [0, 0], // Evaluation can be calculated after
  ],
]);

// After evaluating the transaction you can set the exact cpu/mem values
builder.setRedeemerEvaluations([{
  tag: RedeemerTag.Spend,
  index: 0, // replace with proper input index considering your transaction
  memory: 18237,
  steps: 328742
}]);
```
