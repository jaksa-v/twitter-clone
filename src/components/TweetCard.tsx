import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import { HiHeart } from "react-icons/hi";
import type { RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

type Tweet = RouterOutputs["tweet"]["list"]["tweets"][0];

function updateCache({
  client,
  variables,
  data,
  action,
}: {
  client: QueryClient;
  variables: {
    tweetId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike";
}) {
  client.setQueryData(
    [
      ["tweet", "list"],
      {
        input: {
          limit: 10,
        },
        type: "infinite",
      },
    ],
    (oldData) => {
      const newData = oldData as InfiniteData<RouterOutputs["tweet"]["list"]>;

      const newTweets = newData.pages.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,
                likes: action === "like" ? [data.userId] : [],
              };
            }

            return tweet;
          }),
        };
      });

      return {
        ...newData,
        pages: newTweets,
      };
    }
  );
}

export default function TweetCard({
  tweet,
  client,
}: {
  tweet: Tweet;
  client: QueryClient;
}) {
  const likeMutation = api.tweet.like.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "like" });
    },
  }).mutateAsync;
  const unlikeMutation = api.tweet.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "unlike" });
    },
  }).mutateAsync;

  const hasLiked = tweet.likes.length > 0;

  return (
    <div className="flex flex-col items-start justify-center gap-2">
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
          <div className="flex items-center gap-4">
            <p className="font-semibold text-white">{tweet.author.name}</p>
            <p className="text-xs text-gray-400">
              {dayjs(tweet.createdAt).fromNow()}
            </p>
          </div>
          <p className="text-sm text-gray-400">@{tweet.author.email}</p>
        </div>
      </div>
      <div>
        <p className="text-white">{tweet.text}</p>
      </div>
      <div className="flex">
        <div className="flex">
          <HiHeart
            className={hasLiked ? "text-red-500" : "text-gray-400"}
            size="1.5rem"
            onClick={() => {
              if (hasLiked) {
                void unlikeMutation({ tweetId: tweet.id });
              } else {
                void likeMutation({ tweetId: tweet.id });
              }
            }}
          />
          <span className="text-gray-400">10</span>
        </div>
      </div>
    </div>
  );
}
