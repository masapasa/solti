import type { NextPage } from "next";
import Head from "next/head";
import { GenerateView } from "../views/generate";

const Generate: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Generate</title>
        <meta name="description" content="Image Generate" />
      </Head>
      <GenerateView />
    </div>
  );
};

export default Generate;
