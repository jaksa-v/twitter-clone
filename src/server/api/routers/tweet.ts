import { tweetSchema } from "../../../components/PostTweet";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tweetRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      include: {
        author: true,
      },
      take: 10,
    });
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
});
