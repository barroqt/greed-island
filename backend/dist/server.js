"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const playerRoutes_1 = __importDefault(require("./routes/playerRoutes"));
const questRoutes_1 = __importDefault(require("./routes/questRoutes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const errorHandler_1 = require("./utils/errorHandler");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Routes
app.use("/api/players", playerRoutes_1.default);
app.use("/api/quests", questRoutes_1.default);
app.use("/api/items", itemRoutes_1.default);
app.use(errorHandler_1.errorHandler.handleErrors);
app.use(errorHandler_1.errorHandler.handle404);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
