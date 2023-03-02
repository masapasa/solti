import { FC } from "react";
export const Footer: FC = () => {
  return (
    <footer className="relative border-t-2 border-[#141414] bg-black p-4 text-secondary text-center">
      Built on{" "}
      <a
        className="text-gray-300"
        href="https://solana.com"
        target="_blank"
        rel="noreferrer"
      >
        Solana
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
