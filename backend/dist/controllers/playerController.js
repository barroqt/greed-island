"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerController = void 0;
const playerService_1 = require("../services/playerService");
exports.playerController = {
    create: async (req, res) => {
        try {
            const { address } = req.body;
            const player = await playerService_1.playerService.create(address);
            res.status(201).json(player);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create player" });
        }
    },
    findById: async (req, res) => {
        try {
            const player = await playerService_1.playerService.findById(req.params.id);
            if (player) {
                res.json(player);
            }
            else {
                res.status(404).json({ error: "Player not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to retrieve player" });
        }
    },
    update: async (req, res) => {
        try {
            const player = await playerService_1.playerService.update(req.params.id, req.body);
            res.json(player);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update player" });
        }
    },
    delete: async (req, res) => {
        try {
            await playerService_1.playerService.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete player" });
        }
    },
    addItemToInventory: async (req, res) => {
        try {
            const { itemId, quantity } = req.body;
            const inventoryItem = await playerService_1.playerService.addItemToInventory(req.params.id, itemId, quantity);
            res.status(201).json(inventoryItem);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to add item to inventory" });
        }
    },
    removeItemFromInventory: async (req, res) => {
        try {
            const { quantity } = req.body;
            const result = await playerService_1.playerService.removeItemFromInventory(req.params.id, req.params.itemId, quantity);
            if (result === null) {
                res.status(204).send();
            }
            else {
                res.json(result);
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to remove item from inventory" });
        }
    },
};
