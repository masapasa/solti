export const SocialView = () => null;

// import { FC, useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Keypair,
//   LAMPORTS_PER_SOL,
//   PublicKey,
//   SystemProgram,
// } from "@solana/web3.js";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { notify } from "../../utils/notifications";
// import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
// import dataAccountSecretKey from "../../dataAccountSecretKey.json";
// import { ProtocolOptions, SocialProtocol, User } from "@spling/social-protocol";

// /*

// tmcyrix | Spling Labs — Today at 4:09 PM
// Hey! Right, you cant test the sdk while you are moving on devnet. If you dont specify a payer wallet which means that the end users have to pay for the transaction costs then they need just little SOL and SHDW in there wallet to pay for the transaction costs.

// Edit: The content will be stored on the user's storage account, which is not possible on devnet thats the reason why you cant test the sdk on devnet first.

// */

// const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
// console.log("programId:", programId);

// // const generatedDataAccount = Keypair.generate();
// const dataAccount = Keypair.fromSecretKey(new Uint8Array(dataAccountSecretKey));
// console.log("dataAccount:", dataAccount);

// const options = {
//   rpcUrl: "https://api.mainnet-beta.solana.com/",
//   useIndexer: true,
// } as ProtocolOptions;

// export const SocialView: FC = ({}) => {
//   const [dataAccountInitialized, setDataAccountInitialized] = useState(!false);
//   const [program, setProgram] = useState<Program | null>(null);
//   const [idl, setIdl] = useState<Idl | null>(null);

//   const { connection } = useConnection();
//   const wallet = useWallet();
//   const provider = useMemo(
//     () => new AnchorProvider(connection, wallet, {}),
//     [connection, wallet]
//   );
//   const { publicKey: user, sendTransaction } = wallet;
//   const [socialProtocol, setSocialProtocol] = useState<SocialProtocol>();

//   async function signUp() {
//     const user: User = await socialProtocol.createUser(
//       "Grizzly",
//       null,
//       "A user account created for testing purposes.",
//       { interests: ["Solana"] }
//     );
//   }

//   useEffect(() => {
//     // fetchIdl();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   useEffect(() => {
//     // if (program) fetchSubmissions();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [program]);

//   useEffect(() => {
//     if (!(idl && programId && provider)) {
//       console.log(
//         "useEffect: One or more vars are still missing. Next time..."
//       );
//       return;
//     }

//     // const program = new Program(idl, programId, provider);
//     // console.log("useEffect: Successfully initialized the program!", program);
//     // setProgram(program);
//   }, [idl, provider]);

//   useEffect(() => {
//     async function initSocialProtocol() {
//       try {
//         const socialProtocol: SocialProtocol = await new SocialProtocol(
//           wallet,
//           null,
//           options
//         ).init();
//         console.log("initSocialProtocol: socialProtocol is", socialProtocol);
//         setSocialProtocol(socialProtocol);
//         // await socialProtocol.prepareWallet()
//       } catch {}
//     }

//     console.log("wallet:", wallet);
//     initSocialProtocol();
//   }, [wallet]);

//   return (
//     <div className="md:hero mx-auto p-4">
//       <div className="md:hero-content flex flex-col">
//         <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
//           Social
//         </h1>
//         <button
//           className={`bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-1 rounded-sm self-stretch`}
//           onClick={signUp}
//         >
//           Sign up
//         </button>
//       </div>
//     </div>
//   );
// };
