import { FC, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { notify } from "../../utils/notifications";
import { sendSol } from "utils/sendSol";

type Submission = {
  url: string;
  author: PublicKey;
};

const baseButtonStyle = "bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-1";
const extendedButtonStyle = `${baseButtonStyle} px-2 rounded-md`;

const tipStep = 1000 / LAMPORTS_PER_SOL;

export const GalleryView: FC = ({}) => {
  const [imageSubmissions, setImageSubmissions] = useState<Submission[]>([
    {
      url: "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
      author: new PublicKey("CQwU1maEsAUgnm4cvKr1mvztKkuER8q4eKPf3iyitXcG"),
    },
  ]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [votes, setVotes] = useState<{ [key: number]: number }>({});
  const [imageBeingTipped, setImageBeingTipped] = useState<number | null>(null);
  const [tipAmount, setTipAmount] = useState(tipStep);

  const { connection } = useConnection();
  const { publicKey: sender, sendTransaction } = useWallet();

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
    if (!sender) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    const recipient = imageSubmissions[imageBeingTipped].author;

    await sendSol(
      connection,
      sendTransaction,
      sender,
      recipient,
      tipAmount * LAMPORTS_PER_SOL
    );
  }

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Gallery
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <section className="flex flex-col gap-9 items-center">
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                try {
                  const url = new URL(imageUrlInput).href;
                  setImageSubmissions([
                    ...imageSubmissions,
                    {
                      url,
                      author: new PublicKey(
                        "CQwU1maEsAUgnm4cvKr1mvztKkuER8q4eKPf3iyitXcG"
                      ),
                    },
                  ]);
                } catch {}
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
                    src={submission.url}
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
      </div>
    </div>
  );
};
