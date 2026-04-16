export interface Device {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline";
  ip: string;
  last_seen: string;
}

export const MOCK_DEVICES: Device[] = [
  { id: "d1", name: "CLP Principal", type: "Controlador Lógico Programável", status: "online", ip: "192.168.1.1", last_seen: new Date().toISOString() },
  { id: "d2", name: "Microcontrolador ESP32", type: "Microcontrolador", status: "online", ip: "192.168.1.10", last_seen: new Date().toISOString() },
  { id: "d3", name: "Inversor de Frequência CFW11", type: "Inversor de Frequência", status: "online", ip: "192.168.1.20", last_seen: new Date().toISOString() },
  { id: "d4", name: "Soft Starter SSW07", type: "Soft Start", status: "offline", ip: "192.168.1.21", last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
];
