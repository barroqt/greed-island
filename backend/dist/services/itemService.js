"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.itemService = {
    create: async (name, description, type) => {
        return prisma_1.default.item.create({
            data: {
                name,
                description,
                type,
            },
        });
    },
    findById: async (id) => {
        return prisma_1.default.item.findUnique({
            where: { id },
            include: { inventoryItems: true },
        });
    },
    findByType: async (type) => {
        return prisma_1.default.item.findMany({
            where: { type },
        });
    },
    update: async (id, data) => {
        return prisma_1.default.item.update({
            where: { id },
            data,
            include: { inventoryItems: true },
        });
    },
    delete: async (id) => {
        return prisma_1.default.item.delete({
            where: { id },
        });
    },
};
