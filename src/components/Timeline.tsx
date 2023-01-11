import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import useScrollPosition from "../hooks/useScrollPosition";

import { api } from "../utils/api";
import TweetCard from "./TweetCard";

export default function Timeline() {
  const scrollPosition = useScrollPosition();

  const { data, status, hasNextPage, fetchNextPage, isFetching } =
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

  if (status === "loading")
    return <p className="mx-auto mt-4">Loading tweets...</p>;

  if (status === "error")
    return <p className="mx-auto mt-4">Error loading tweets...</p>;

  if (tweets.length === 0)
    return <p className="mx-auto mt-4">No tweets yet...</p>;

  return (
    <>
      {tweets.map((tweet, index) => (
        <TweetCard key={`${tweet.id}${index}`} tweet={tweet} client={client} />
      ))}
      {!hasNextPage && tweets.length > 10 && (
        <p className="mx-auto my-4 text-sm text-gray-400">
          No more tweets to load
        </p>
      )}
    </>
  );
}
