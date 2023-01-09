import { createTRPCRouter, publicProcedure } from "../trpc";

export const tweetRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      include: {
        author: true,
      },
      take: 10,
    });
  }),
});
