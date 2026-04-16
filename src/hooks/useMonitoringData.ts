import { useState, useEffect, useCallback, useRef } from "react";
import { api, WS_URL } from "@/lib/api";
import { VariableConfig, Status } from "@/lib/monitoringData";
import { calculateFuzzy, FuzzyResult } from "@/lib/fuzzyLogic";

export interface LiveData {
  id: string;
  value: number;
  status: Status;
  history: number[];
  config: VariableConfig;
  fuzzy: FuzzyResult;
}

interface WsReading {
  reading: {
    id: number;
    variable_id: string;
    value: number;
    status: Status;
    timestamp: string;
  };
  variable: {
    id: string;
    name: string;
    unit: string;
    min: number;
    max: number;
    warning_min: number;
    warning_max: number;
    icon: string;
    category: "salmoura" | "motor";
  };
}

interface WsMessage {
  type: "readings" | "connected";
  data?: WsReading[];
}

function wsVariableToConfig(v: WsReading["variable"]): VariableConfig {
  return {
    id: v.id,
    name: v.name,
    unit: v.unit,
    min: v.min,
    max: v.max,
    warningMin: v.warning_min,
    warningMax: v.warning_max,
    icon: v.icon,
    category: v.category,
  };
}

const HISTORY_LENGTH = 20;

export function useMonitoringData() {
  const [data, setData] = useState<Record<string, LiveData>>({});
  const [configs, setConfigs] = useState<VariableConfig[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const historyRef = useRef<Record<string, number[]>>({});

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isMounted = true;

    function connect() {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isMounted) setIsConnected(true);
      };

      ws.onmessage = (event: MessageEvent) => {
        if (!isMounted) return;
        try {
          const message: WsMessage = JSON.parse(event.data as string);
          if (message.type !== "readings" || !message.data) return;

          const newConfigs: VariableConfig[] = [];
          const newEntries: Record<string, LiveData> = {};

          message.data.forEach(({ reading, variable }) => {
            const config = wsVariableToConfig(variable);
            newConfigs.push(config);

            const prevHistory = historyRef.current[reading.variable_id] ?? [];
            const history = [...prevHistory, reading.value].slice(-HISTORY_LENGTH);
            historyRef.current[reading.variable_id] = history;

            newEntries[reading.variable_id] = {
              id: reading.variable_id,
              value: reading.value,
              status: reading.status,
              history,
              config,
              fuzzy: calculateFuzzy(reading.value, config),
            };
          });

          setData((prev) => ({ ...prev, ...newEntries }));

          if (newConfigs.length > 0) {
            setConfigs(newConfigs);
          }
        } catch {
          // mensagem mal-formada, ignorar
        }
      };

      ws.onclose = () => {
        if (isMounted) {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, []);

  const updateConfig = useCallback(async (id: string, updates: Partial<VariableConfig>) => {
    const backendUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined)       backendUpdates.name        = updates.name;
    if (updates.unit !== undefined)       backendUpdates.unit        = updates.unit;
    if (updates.min !== undefined)        backendUpdates.min         = updates.min;
    if (updates.max !== undefined)        backendUpdates.max         = updates.max;
    if (updates.warningMin !== undefined) backendUpdates.warning_min = updates.warningMin;
    if (updates.warningMax !== undefined) backendUpdates.warning_max = updates.warningMax;
    if (updates.icon !== undefined)       backendUpdates.icon        = updates.icon;

    await api.put(`/api/variables/${id}`, backendUpdates);

    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const salmoura = configs.filter((c) => c.category === "salmoura").map((c) => data[c.id]).filter(Boolean);
  const motor = configs.filter((c) => c.category === "motor").map((c) => data[c.id]).filter(Boolean);

  return { salmoura, motor, configs, updateConfig, isConnected };
}
