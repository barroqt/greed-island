"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questController_1 = require("../controllers/questController");
const router = express_1.default.Router();
router.post("/", questController_1.questController.create);
router.get("/:id", questController_1.questController.findById);
router.get("/player/:playerId", questController_1.questController.findByPlayerId);
router.put("/:id", questController_1.questController.update);
router.delete("/:id", questController_1.questController.delete);
router.post("/:id/complete", questController_1.questController.completeQuest);
exports.default = router;
