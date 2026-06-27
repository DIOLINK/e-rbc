# Monorepo — DevContainer Setup Guide

Welcome, **Junior Developer**! This guide will walk you through setting up your local development environment using **VS Code DevContainers**. Everything runs inside Docker, so you don't need to install Java, Node, or MySQL on your host machine.

---

## Prerequisites

Install these tools on your **host machine** (your computer):

### 1. Docker

- **Download**: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Install**: Follow the installer for your OS (macOS / Windows / Linux)
- **Verify**: Open a terminal and run:

  ```bash
  docker --version
  docker compose version
  ```

### 2. Visual Studio Code

- **Download**: [VS Code](https://code.visualstudio.com/)
- **Install**: Run the installer for your OS

### 3. Dev Containers Extension (VS Code)

1. Open VS Code
2. Click the **Extensions** icon (or press `Cmd+Shift+X` on macOS / `Ctrl+Shift+X` on Windows/Linux)
3. Search for **"Dev Containers"** by Microsoft
4. Click **Install**

---

## Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/DIOLINK/e-rbc.git
cd e-rbc
```

### Step 2: Create Your Environment File

```bash
cp .env.example .env
```

Open `.env` in an editor if you want to change the database credentials (the defaults work fine for local development).

### Step 3: Open in DevContainer

#### Option A — Command Palette (Recommended)

1. In VS Code, press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type **"Dev Containers: Reopen in Container"**
3. Press **Enter**

#### Option B — Bottom-Left Corner

1. Click the green **"><"** icon in the bottom-left corner of VS Code
2. Select **"Reopen in Container"**

---

## What Happens Next

VS Code will:

1. Build the Docker images (first time only — may take **5–10 minutes**)
2. Start two containers:
   - **`java-dev-mysql`** — MySQL 8.0 database
   - **`java-dev-app`** — Your development environment (Java 22, Node.js, etc.)
3. Install VS Code extensions (Lombok, Java Pack, Boot Dev Pack)
4. Attach VS Code to the `app` container — you can now code inside it!

---

## Start Developing

The **backend starts automatically** when the DevContainer opens (Spring Boot on port `8080`). Wait ~30 seconds for it to finish booting.

### 1. Start the Frontend

Open a terminal inside VS Code (`Cmd+J` or `Ctrl+J`) and run:

```bash
cd frontend
pnpm install
pnpm dev
```

The Vite dev server starts at `http://localhost:5173`. It proxies all `/api` requests to the backend automatically.

### 2. Open the App

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 3. (Optional) Explore the API

Swagger UI is available at [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).

---

## Verify Everything is Working

### Check Running Containers

In your host terminal:

```bash
docker ps
```

You should see two containers: `java-dev-mysql` and `java-dev-app`.

### Check Database Connection

Inside the DevContainer terminal:

```bash
mysql -h db -u java_user -p
```

Enter the password from your `.env` file (default: `java_pass_456`).

### Check Java

```bash
java --version
# Output: openjdk 22.x.x
```

### Check Node.js

```bash
node --version
# Output: v24.16.0
```

---

## pnpm Commands (Frontend)

All commands must be run from the `frontend/` directory.

| Command          | Description           |
| ---------------- | --------------------- |
| `pnpm install`   | Install dependencies  |
| `pnpm dev`       | Start Vite dev server |
| `pnpm build`     | Build for production  |
| `pnpm lint`      | Run linter            |
| `pnpm add <pkg>` | Add a dependency      |

---

## Database Credentials (Default)

| Variable      | Value                |
| ------------- | -------------------- |
| Host          | `db` (inside Docker) |
| Port          | `3306`               |
| Root Password | `root_password_123`  |
| Database Name | `java_dev`           |
| App Username  | `java_user`          |
| App Password  | `java_pass_456`      |

> **Note:** Inside the `app` container, the MySQL host is `db` (the Docker Compose service name). From your host machine, use `localhost:3306`.

---

## Port Forwarding

| Port | Service               | URL                     |
| ---- | --------------------- | ----------------------- |
| 3306 | MySQL                 | `localhost:3306`        |
| 8080 | Spring Boot Backend   | `http://localhost:8080` |
| 5173 | Vite / React Frontend | `http://localhost:5173` |

---

## Common Issues & Troubleshooting

### "Cannot connect to MySQL" / `ECONNREFUSED`

The database may still be starting up. Wait 30 seconds and try again. You can also check logs:

```bash
docker logs java-dev-mysql
```

### Changes Not Reflecting / Weird Behavior

Rebuild the container from scratch:

1. `Cmd+Shift+P` → **"Dev Containers: Rebuild and Reopen in Container"**
2. Or click the green **"><"** → **"Rebuild Container"**

### Want to Start Fresh? (Delete Everything)

```bash
# Stop and remove containers + volumes (WARNING: deletes database data!)
docker compose -f .devcontainer/docker-compose.yml down -v
```

Then reopen in DevContainer.

### Port Already in Use

If port `3306`, `8080`, or `5173` is already used on your host:

1. Edit `.devcontainer/docker-compose.yml`
2. Change the **host** port (left side of the colon), e.g., `"3307:3306"`
3. Rebuild the container

### VS Code Extensions Not Installed

Manually install them:

- `vscjava.vscode-lombok`
- `vscjava.vscode-java-pack`
- `vmware.vscode-boot-dev-pack`

Search for these in the Extensions panel (`Cmd+Shift+X`).

---

## Project Documentation

Detailed technical documentation is available in the [`doc/`](doc/) folder:

- **[`doc/Backend-doc.md`](doc/Backend-doc.md)** — Arquitectura, flujo de peticiones, API endpoints, base de datos, pool de conexiones y guía para desarrolladores.

## Need Help?

Contact the DevOps team or open an issue in the repository. Happy coding! 🚀
