import { Card, CardContent } from "@/components/ui/card";
import { Status } from "@/lib/monitoringData";
import { FuzzyResult } from "@/lib/fuzzyLogic";
import {
  Droplets, FlaskConical, Thermometer, Atom, Circle, Hexagon, Gauge,
  Activity, RotateCw, Zap, Brain,
} from "lucide-react";
import { Cylinder3DIcon } from "@/components/Cylinder3DIcon";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { FUZZY_NATURAL_LABELS } from "@/lib/fuzzyLabels";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Droplets, FlaskConical, Thermometer, Atom, Circle, Hexagon, Gauge,
  Activity, RotateCw, Zap,
  Cylinder: Cylinder3DIcon,
};

const STATUS_STYLES: Record<Status, string> = {
  normal: "border-green-500/30 bg-green-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  critical: "border-red-500/30 bg-red-500/5 animate-pulse",
};

const STATUS_DOT: Record<Status, string> = {
  normal: "bg-green-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

const STATUS_LINE: Record<Status, string> = {
  normal: "hsl(142, 71%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  critical: "hsl(0, 84%, 60%)",
};

const FUZZY_LABEL_STYLE: Record<FuzzyResult["label"], string> = {
  "Muito Baixo": "text-blue-400",
  "Baixo": "text-sky-400",
  "Normal": "text-green-400",
  "Alto": "text-amber-400",
  "Muito Alto": "text-red-400",
};

interface MonitorCardProps {
  variableId: string;
  name: string;
  unit: string;
  value: number;
  status: Status;
  icon: string;
  history: number[];
  fuzzy: FuzzyResult;
}

export function MonitorCard({ variableId, name, unit, value, status, icon, history, fuzzy }: MonitorCardProps) {
  const IconComp = ICON_MAP[icon] || Circle;
  const chartData = history.map((v, i) => ({ i, v }));

  const naturalLabels = FUZZY_NATURAL_LABELS[variableId] || {};
  const dominantKey = Object.entries(fuzzy.memberships).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  const naturalLabel = naturalLabels[dominantKey] || fuzzy.label;

  return (
    <Card className={`transition-all duration-300 ${STATUS_STYLES[status]}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <IconComp className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{name}</span>
          </div>
          <div className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{unit}</p>
          </div>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={STATUS_LINE[status]}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Natural label */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Brain className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={`text-xs font-semibold ${FUZZY_LABEL_STYLE[fuzzy.label]}`}>
              {naturalLabel}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
