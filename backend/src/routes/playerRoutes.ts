import express from "express";
import { playerController } from "../controllers/playerController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player management
 */

/**
 * @swagger
 * /api/players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *                 description: The player's wallet address
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       500:
 *         description: Server Error
 */
router.post("/", playerController.create);

/**
 * @swagger
 * /api/players/{id}:
 *   get:
 *     summary: Get a player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server Error
 */
router.get("/:id", playerController.findById);

/**
 * @swagger
 * /api/players/address/{address}:
 *   get:
 *     summary: Get a player by wallet address
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The player's wallet address
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server Error
 */
router.get("/address/:address", playerController.findByAddress);

/**
 * @swagger
 * /api/players/{id}:
 *   put:
 *     summary: Update a player
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayerUpdate'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server Error
 */
router.put("/:id", playerController.update);

/**
 * @swagger
 * /api/players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server Error
 */
router.delete("/:id", playerController.delete);

/**
 * @swagger
 * /api/players/{id}/inventory:
 *   post:
 *     summary: Add an item to player's inventory
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - quantity
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       404:
 *         description: Player or Item not found
 *       500:
 *         description: Server Error
 */
router.post("/:id/inventory", playerController.addItemToInventory);

/**
 * @swagger
 * /api/players/{id}/inventory/{itemId}:
 *   delete:
 *     summary: Remove an item from player's inventory
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Player, Item, or InventoryItem not found
 *       500:
 *         description: Server Error
 */
router.delete(
  "/:id/inventory/:itemId",
  playerController.removeItemFromInventory
);

export default router;
