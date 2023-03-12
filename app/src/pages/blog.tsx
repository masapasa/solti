import type { NextPage } from "next";
import Head from "next/head";
import { BlogView } from "../views/blog";
import Card from "components/Card";
import { id } from "date-fns/locale";

const Blog: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Image Blog" />
      </Head>
      // get the upvote and downvote functions from the "/views/blog/index.tsx"

      

      <BlogView  />
      <div style={{ display: "flex", alignItems: "space-between", gap:11,border:"1px solid red",width:"100vh" }}>
      <Card imageSrc="https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp" title="to" description="do"/>
      <Card imageSrc="https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp" title="to" description="do"/>
      </div>
      <div style={{ display: "flex", alignItems: "space-between", gap:11 }}>
      <Card imageSrc="https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp" title="to" description="do"/>
      <Card imageSrc="https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp" title="to" description="do"/>
      </div>
    </div>
  );
};

export default Blog;
