import type { NextPage } from "next";
import Head from "next/head";
import { SocialView } from "../views";

const Social: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Social</title>
        <meta name="description" content="Social App" />
      </Head>
      <SocialView />
    </div>
  );
};

export default Social;
