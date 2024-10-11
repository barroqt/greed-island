"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemController = void 0;
const itemService_1 = require("../services/itemService");
exports.itemController = {
    create: async (req, res) => {
        try {
            const { name, description, type } = req.body;
            const item = await itemService_1.itemService.create(name, description, type);
            res.status(201).json(item);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create item" });
        }
    },
    findById: async (req, res) => {
        try {
            const item = await itemService_1.itemService.findById(req.params.id);
            if (item) {
                res.json(item);
            }
            else {
                res.status(404).json({ error: "Item not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to retrieve item" });
        }
    },
    findByType: async (req, res) => {
        try {
            const items = await itemService_1.itemService.findByType(req.params.type);
            res.json(items);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to retrieve items" });
        }
    },
    update: async (req, res) => {
        try {
            const item = await itemService_1.itemService.update(req.params.id, req.body);
            res.json(item);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update item" });
        }
    },
    delete: async (req, res) => {
        try {
            await itemService_1.itemService.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete item" });
        }
    },
};
