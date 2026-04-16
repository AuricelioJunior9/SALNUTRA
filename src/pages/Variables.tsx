import { useMonitoringData } from "@/hooks/useMonitoringData";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { VariableConfig } from "@/lib/monitoringData";
import { useState } from "react";
import { toast } from "sonner";

const Variables = () => {
  const { configs, updateConfig } = useMonitoringData();
  const { hasPermission } = useAuth();
  const canEdit = hasPermission("operador");
  const [saving, setSaving] = useState<string | null>(null);

  const salmoura = configs.filter((c) => c.category === "salmoura");
  const motor = configs.filter((c) => c.category === "motor");

  const handleUpdate = async (id: string, updates: Partial<VariableConfig>) => {
    setSaving(id);
    try {
      await updateConfig(id, updates);
      toast.success("Configuração salva.");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(null);
    }
  };

  const renderTable = (items: typeof configs, title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variável</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Mín. Alerta</TableHead>
              <TableHead>Máx. Alerta</TableHead>
              <TableHead>Mín. Absoluto</TableHead>
              <TableHead>Máx. Absoluto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  {c.name}
                  {saving === c.id && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                </TableCell>
                <TableCell><Badge variant="outline">{c.unit || "—"}</Badge></TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={c.warningMin}
                    disabled={!canEdit || saving === c.id}
                    className="w-24 h-8"
                    onBlur={(e) => handleUpdate(c.id, { warningMin: Number(e.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={c.warningMax}
                    disabled={!canEdit || saving === c.id}
                    className="w-24 h-8"
                    onBlur={(e) => handleUpdate(c.id, { warningMax: Number(e.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={c.min}
                    disabled={!canEdit || saving === c.id}
                    className="w-24 h-8"
                    onBlur={(e) => handleUpdate(c.id, { min: Number(e.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={c.max}
                    disabled={!canEdit || saving === c.id}
                    className="w-24 h-8"
                    onBlur={(e) => handleUpdate(c.id, { max: Number(e.target.value) })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuração de Parâmetros</h1>
      {!canEdit && (
        <p className="text-sm text-muted-foreground">
          Você tem acesso apenas para visualização. Contate um operador ou admin para alterar.
        </p>
      )}
      {renderTable(salmoura, "Parâmetros da Salmoura")}
      {renderTable(motor, "Parâmetros do Motor do Moinho")}
    </div>
  );
};

export default Variables;
