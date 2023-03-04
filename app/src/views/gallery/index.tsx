import { FC, useEffect, useMemo, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { notify } from "../../utils/notifications";
import { sendSol } from "utils/sendSol";
import { AnchorProvider, BN, Idl, Program } from "@coral-xyz/anchor";
// import dataAccountSecretKey from "../../dataAccountSecretKey.json";
// const dataAccountSecretKey = JSON.parse(
//   process.env.NEXT_PUBLIC_DATA_ACCOUNT_SECRET_KEY
// );

// https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp

type Submission = {
  url: "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp";
  author: PublicKey;
  votes: BN;
};

const baseButtonStyle = "bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-1";
const extendedButtonStyle = `${baseButtonStyle} px-2 rounded-md`;

const tipStep = 1000 / LAMPORTS_PER_SOL;

const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
console.log("programId:", programId);

// const generatedDataAccount = Keypair.generate();
// const storedDataAccount = Keypair.fromSecretKey(new Uint8Array(dataAccountSecretKey));
// const dataAccount = Keypair.fromSeed(new Uint8Array(programId.toBytes()));
// console.log("dataAccount:", dataAccount);

const [pda] = PublicKey.findProgramAddressSync([Buffer.from("5")], programId);
console.log("PDA:", pda);

export const GalleryView: FC = ({}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [userUrlInput, setUserUrlInput] = useState("");
  const [submissionBeingTipped, setSubmissionBeingTipped] = useState<
    number | null
  >(null);
  const [userTipInput, setUserTipInput] = useState(tipStep);

  const [dataAccountInitialized, setDataAccountInitialized] = useState(true);
  const [program, setProgram] = useState<Program | null>(null);
  const [idl, setIdl] = useState<Idl | null>(null);

  const { connection } = useConnection();
  const wallet = useWallet();
  const provider = useMemo(
    () => new AnchorProvider(connection, wallet, {}),
    [connection, wallet]
  );
  const { publicKey: user, sendTransaction } = wallet;

  async function upvote(index: number) {
    if (!program) {
      console.error(`addLink: program is ${program}. Returning.`);
    }

    console.log(`Upvoting #${index}...`);
    await program.methods
      .upvoteSubmission(index)
      .accounts({
        dataAccount: pda,
        //   user: provider.wallet.publicKey,
      })
      .rpc();

    await fetchSubmissions();
  }

  async function downvote(index: number) {
    if (!program) {
      console.error(`addLink: program is ${program}. Returning.`);
    }

    console.log(`Downvoting #${index}...`);
    await program.methods
      .downvoteSubmission(index)
      .accounts({
        dataAccount: pda,
        // user: provider.wallet.publicKey,
      })
      .rpc();

    await fetchSubmissions();
  }

  async function finalizeTip() {
    if (!user) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    const recipient = submissions[submissionBeingTipped].author;

    await sendSol(
      connection,
      sendTransaction,
      user,
      recipient,
      userTipInput * LAMPORTS_PER_SOL
    );
  }

  async function fetchIdl() {
    if (!user) {
      console.log(`fetchIdl: user is ${user}. Returning.`);
      return;
    }

    console.log("fetchIdl: Fetching the IDL...");
    const idl = await Program.fetchIdl(programId, provider);
    console.log("fetchIdl: Successfully fetched the IDL!", idl);

    setIdl(idl);
  }

  async function fetchSubmissions() {
    if (!program) {
      console.error(`fetchSubmissions: program is ${program}. Returning.`);
      return;
    }

    console.log("fetchSubmissions: Fetching the data account...");
    try {
      const account = await program.account.dataAccount.fetch(pda);
      if (!account) {
        console.error(`fetchSubmissions: account is ${account}. Returning.`);
        return;
      }
      console.log(
        "fetchSubmissions: Successfully fetched the data account!",
        account
      );

      setSubmissions(account.submissions as Submission[]);
    } catch (e) {
      console.log(
        "fetchSubmissions: Need to initialize the data account first."
      );
      setDataAccountInitialized(false);
      setSubmissions([]);
    }
  }

  async function addSubmission(url: string) {
    if (!program) {
      console.log(`addSubmission: program is ${program}. Returning.`);
    }

    console.log(`addSubmission: Adding ${url}...`);

    await program.methods[
      dataAccountInitialized ? "addSubmission" : "initDataAccount"
    ](url)
      .accounts({
        dataAccount: pda,
        // user: provider.wallet.publicKey,
      })
      .rpc();
    if (!dataAccountInitialized) {
      setDataAccountInitialized(true);
      console.log("addSubmission: Successfully initialized!");
    }

    console.log(`addSubmission: Successfully added ${url}!`);

    await fetchSubmissions();
  }

  useEffect(() => {
    fetchIdl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (program) fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  useEffect(() => {
    if (!(idl && programId && provider)) {
      console.log(
        "useEffect: One or more vars are still missing. Next time..."
      );
      return;
    }

    const program = new Program(idl, programId, provider);
    console.log("useEffect: Successfully initialized the program!", program);
    setProgram(program);
  }, [idl, provider]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Gallery
        </h1>
        {!wallet.connected ? (
          <p className="text-2xl">Wallet not connected.</p>
        ) : (
          <div className="text-center">
            <section className="flex flex-col gap-9 items-center">
              <form
                className="flex flex-col gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const url = new URL(userUrlInput).href;
                    await addSubmission(url);
                  } catch (e) {
                    console.error("Image URL submission error:", e);
                  }
                  setUserUrlInput("");
                }}
              >
                <input
                  placeholder="Image URL"
                  className="p-1 rounded-sm text-black"
                  value={userUrlInput}
                  onChange={(e) => setUserUrlInput(e.target.value)}
                />
                <input
                  type="submit"
                  className={`${baseButtonStyle} rounded-sm`}
                />
              </form>
              <section className="flex flex-col gap-3">
                {submissions?.map((submission, i) => (
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
                      {submission.votes.toNumber()}{" "}
                      <button
                        onClick={() => upvote(i)}
                        className={`${extendedButtonStyle} text-xs`}
                      >
                        +
                      </button>
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={submission.url}
                      alt=""
                      className="w-40 rounded-md mb-1"
                    />
                    {submissionBeingTipped === i ? (
                      <div className="flex gap-2 items-center">
                        <input
                          className="p-1 rounded-sm text-black h-7"
                          value={userTipInput}
                          step={tipStep}
                          min={tipStep}
                          type="number"
                          onChange={(e) => setUserTipInput(+e.target.value)}
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
                        onClick={() => setSubmissionBeingTipped(i)}
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
