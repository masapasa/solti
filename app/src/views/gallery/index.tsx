import { FC, useEffect, useMemo, useState } from "react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { notify } from "../../utils/notifications";
import { sendSol } from "utils/sendSol";
import { AnchorProvider, BN, Idl, Program, Wallet } from "@coral-xyz/anchor";

// https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp

type Submission = {
  imageUrl: "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp";
  userAddress: PublicKey;
  votes: BN;
};

const baseButtonStyle = "bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-1";
const extendedButtonStyle = `${baseButtonStyle} px-2 rounded-md`;

const tipStep = 1000 / LAMPORTS_PER_SOL;

const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
let dataAccount = Keypair.generate();
console.log("dataAccount", dataAccount);

export const GalleryView: FC = ({}) => {
  const [imageSubmissions, setImageSubmissions] = useState<Submission[]>([
    // {
    //   url: "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
    //   author: new PublicKey("CQwU1maEsAUgnm4cvKr1mvztKkuER8q4eKPf3iyitXcG"),
    // },
  ]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [votes, setVotes] = useState<{ [key: number]: number }>({});
  const [imageBeingTipped, setImageBeingTipped] = useState<number | null>(null);
  const [tipAmount, setTipAmount] = useState(tipStep);
  const [initialized, setInitialized] = useState(false);
  const [program, setProgram] = useState<Program | null>(null);
  const [idl, setIdl] = useState<Idl | null>(null);

  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(
    () => new AnchorProvider(connection, wallet, {}),
    [connection, wallet]
  );

  const { publicKey: user, sendTransaction } = wallet;

  function getVotes(index: number) {
    return votes[index] ?? 0;
  }

  function vote(index: number, num: number) {
    votes[index] = getVotes(index) + num;
    setVotes({ ...votes });
  }

  function upvote(index: number) {
    vote(index, 1);
  }

  function downvote(index: number) {
    vote(index, -1);
  }

  function showTipUi(index: number) {
    setImageBeingTipped(index);
  }

  async function finalizeTip() {
    if (!user) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    const recipient = imageSubmissions[imageBeingTipped].userAddress;

    await sendSol(
      connection,
      sendTransaction,
      user,
      recipient,
      tipAmount * LAMPORTS_PER_SOL
    );
  }

  async function fetchIdl() {
    if (!user) {
      console.log(`fetchIdl: user is ${user}. Returning.`);
      return;
    }

    console.log("Program ID:", programId);

    const idl = await Program.fetchIdl(programId, provider);
    console.log("IDL:", idl);
    setIdl(idl);
  }

  async function initialize() {
    if (!program) {
      console.error(`initialize: program is ${program}. Returning.`);
      return;
    }

    const result = await program.methods
      .initDataAccount()
      .accounts({
        baseAccount: dataAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([dataAccount])
      .rpc(/* { preflightCommitment: "processed" } */);
    console.log("Initialization successful!", result);

    console.log("user", user);
    console.log("provider.wallet.publicKey", provider.wallet.publicKey);
    console.log(
      "provider.wallet.publicKey === user",
      provider.wallet.publicKey.toBase58() === user.toBase58()
    );

    setInitialized(true);

    await fetchLinks();
  }

  useEffect(() => {
    fetchIdl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchLinks() {
    if (!program) {
      console.log(`fetchLinks: program is ${program}. Returning.`);
    }

    const account = await program.account.baseAccount.fetch(
      dataAccount.publicKey
    );
    if (!account) {
      console.log(`fetchLinks: account is ${account}. Returning.`);
    }

    console.log("account:", account);
    setImageSubmissions(account.imageUrlList as Submission[]);
  }

  useEffect(() => {
    if (idl && programId && provider) {
      const program = new Program(idl, programId, provider);
      setProgram(program);
    } else
      console.log({ idl: !!idl, programId: !!programId, provider: !!provider });
  }, [idl, provider]);

  async function addLink(url: string) {
    const program = new Program(idl, programId, provider);
    console.log("Image URL", url);
    await program.methods
      .addImageUrl(url)
      .accounts({
        baseAccount: dataAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    await fetchLinks();
  }

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Gallery
        </h1>
        {!initialized ? (
          <button
            className={`${baseButtonStyle} rounded-sm self-stretch`}
            onClick={initialize}
          >
            Initialize
          </button>
        ) : (
          <div className="text-center">
            <section className="flex flex-col gap-9 items-center">
              <form
                className="flex flex-col gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const url = new URL(imageUrlInput).href;
                    // setImageSubmissions([
                    //   ...imageSubmissions,
                    //   {
                    //     url,
                    //     author: new PublicKey(
                    //       "CQwU1maEsAUgnm4cvKr1mvztKkuER8q4eKPf3iyitXcG"
                    //     ),
                    //   },
                    // ]);
                    await addLink(url);
                  } catch (e) {
                    console.error("Image URL submission error:", e);
                  }
                  setImageUrlInput("");
                }}
              >
                <input
                  placeholder="Image URL"
                  className="p-1 rounded-sm text-black"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <input
                  type="submit"
                  className={`${baseButtonStyle} rounded-sm`}
                />
              </form>
              <section className="flex flex-col gap-3">
                {imageSubmissions.map((submission, i) => (
                  <article
                    key={i}
                    className="flex flex-col gap-1 items-center bg-gray-800 p-3 rounded-sm"
                  >
                    <p className="text-lg flex gap-2 items-center">
                      <button
                        onClick={() => downvote(i)}
                        className={`${extendedButtonStyle} text-xs`}
                      >
                        -
                      </button>{" "}
                      {getVotes(i)}{" "}
                      <button
                        onClick={() => upvote(i)}
                        className={`${extendedButtonStyle} text-xs`}
                      >
                        +
                      </button>
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={submission.imageUrl}
                      alt=""
                      className="w-40 rounded-md mb-1"
                    />
                    {imageBeingTipped === i ? (
                      <div className="flex gap-2 items-center">
                        <input
                          className="p-1 rounded-sm text-black h-7"
                          value={tipAmount}
                          step={tipStep}
                          min={tipStep}
                          type="number"
                          onChange={(e) => setTipAmount(+e.target.value)}
                        />
                        <button
                          onClick={finalizeTip}
                          className={`${baseButtonStyle} rounded-sm px-2`}
                        >
                          Send
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`${extendedButtonStyle} text-md self-stretch`}
                        onClick={() => showTipUi(i)}
                      >
                        Tip SOL
                      </button>
                    )}
                  </article>
                ))}
              </section>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
