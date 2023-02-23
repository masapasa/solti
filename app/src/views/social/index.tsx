import { FC, useEffect, useMemo, useState } from "react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { notify } from "../../utils/notifications";
import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
import dataAccountSecretKey from "../../dataAccountSecretKey.json";

const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
console.log("programId:", programId);

// const generatedDataAccount = Keypair.generate();
const dataAccount = Keypair.fromSecretKey(new Uint8Array(dataAccountSecretKey));
console.log("dataAccount:", dataAccount);

export const SocialView: FC = ({}) => {
  const [dataAccountInitialized, setDataAccountInitialized] = useState(!false);
  const [program, setProgram] = useState<Program | null>(null);
  const [idl, setIdl] = useState<Idl | null>(null);

  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useMemo(
    () => new AnchorProvider(connection, wallet, {}),
    [connection, wallet]
  );
  const { publicKey: user, sendTransaction } = wallet;

  useEffect(() => {
    // fetchIdl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    // if (program) fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  useEffect(() => {
    if (!(idl && programId && provider)) {
      console.log(
        "useEffect: One or more vars are still missing. Next time..."
      );
      return;
    }

    // const program = new Program(idl, programId, provider);
    // console.log("useEffect: Successfully initialized the program!", program);
    // setProgram(program);
  }, [idl, provider]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Social
        </h1>
      </div>
    </div>
  );
};
