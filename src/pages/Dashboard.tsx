import { MonitorCard } from "@/components/MonitorCard";
import { useMonitoringData } from "@/hooks/useMonitoringData";
import { Droplets, Cog } from "lucide-react";

const Dashboard = () => {
  const { salmoura, motor } = useMonitoringData();

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Monitoramento da Salmoura</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {salmoura.map((d) => (
            <MonitorCard
              key={d.id}
              variableId={d.id}
              name={d.config.name}
              unit={d.config.unit}
              value={d.value}
              status={d.status}
              icon={d.config.icon}
              history={d.history}
              fuzzy={d.fuzzy}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Cog className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Análise do Motor do Moinho</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {motor.map((d) => (
            <MonitorCard
              key={d.id}
              variableId={d.id}
              name={d.config.name}
              unit={d.config.unit}
              value={d.value}
              status={d.status}
              icon={d.config.icon}
              history={d.history}
              fuzzy={d.fuzzy}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
