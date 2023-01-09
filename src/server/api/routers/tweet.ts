import { z } from "zod";
import { tweetSchema } from "../../../components/PostTweet";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tweetRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { prisma } = ctx;

      const tweets = await prisma.tweet.findMany({
        take: limit + 1,
        include: {
          likes: {
            where: {
              userId: ctx.session?.user?.id,
            },
            select: {
              userId: true,
            },
          },
          author: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: string | null = null;

      if (tweets.length > limit) {
        const nextItem = tweets.pop() as (typeof tweets)[number];

        nextCursor = nextItem.id;
      }

      return {
        tweets,
        nextCursor,
      };
    }),
  create: protectedProcedure.input(tweetSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    const { text } = input;

    const userId = session.user.id;

    return prisma.tweet.create({
      data: {
        text,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),
  like: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;

      const result = await prisma.like.create({
        data: {
          tweet: {
            connect: {
              id: input.tweetId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return result;
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;

      const result = await prisma.like.delete({
        where: {
          tweetId_userId: {
            tweetId: input.tweetId,
            userId,
          },
        },
      });

      return result;
    }),
});
