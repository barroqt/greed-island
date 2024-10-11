import { Request, Response } from "express";
import { playerService } from "../services/playerService";

export const playerController = {
  create: async (req: Request, res: Response) => {
    try {
      const { address } = req.body;
      console.log(`[IN CONTROLLER] address: ${address}`);
      const player = await playerService.create(address);
      res.status(201).json(player);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create player" });
    }
  },

  findById: async (req: Request, res: Response) => {
    try {
      const player = await playerService.findById(req.params.id);
      if (player) {
        res.json(player);
      } else {
        res.status(404).json({ error: "Player not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve player" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const player = await playerService.update(req.params.id, req.body);
      res.json(player);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update player" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await playerService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete player" });
    }
  },

  addItemToInventory: async (req: Request, res: Response) => {
    try {
      const { itemId, quantity } = req.body;
      const inventoryItem = await playerService.addItemToInventory(
        req.params.id,
        itemId,
        quantity
      );
      res.status(201).json(inventoryItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add item to inventory" });
    }
  },

  removeItemFromInventory: async (req: Request, res: Response) => {
    try {
      const { quantity } = req.body;
      const result = await playerService.removeItemFromInventory(
        req.params.id,
        req.params.itemId,
        quantity
      );
      if (result === null) {
        res.status(204).send();
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to remove item from inventory" });
    }
  },
};
