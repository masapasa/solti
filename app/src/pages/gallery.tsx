import type { NextPage } from "next";
import Head from "next/head";
import { GalleryView } from "../views";

const Gallery: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Gallery</title>
        <meta name="description" content="Image Gallery" />
      </Head>
      <GalleryView />
    </div>
  );
};

export default Gallery;
