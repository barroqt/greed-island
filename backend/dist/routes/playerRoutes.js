"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playerController_1 = require("../controllers/playerController");
const router = express_1.default.Router();
router.post("/", playerController_1.playerController.create);
router.get("/:id", playerController_1.playerController.findById);
router.put("/:id", playerController_1.playerController.update);
router.delete("/:id", playerController_1.playerController.delete);
router.post("/:id/inventory", playerController_1.playerController.addItemToInventory);
router.delete("/:id/inventory/:itemId", playerController_1.playerController.removeItemFromInventory);
exports.default = router;
