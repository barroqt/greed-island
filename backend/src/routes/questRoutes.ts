import express from "express";
import { questController } from "../controllers/questController";

const router = express.Router();

router.post("/", questController.create);
router.get("/:id", questController.findById);
router.get("/player/:playerId", questController.findByPlayerId);
router.put("/:id", questController.update);
router.delete("/:id", questController.delete);
router.post("/:id/complete", questController.completeQuest);

export default router;
