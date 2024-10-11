import express from "express";
import helmet from "helmet";
import cors from "cors";
import playerRoutes from "./routes/playerRoutes";
import questRoutes from "./routes/questRoutes";
import itemRoutes from "./routes/itemRoutes";
import { errorHandler } from "./utils/errorHandler";

const app = express();

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(helmet());
app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

console.log("Server setup started");
// Routes
console.log("Registering player routes");
app.use("/api/players", playerRoutes);
console.log("Registering quest routes");
app.use("/api/quests", questRoutes);
console.log("Registering item routes");
app.use("/api/items", itemRoutes);

console.log("Routes registered");

app.use(errorHandler.handleErrors);
app.use(errorHandler.handle404);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
