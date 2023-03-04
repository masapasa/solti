import type { NextPage } from "next";
import Head from "next/head";
import { BasicsView } from "../views";
import pkg from "../../package.json";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>{pkg.name}</title>
        <meta name="description" content="Basic Functionality" />
      </Head>
      <BasicsView />
    </div>
  );
};

export default Basics;
