import { FC } from "react";
import solana from "./solana.svg";
import Image from "next/image";

export const Footer: FC = () => {
  return (
    <footer className="relative border-t-2 border-[#141414] bg-black p-4 text-secondary text-center">
      Built on{" "}
      <a href="https://solana.com" target="_blank" rel="noreferrer">
        <Image src={solana} alt="Solana" className="inline p-1" height={14} />
      </a>{" "}
      for the{" "}
      <a
        className="text-gray-300"
        href="https://solana.com/grizzlython"
        target="_blank"
        rel="noreferrer"
      >
        Grizzlython
      </a>{" "}
      hackathon.
    </footer>
  );
};
