/* eslint-disable @typescript-eslint/no-misused-promises */
import { useQueryClient } from "@tanstack/react-query";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import PostTweet from "../components/PostTweet";
import TweetCard from "../components/TweetCard";
import useScrollPosition from "../hooks/useScrollPosition";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const scrollPosition = useScrollPosition();

  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.tweet.list.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  const client = useQueryClient();

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-start justify-center gap-8 p-4 sm:w-[640px]">
          <PostTweet />
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} client={client} />
          ))}
          {!hasNextPage && (
            <p className="text-sm text-gray-400">No more items to load</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
