import express from "express";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swaggerConfig";
import playerRoutes from "./routes/playerRoutes";
import questRoutes from "./routes/questRoutes";
import itemRoutes from "./routes/itemRoutes";
import { errorHandler } from "./utils/errorHandler";

const app = express();

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/players", playerRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/items", itemRoutes);

app.use(errorHandler.handleErrors);
app.use(errorHandler.handle404);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

export default app;
