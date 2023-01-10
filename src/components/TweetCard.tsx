import { Prisma } from "@prisma/client";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import { HiHeart } from "react-icons/hi";
import { api } from "../utils/api";

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

const tweetWithAuthor = Prisma.validator<Prisma.TweetArgs>()({
  include: {
    author: { select: { name: true, email: true, image: true } },
    likes: { select: { userId: true } },
  },
});

type TweetWithAuthor = Prisma.TweetGetPayload<typeof tweetWithAuthor>;

export default function TweetCard({ tweet }: { tweet: TweetWithAuthor }) {
  const utils = api.useContext();

  const likeMutation = api.tweet.like.useMutation({
    onSuccess: () => {
      void utils.tweet.list.invalidate();
    },
  }).mutateAsync;
  const unlikeMutation = api.tweet.unlike.useMutation({
    onSuccess: () => {
      void utils.tweet.list.invalidate();
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
