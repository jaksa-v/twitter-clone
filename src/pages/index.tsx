import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
// import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const tweets = api.tweet.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-start justify-center gap-8 p-4 ">
          {tweets.data?.map((tweet) => (
            <div
              key={tweet.id}
              className="flex flex-col items-start justify-center gap-2"
            >
              <div className="flex items-center justify-center gap-4">
                {tweet.author.image && tweet.author.name && (
                  <Image
                    src={tweet.author.image}
                    alt={tweet.author.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}
                <div className="flex flex-col items-start justify-center">
                  <p className="font-semibold text-white">
                    {tweet.author.name}
                  </p>
                  <p className="text-sm text-gray-400">@{tweet.author.email}</p>
                </div>
              </div>
              <div>
                <p className="text-white">{tweet.text}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
