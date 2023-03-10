import { type NextPage } from "next";
import Head from "next/head";
import AuthModal from "../components/AuthModal";
import PostTweet from "../components/PostTweet";
import Timeline from "../components/Timeline";
import useAuthModal from "../hooks/useAuthModal";

const Home: NextPage = () => {
  const { showModal, setShowModal } = useAuthModal();

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start">
        <div className="container flex flex-col items-start justify-center sm:w-[640px]">
          <AuthModal showModal={showModal} setShowModal={setShowModal} />
          <PostTweet />
          <Timeline />
        </div>
      </main>
    </>
  );
};

export default Home;
