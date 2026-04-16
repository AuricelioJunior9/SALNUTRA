import "./config/env";
import express from "express";
import cors from "cors";
import http from "http";
import { env } from "./config/env";
import { testConnection } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import variablesRoutes from "./routes/variables.routes";
import devicesRoutes from "./routes/devices.routes";
import readingsRoutes from "./routes/readings.routes";
import { createWebSocketServer } from "./services/simulator.service";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/variables", variablesRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/readings", readingsRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const server = http.createServer(app);

createWebSocketServer(server);

async function start() {
  try {
    await testConnection();
    server.listen(env.PORT, () => {
      console.log(`Servidor SALNUTRA rodando na porta ${env.PORT}`);
      console.log(`WebSocket disponivel em ws://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();
