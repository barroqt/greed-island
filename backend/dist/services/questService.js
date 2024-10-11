"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.questService = {
    create: async (name, playerId) => {
        return prisma_1.default.quest.create({
            data: {
                name,
                player: { connect: { id: playerId } },
            },
        });
    },
    findById: async (id) => {
        return prisma_1.default.quest.findUnique({
            where: { id },
            include: { player: true },
        });
    },
    findByPlayerId: async (playerId) => {
        return prisma_1.default.quest.findMany({
            where: { playerId },
        });
    },
    update: async (id, data) => {
        return prisma_1.default.quest.update({
            where: { id },
            data,
            include: { player: true },
        });
    },
    delete: async (id) => {
        return prisma_1.default.quest.delete({
            where: { id },
        });
    },
    completeQuest: async (id) => {
        return prisma_1.default.quest.update({
            where: { id },
            data: { completed: true },
            include: { player: true },
        });
    },
};
