import { Prisma } from "@prisma/client";
import Image from "next/image";

const tweetWithAuthor = Prisma.validator<Prisma.TweetArgs>()({
  include: { author: true },
});

type TweetWithAuthor = Prisma.TweetGetPayload<typeof tweetWithAuthor>;

export default function TweetCard({ tweet }: { tweet: TweetWithAuthor }) {
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
          <p className="font-semibold text-white">{tweet.author.name}</p>
          <p className="text-sm text-gray-400">@{tweet.author.email}</p>
        </div>
      </div>
      <div>
        <p className="text-white">{tweet.text}</p>
      </div>
    </div>
  );
}
