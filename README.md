# Desafio Docker — Ambiente Multi-Container

Ambiente multi-container composto por uma API REST em Node.js (`api`) e um banco de dados MySQL 8.0 (`db`), configurados com **Dockerfile**, **Docker Compose**, **rede bridge isolada**, **volume persistente** e **variáveis de ambiente**.

## Arquitetura

- **`api` (Node.js + Express + mysql2):** construída a partir de `api/Dockerfile` sobre `node:20-alpine`, expõe as rotas `/health`, `GET /notas` e `POST /notas`.
- **`db` (MySQL 8.0):** armazena os dados no volume `mysql_data` (`/var/lib/mysql`), garantindo persistência mesmo ao recriar os contêineres.
- **Rede `backend_net` (`bridge`):** conecta `api` e `db` por resolução DNS interna (`DB_HOST=db`), sem expor a porta do banco externamente.
- **Variáveis de ambiente:** gerenciadas via `.env` (baseado em `.env.example`), mantendo credenciais fora do código-fonte.
