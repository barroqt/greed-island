"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questController = void 0;
const questService_1 = require("../services/questService");
exports.questController = {
    create: async (req, res) => {
        try {
            const { name, playerId } = req.body;
            const quest = await questService_1.questService.create(name, playerId);
            res.status(201).json(quest);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create quest" });
        }
    },
    findById: async (req, res) => {
        try {
            const quest = await questService_1.questService.findById(req.params.id);
            if (quest) {
                res.json(quest);
            }
            else {
                res.status(404).json({ error: "Quest not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "Failed to retrieve quest" });
        }
    },
    findByPlayerId: async (req, res) => {
        try {
            const quests = await questService_1.questService.findByPlayerId(req.params.playerId);
            res.json(quests);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to retrieve quests" });
        }
    },
    update: async (req, res) => {
        try {
            const quest = await questService_1.questService.update(req.params.id, req.body);
            res.json(quest);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update quest" });
        }
    },
    delete: async (req, res) => {
        try {
            await questService_1.questService.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete quest" });
        }
    },
    completeQuest: async (req, res) => {
        try {
            const quest = await questService_1.questService.completeQuest(req.params.id);
            res.json(quest);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to complete quest" });
        }
    },
};
