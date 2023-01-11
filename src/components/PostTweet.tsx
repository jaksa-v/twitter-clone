import { useSession } from "next-auth/react";
import { useState } from "react";
import type { ZodIssue } from "zod";
import { object, string } from "zod";
import { api } from "../utils/api";

export const tweetSchema = object({
  text: string({
    required_error: "Tweet text is required",
  })
    .min(10)
    .max(280),
});

export default function PostTweet() {
  const { data: sessionData } = useSession();
  const utils = api.useContext();

  const mutation = api.tweet.create.useMutation({
    onSuccess: () => {
      setErrors(undefined);
      void utils.tweet.list.invalidate();
    },
  });

  const [errors, setErrors] = useState<ZodIssue[]>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements[0] as HTMLInputElement;
    const tweet = input.value;
    const result = tweetSchema.safeParse({ text: tweet });
    if (result.success) {
      mutation.mutate({ text: tweet });
      input.value = "";
    } else if (result.error.issues) {
      setErrors(result.error.issues);
    }
  };

  return (
    <>
      {sessionData ? (
        <form
          className="flex w-full flex-col gap-2 border-x border-b border-gray-600 p-4"
          onSubmit={handleSubmit}
        >
          {errors?.map((error) => (
            <p key={error.message}>{error.message}</p>
          ))}
          <input
            className="w-full rounded-lg bg-white/10 p-4 text-white"
            type="text"
            placeholder="Tweet something"
          />
          <button
            className="self-end rounded-2xl bg-cyan-500 px-4 py-2"
            type="submit"
          >
            Tweet
          </button>
        </form>
      ) : null}
    </>
  );
}
