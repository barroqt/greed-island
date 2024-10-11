"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.playerService = {
    create: async (address) => {
        return prisma_1.default.player.create({
            data: { address },
        });
    },
    findById: async (id) => {
        return prisma_1.default.player.findUnique({
            where: { id },
            include: { inventory: { include: { item: true } }, quests: true },
        });
    },
    findByAddress: async (address) => {
        return prisma_1.default.player.findUnique({
            where: { address },
            include: { inventory: { include: { item: true } }, quests: true },
        });
    },
    update: async (id, data) => {
        return prisma_1.default.player.update({
            where: { id },
            data,
            include: { inventory: { include: { item: true } }, quests: true },
        });
    },
    delete: async (id) => {
        return prisma_1.default.player.delete({
            where: { id },
        });
    },
    addItemToInventory: async (playerId, itemId, quantity) => {
        const existingItem = await prisma_1.default.inventoryItem.findFirst({
            where: {
                playerId: playerId,
                itemId: itemId,
            },
        });
        // Update if item already in inventory
        if (existingItem) {
            return prisma_1.default.inventoryItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: {
                        increment: quantity,
                    },
                },
                include: { item: true },
            });
        }
        else {
            // Create new inventory item
            return prisma_1.default.inventoryItem.create({
                data: {
                    player: { connect: { id: playerId } },
                    item: { connect: { id: itemId } },
                    quantity,
                },
                include: { item: true },
            });
        }
    },
    removeItemFromInventory: async (playerId, itemId, quantity) => {
        const inventoryItem = await prisma_1.default.inventoryItem.findFirst({
            where: {
                playerId: playerId,
                itemId: itemId,
            },
        });
        if (!inventoryItem || inventoryItem.quantity < quantity) {
            throw new Error("Not enough items in inventory");
        }
        if (inventoryItem.quantity === quantity) {
            await prisma_1.default.inventoryItem.delete({
                where: { id: inventoryItem.id },
            });
            return null;
        }
        return prisma_1.default.inventoryItem.update({
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
