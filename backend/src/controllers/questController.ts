import { Request, Response } from "express";
import { questService } from "../services/questService";

export const questController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, playerId } = req.body;
      const quest = await questService.create(name, playerId);
      res.status(201).json(quest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create quest" });
    }
  },

  findById: async (req: Request, res: Response) => {
    try {
      const quest = await questService.findById(req.params.id);
      if (quest) {
        res.json(quest);
      } else {
        res.status(404).json({ error: "Quest not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve quest" });
    }
  },

  findByPlayerId: async (req: Request, res: Response) => {
    try {
      const quests = await questService.findByPlayerId(req.params.playerId);
      res.json(quests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve quests" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const quest = await questService.update(req.params.id, req.body);
      res.json(quest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update quest" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await questService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete quest" });
    }
  },

  completeQuest: async (req: Request, res: Response) => {
    try {
      const quest = await questService.completeQuest(req.params.id);
      res.json(quest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to complete quest" });
    }
  },
};
