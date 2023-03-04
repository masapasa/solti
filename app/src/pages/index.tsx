import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
import pkg from "../../package.json";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>{pkg.name}</title>
        <meta name="description" content={pkg.description} />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
