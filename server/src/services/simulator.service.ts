import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { pool } from "../config/database";
import { insertReading, cleanOldReadings } from "./readings.service";
import { Variable, ReadingStatus } from "../types";

const INTERVAL_MS = 3000;
const CLEAN_INTERVAL_CYCLES = 100;

function generateValue(variable: Variable): number {
  const center = (variable.warning_min + variable.warning_max) / 2;
  const range = (variable.warning_max - variable.warning_min) / 2;
  const val = center + (Math.random() - 0.5) * range * 2.5;
  return Math.round(Math.max(variable.min, Math.min(variable.max, val)) * 100) / 100;
}

function getStatus(value: number, variable: Variable): ReadingStatus {
  if (value < variable.warning_min || value > variable.warning_max) {
    const critMin = variable.warning_min - (variable.warning_max - variable.warning_min) * 0.3;
    const critMax = variable.warning_max + (variable.warning_max - variable.warning_min) * 0.3;
    if (value < critMin || value > critMax) return "critical";
    return "warning";
  }
  return "normal";
}

async function loadVariables(): Promise<Variable[]> {
  const result = await pool.query<Variable>(
    `SELECT id, name, unit, min::float, max::float,
            warning_min::float, warning_max::float, icon, category
     FROM variables`
  );
  return result.rows;
}

function broadcast(wss: WebSocketServer, data: unknown): void {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

export function createWebSocketServer(server: http.Server): WebSocketServer {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log(`WebSocket: cliente conectado (total: ${wss.clients.size})`);
    ws.send(JSON.stringify({ type: "connected", message: "SALNUTRA WebSocket conectado." }));

    ws.on("close", () => {
      console.log(`WebSocket: cliente desconectado (total: ${wss.clients.size})`);
    });

    ws.on("error", (err) => {
      console.error("WebSocket erro no cliente:", err.message);
    });
  });

  let cycle = 0;

  const tick = async () => {
    try {
      const variables = await loadVariables();

      const readings = await Promise.all(
        variables.map(async (variable) => {
          const value = generateValue(variable);
          const status = getStatus(value, variable);
          const reading = await insertReading(variable.id, value, status);
          return { reading, variable };
        })
      );

      broadcast(wss, { type: "readings", data: readings });

      cycle++;
      if (cycle % CLEAN_INTERVAL_CYCLES === 0) {
        await cleanOldReadings(500);
      }
    } catch (err) {
      console.error("Erro no simulador:", err);
    }
  };

  setTimeout(async () => {
    await tick();
    setInterval(tick, INTERVAL_MS);
  }, 1000);

  console.log("Simulador de dados inicializado (intervalo: 3s).");

  return wss;
}
