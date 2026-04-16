# SALNUTRA - Backend

API REST + WebSocket para monitoramento industrial de processo de transformação de salmoura.

## Stack

- Node.js + TypeScript
- Express (HTTP)
- `ws` (WebSocket)
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`) + bcrypt
- Zod (validação)

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

## Configuração

1. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Ajuste `DATABASE_URL` com as credenciais do seu PostgreSQL.

3. Crie o banco de dados e execute o schema + seed:
   ```bash
   psql -U postgres -c "CREATE DATABASE salnutra;"
   psql -U postgres -d salnutra -f src/db/schema.sql
   psql -U postgres -d salnutra -f src/db/seed.sql
   ```

## Executar em desenvolvimento

```bash
npm install
npm run dev
```

O servidor sobe na porta `3001` (ou a definida em `PORT`).

## Endpoints

| Método | Rota                          | Acesso      | Descrição                        |
|--------|-------------------------------|-------------|----------------------------------|
| GET    | `/api/health`                 | Público     | Health check                     |
| POST   | `/api/auth/login`             | Público     | Login (email + senha)            |
| GET    | `/api/auth/me`                | Autenticado | Dados do usuário logado          |
| GET    | `/api/variables`              | usuario+    | Listar variáveis e configurações |
| PUT    | `/api/variables/:id`          | operador+   | Atualizar thresholds             |
| GET    | `/api/devices`                | usuario+    | Listar dispositivos              |
| POST   | `/api/devices`                | admin       | Criar dispositivo                |
| PUT    | `/api/devices/:id`            | admin       | Atualizar dispositivo            |
| DELETE | `/api/devices/:id`            | admin       | Remover dispositivo              |
| GET    | `/api/readings/latest`        | usuario+    | Última leitura de cada variável  |
| GET    | `/api/readings/history/:id`   | usuario+    | Histórico de leituras            |

## WebSocket

Conecte em `ws://localhost:3001`.

Mensagens recebidas:
```json
{ "type": "connected", "message": "..." }
{ "type": "readings", "data": [{ "reading": {...}, "variable": {...} }] }
```

Dados simulados são gerados e transmitidos a cada **3 segundos**.

## Usuários padrão (seed)

| Email                    | Senha        | Perfil   |
|--------------------------|--------------|----------|
| admin@salnutra.com       | admin123     | admin    |
| operador@salnutra.com    | operador123  | operador |
| usuario@salnutra.com     | usuario123   | usuario  |
