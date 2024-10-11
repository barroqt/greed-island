import express from "express";
import { itemController } from "../controllers/itemController";

const router = express.Router();

router.post("/", itemController.create);
router.get("/:id", itemController.findById);
router.get("/type/:type", itemController.findByType);
router.put("/:id", itemController.update);
router.delete("/:id", itemController.delete);

export default router;
