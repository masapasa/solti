import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { notify } from "./notifications";
import { WalletAdapterProps } from "@solana/wallet-adapter-base";

export async function sendSol(
  connection: Connection,
  sendTransaction: WalletAdapterProps["sendTransaction"],
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number
) {
  let signature: TransactionSignature = "";
  try {
    // Create instructions to send, in this case a simple transfer
    const instructions = [
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      }),
    ];

    // Get the lates block hash to use on our transaction and confirmation
    let latestBlockhash = await connection.getLatestBlockhash();

    // Create a new TransactionMessage with version and compile it to legacy
    const messageLegacy = new TransactionMessage({
      payerKey: fromPubkey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions,
    }).compileToLegacyMessage();

    // Create a new VersionedTransacction which supports legacy and v0
    const transation = new VersionedTransaction(messageLegacy);

    // Send transaction and await for signature
    signature = await sendTransaction(transation, connection);

    // Send transaction and await for signature
    await connection.confirmTransaction(
      { signature, ...latestBlockhash },
      "confirmed"
    );

    console.log(signature);
    notify({
      type: "success",
      message: "Transaction successful!",
      txid: signature,
    });
  } catch (error: any) {
    // notify({
    //   type: "error",
    //   message: `Transaction failed!`,
    //   description: error?.message,
    //   txid: signature,
    // });
    console.log("error", `Transaction failed! ${error?.message}`, signature);
    return;
  }
}
