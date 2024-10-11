import prisma from "../utils/prisma";
import { Item, ItemType, Prisma } from "@prisma/client";

export const itemService = {
  create: async (
    name: string,
    description: string | null,
    type: ItemType
  ): Promise<Item> => {
    return prisma.item.create({
      data: {
        name,
        description,
        type,
      },
    });
  },

  findById: async (id: string): Promise<Item | null> => {
    return prisma.item.findUnique({
      where: { id },
      include: { inventoryItems: true },
    });
  },

  findByType: async (type: ItemType): Promise<Item[]> => {
    return prisma.item.findMany({
      where: { type },
    });
  },

  update: async (id: string, data: Prisma.ItemUpdateInput): Promise<Item> => {
    return prisma.item.update({
      where: { id },
      data,
      include: { inventoryItems: true },
    });
  },

  delete: async (id: string): Promise<Item> => {
    return prisma.item.delete({
      where: { id },
    });
  },
};
