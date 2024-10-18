import express from "express";
import { playerController } from "../controllers/playerController";

const router = express.Router();

router.post("/", playerController.create);
router.get("/:id", playerController.findById);
router.get("/address/:address", playerController.findByAddress);
router.put("/:id", playerController.update);
router.delete("/:id", playerController.delete);
router.post("/:id/inventory", playerController.addItemToInventory);
router.delete(
  "/:id/inventory/:itemId",
  playerController.removeItemFromInventory
);

export default router;
