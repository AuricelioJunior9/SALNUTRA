import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Shield, Wrench, Eye, Loader2 } from "lucide-react";

const QUICK_LOGIN: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { role: "admin",    label: "Admin",    icon: <Shield className="h-4 w-4" />, desc: "Acesso total" },
  { role: "operador", label: "Operador", icon: <Wrench className="h-4 w-4" />, desc: "Ajustar parâmetros" },
  { role: "usuario",  label: "Usuário",  icon: <Eye className="h-4 w-4" />,   desc: "Visualizar dados" },
];

const Login = () => {
  const { login, loginAs } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quickLoginRole, setQuickLoginRole] = useState<UserRole | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const ok = await login(email, password);
      if (!ok) setError("Credenciais inválidas");
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setError("");
    setQuickLoginRole(role);
    try {
      await loginAs(role);
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setQuickLoginRole(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Droplets className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold tracking-tight">SALNUTRA</CardTitle>
          </div>
          <CardDescription className="text-base">
            Monitoramento do Processo da Salmoura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                disabled={isSubmitting}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Entrar
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Acesso rápido (Demo)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {QUICK_LOGIN.map((q) => (
              <Button
                key={q.role}
                variant="outline"
                className="flex flex-col h-auto py-3 gap-1"
                disabled={quickLoginRole !== null}
                onClick={() => handleQuickLogin(q.role)}
              >
                {quickLoginRole === q.role
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : q.icon}
                <span className="text-xs font-semibold">{q.label}</span>
                <span className="text-[10px] text-muted-foreground">{q.desc}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
