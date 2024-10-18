import express from "express";
import { questController } from "../controllers/questController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quests
 *   description: Quest management
 */

/**
 * @swagger
 * /api/quests:
 *   post:
 *     summary: Create a new quest
 *     tags: [Quests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - playerId
 *             properties:
 *               name:
 *                 type: string
 *               playerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quest'
 *       500:
 *         description: Server Error
 */
router.post("/", questController.create);

/**
 * @swagger
 * /api/quests/{id}:
 *   get:
 *     summary: Get a quest by ID
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quest'
 *       404:
 *         description: Quest not found
 *       500:
 *         description: Server Error
 */
router.get("/:id", questController.findById);

/**
 * @swagger
 * /api/quests/player/{playerId}:
 *   get:
 *     summary: Get all quests for a player
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quest'
 *       500:
 *         description: Server Error
 */
router.get("/player/:playerId", questController.findByPlayerId);

/**
 * @swagger
 * /api/quests/{id}:
 *   put:
 *     summary: Update a quest
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestUpdate'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quest'
 *       404:
 *         description: Quest not found
 *       500:
 *         description: Server Error
 */
router.put("/:id", questController.update);

/**
 * @swagger
 * /api/quests/{id}:
 *   delete:
 *     summary: Delete a quest
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest ID
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Quest not found
 *       500:
 *         description: Server Error
 */
router.delete("/:id", questController.delete);

/**
 * @swagger
 * /api/quests/{id}/complete:
 *   post:
 *     summary: Mark a quest as completed
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quest'
 *       404:
 *         description: Quest not found
 *       500:
 *         description: Server Error
 */
router.post("/:id/complete", questController.completeQuest);

export default router;
