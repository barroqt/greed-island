import { Request, Response } from "express";
import { itemService } from "../services/itemService";
import { ItemType } from "@prisma/client";

export const itemController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, description, type } = req.body;
      const item = await itemService.create(
        name,
        description,
        type as ItemType
      );
      res.status(201).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create item" });
    }
  },

  findById: async (req: Request, res: Response) => {
    try {
      const item = await itemService.findById(req.params.id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve item" });
    }
  },

  findByType: async (req: Request, res: Response) => {
    try {
      const items = await itemService.findByType(req.params.type as ItemType);
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve items" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const item = await itemService.update(req.params.id, req.body);
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update item" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await itemService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  },
};
