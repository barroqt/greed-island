import prisma from "../utils/prisma";
import { Quest, Prisma } from "@prisma/client";

export const questService = {
  create: async (name: string, playerId: string): Promise<Quest> => {
    return prisma.quest.create({
      data: {
        name,
        player: { connect: { id: playerId } },
      },
    });
  },

  findById: async (id: string): Promise<Quest | null> => {
    return prisma.quest.findUnique({
      where: { id },
      include: { player: true },
    });
  },

  findByPlayerId: async (playerId: string): Promise<Quest[]> => {
    return prisma.quest.findMany({
      where: { playerId },
    });
  },

  update: async (id: string, data: Prisma.QuestUpdateInput): Promise<Quest> => {
    return prisma.quest.update({
      where: { id },
      data,
      include: { player: true },
    });
  },

  delete: async (id: string): Promise<Quest> => {
    return prisma.quest.delete({
      where: { id },
    });
  },

  completeQuest: async (id: string): Promise<Quest> => {
    return prisma.quest.update({
      where: { id },
      data: { completed: true },
      include: { player: true },
    });
  },
};
