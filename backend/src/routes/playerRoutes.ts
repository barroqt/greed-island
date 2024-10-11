import express from "express";
import { playerController } from "../controllers/playerController";

console.log("Player routes file loaded");

const router = express.Router();

console.log("Player router created");

router.post("/", playerController.create);
router.get("/:id", playerController.findById);
router.put("/:id", playerController.update);
router.delete("/:id", playerController.delete);
router.post("/:id/inventory", playerController.addItemToInventory);
router.delete(
  "/:id/inventory/:itemId",
  playerController.removeItemFromInventory
);

console.log("Player routes defined");

export default router;
