import prisma from "../utils/prisma";
import { Player, InventoryItem, Prisma } from "@prisma/client";

export const playerService = {
  create: async (address: string): Promise<Player> => {
    console.log(`[IN SERVICE] address: ${address}`);

    return prisma.player.create({
      data: { address },
    });
  },

  findById: async (id: string): Promise<Player | null> => {
    return prisma.player.findUnique({
      where: { id },
      include: { inventory: { include: { item: true } }, quests: true },
    });
  },

  findByAddress: async (address: string): Promise<Player | null> => {
    return prisma.player.findUnique({
      where: { address },
      include: { inventory: { include: { item: true } }, quests: true },
    });
  },

  update: async (
    id: string,
    data: Prisma.PlayerUpdateInput
  ): Promise<Player> => {
    return prisma.player.update({
      where: { id },
      data,
      include: { inventory: { include: { item: true } }, quests: true },
    });
  },

  delete: async (id: string): Promise<Player> => {
    return prisma.player.delete({
      where: { id },
    });
  },

  addItemToInventory: async (
    playerId: string,
    itemId: string,
    quantity: number
  ): Promise<InventoryItem> => {
    const existingItem = await prisma.inventoryItem.findFirst({
      where: {
        playerId: playerId,
        itemId: itemId,
      },
    });

    // Update if item already in inventory
    if (existingItem) {
      return prisma.inventoryItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
        include: { item: true },
      });
    } else {
      // Create new inventory item
      return prisma.inventoryItem.create({
        data: {
          player: { connect: { id: playerId } },
          item: { connect: { id: itemId } },
          quantity,
        },
        include: { item: true },
      });
    }
  },

  removeItemFromInventory: async (
    playerId: string,
    itemId: string,
    quantity: number
  ): Promise<InventoryItem | null> => {
    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: {
        playerId: playerId,
        itemId: itemId,
      },
    });

    if (!inventoryItem || inventoryItem.quantity < quantity) {
      throw new Error("Not enough items in inventory");
    }

    if (inventoryItem.quantity === quantity) {
      await prisma.inventoryItem.delete({
        where: { id: inventoryItem.id },
      });
      return null;
    }

    return prisma.inventoryItem.update({
      where: { id: inventoryItem.id },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
      include: { item: true },
    });
  },
};
