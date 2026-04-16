import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Device } from "@/lib/devicesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HardDrive, Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react";

const Devices = () => {
  const { data: devices = [], isLoading, isError } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: () => api.get<Device[]>("/api/devices"),
    refetchInterval: 10000,
  });

  const online = devices.filter((d) => d.status === "online").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-destructive p-4">
        <AlertTriangle className="h-5 w-5" />
        <span>Erro ao carregar dispositivos. Verifique a conexão com o servidor.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dispositivos Conectados</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <HardDrive className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{devices.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Wifi className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{online}</p>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <WifiOff className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{devices.length - online}</p>
              <p className="text-sm text-muted-foreground">Offline</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Dispositivos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atividade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell className="font-mono text-sm">{d.ip}</TableCell>
                  <TableCell>
                    <Badge variant={d.status === "online" ? "default" : "destructive"}>
                      {d.status === "online" ? "Online" : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {d.last_seen
                      ? new Date(d.last_seen).toLocaleString("pt-BR")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Devices;
