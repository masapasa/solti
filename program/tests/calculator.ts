import * as anchor from "@coral-xyz/anchor";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import assert from "assert";

import { Calculator } from "../target/types/calculator";

describe("calculator", () => {
  // Run some tests on our calculator program
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Calculator as Program<Calculator>;

  // Set up some common accounts we'll be using later
  const owner = provider.wallet.publicKey;
  const calculator = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("Calculator"), owner.toBuffer()],
    program.programId
  )[0];

  // Try initializing the calculator
  it("Inits a calculator", async () => {
    await program.methods
      .initCalculator()
      .accounts({ owner, calculator })
      .rpc();
  });

  // Do some operations on the calculator
  it("Does some operations", async () => {
    const add2 = await program.methods
      .doOperation({ add: true }, new BN(2))
      .accounts({ owner, calculator })
      .instruction();

    const mul3 = await program.methods
      .doOperation({ mul: true }, new BN(3))
      .accounts({ owner, calculator })
      .instruction();

    const sub1 = await program.methods
      .doOperation({ sub: true }, new BN(1))
      .accounts({ owner, calculator })
      .instruction();

    const tx = new web3.Transaction();
    tx.add(add2, mul3, sub1);
    await provider.sendAndConfirm(tx);

    // Get the calculator's on-chain data
    const calculatorAccount = await program.account.calculator.fetch(
      calculator
    );

    assert.ok(calculatorAccount.display.toNumber() === 5);
  });

  // Make sure our calculator is secure
  it("Prevents fraudulent transactions", async () => {
    const hackerman = new web3.Keypair();

    const shouldFail = await program.methods
      .resetCalculator()
      .accounts({
        owner: hackerman.publicKey,
        calculator,
      })
      .instruction();

    const tx = new web3.Transaction();
    tx.add(shouldFail);
    await provider
      .sendAndConfirm(tx, [hackerman])
      .then(() => assert.ok(false)) // Error on success, we want a failure
      .catch(console.log);
  });

  // it("Is initialized!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });
});
