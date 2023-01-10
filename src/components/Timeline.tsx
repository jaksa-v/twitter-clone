import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import useScrollPosition from "../hooks/useScrollPosition";

import { api } from "../utils/api";
import TweetCard from "./TweetCard";

export default function Timeline() {
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
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} client={client} />
      ))}
      {!hasNextPage && (
        <p className="text-sm text-gray-400">No more items to load</p>
      )}
    </>
  );
}
