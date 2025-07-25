# 📺 JellyfinWatchlist

> Track the shows and movies you want to watch without having to pollute your
> Jellyfin favorites!

## 🚀 Project Status

[![Full Stack CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/full-stack-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/full-stack-ci.yml)
[![API CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/api-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/api-ci.yml)
[![Web CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/web-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/web-ci.yml)
[![Workflow Validation](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/workflow-validation.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/workflow-validation.yml)

## 🚀 Quick Start

### Option 1: Docker (Recommended for Production)

The easiest way to deploy JellyfinWatchlist is using Docker with runtime
configuration.

#### Docker Compose Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mzrimsek/JellyfinWatchlist.git
   cd JellyfinWatchlist
   ```

2. **Create environment configuration**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**:
   ```bash
   docker-compose up -d
   ```

**To test the Docker build manually:**

1. **Build the image** (requires Docker running):

   ```bash
   docker build -t jellyfin-watchlist .
   ```

2. **Run with custom environment**:

   ```bash
   docker run -p 3000:3000 \
     -e JELLYFIN_BASE_URL=http://your-jellyfin-server:8096 \
     jellyfin-watchlist
   ```

3. **Run with persistent data (recommended)**:

   ```bash
   # Create a local directory for data persistence
   mkdir -p ./data

   docker run -p 3000:3000 \
     -e JELLYFIN_BASE_URL=http://your-jellyfin-server:8096 \
     -v ./data:/app/config \
     jellyfin-watchlist
   ```

**Note:** If Docker is not available, you can run locally using the development
setup below.

The application will be available at `http://localhost:3000`

#### Environment Variables

| Variable            | Description                                 | Default                 | Required |
| ------------------- | ------------------------------------------- | ----------------------- | -------- |
| `JELLYFIN_BASE_URL` | Your Jellyfin server URL                    | `http://localhost:8096` | ✅       |
| `CONFIG_PATH`       | Config directory path (for volume mounting) | `/app/config`           | Optional |
| `PORT`              | API server port                             | `3000`                  | Optional |
| `HOST`              | API server host                             | `localhost`             | Optional |
| `HTTPS`             | Enable HTTPS protocol                       | `false`                 | Optional |

**Note:** `NODE_ENV` is automatically set to `production` in the Docker
container. The watchlist API URL is dynamically generated based on the server's
actual configuration (`PORT`, `HOST`, `HTTPS`).

#### Data Persistence

The SQLite database and configuration files are stored in the `CONFIG_PATH`
directory (`/app/config` by default). **Volume mounting is recommended** for
data persistence:

```bash
# Docker Compose (recommended)
volumes:
  - ./config:/app/config

# Direct Docker run
-v /host/path/to/data:/app/config
```

#### Example Production Configuration

```bash
# .env file
JELLYFIN_BASE_URL=https://jellyfin.yourdomain.com
```

#### Advanced Configuration Examples

```bash
# Custom port and host
PORT=8080
HOST=0.0.0.0
JELLYFIN_BASE_URL=https://jellyfin.yourdomain.com

# HTTPS enabled with custom domain
HTTPS=true
HOST=api.yourdomain.com
PORT=443
JELLYFIN_BASE_URL=https://jellyfin.yourdomain.com
```

The API will automatically generate the correct `watchlist.baseUrl` in the
runtime configuration based on these settings.

### Option 2: Development Setup

### Prerequisites

- **Node.js** 22.x or newer
- **npm** (latest version)
- **Jellyfin Server** (accessible via network)

### 1. Clone the Repository

```bash
git clone https://github.com/mzrimsek/JellyfinWatchlist.git
cd JellyfinWatchlist
```

### 2. Open in VS Code

This project includes a VS Code workspace configuration for optimal development
experience:

```bash
# Open the workspace in VS Code
code jellyfin-watchlist.code-workspace
```

### 3. Quick Development Setup

For unified development of both projects:

```bash
# Install dependencies for both projects
npm install

# Start both API and Web in development mode
npm run dev
```

This will start:

- **API Server**: http://localhost:3000 (with hot reload)
- **Web Application**: http://localhost:4200 (with hot reload)

### 4. Individual Project Setup

#### Setup API Server

```bash
cd JellyfinWatchlist.Api
npm install

# Configure environment
touch .env
# Edit .env with your Jellyfin server details

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:3000`

#### Setup Web Application

```bash
cd ../JellyfinWatchlist.Web
npm install

# Configure environment
# Edit src/environments/environment.development.ts

# Start development server
ng serve
```

The web application will be available at `http://localhost:4200`

## 🛠️ Development

### **API Development**

```bash
cd JellyfinWatchlist.Api

# Development server with hot reload
npm run start:dev

# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Generate test coverage
npm run test:cov

# Linting and formatting
npm run lint
npm run format
```

### **Web Development**

```bash
cd JellyfinWatchlist.Web

# Development server
ng serve

# Run all tests (284 tests)
ng test

# Run tests with coverage
ng test --code-coverage

# Build for production
ng build

# Code formatting
npm run format
```

## 🔧 Configuration

### **API Configuration** (`.env`)

```bash
# Jellyfin Server Configuration
JELLYFIN_INSTANCE=http://your-jellyfin-server:8096

# Database Configuration
CONFIG_PATH=./config

# Optional: Development settings
NODE_ENV=development
PORT=3000
```

### **Web Configuration** (`src/environments/`)

```typescript
export const environment = {
  production: false,
  jellyfinBaseUrl: 'http://your-jellyfin-server:8096',
  apiBaseUrl: 'http://localhost:3000',
};
```

## 🚀 Deployment

### **Production Build**

```bash
# Build API
cd JellyfinWatchlist.Api
npm run build
npm run start:prod

# Build Web
cd JellyfinWatchlist.Web
ng build --configuration=production
```

### **Docker Support** ✅

- ✅ Multi-stage Docker builds for optimized production images
- ✅ Docker Compose setup for easy deployment
- ✅ Runtime environment-based configuration management
- ✅ Static file serving with production optimizations

## 🏗️ Architecture

### **Frontend**: Angular 19 + NgRx + Angular Material

- Modern standalone components architecture
- Comprehensive state management with NgRx
- Reactive forms with custom validation

### **Backend**: NestJS + TypeORM + SQLite

- RESTful API with OpenAPI documentation
- Database migrations and entity management
- Health monitoring and performance optimization

### **Integration**: Jellyfin SDK

- Direct integration with Jellyfin servers
- Secure authentication and user management
- Real-time media metadata synchronization

### **CI/CD Pipeline**

- ✅ **Automated Testing**: All tests run on every PR
- ✅ **Code Quality**: Linting, formatting, and security audits
- ✅ **Multi-Environment**: Development and production builds
- ✅ **Performance Monitoring**: Load testing and benchmarking
- ✅ **Security**: Dependency vulnerability scanning

## 📚 Documentation

### **Project Documentation**

- [API Test Plan](./JellyfinWatchlist.Api/TEST_PLAN.md) - Comprehensive API
  testing strategy
- [Web Test Plan](./JellyfinWatchlist.Web/TEST_PLAN.md) - Angular testing
  methodology
- [GitHub Actions Workflows](./.github/workflows/README.md) - CI/CD pipeline
  documentation

### **API Documentation**

- OpenAPI/Swagger documentation available at `/api` when running the API server
- RESTful endpoints with comprehensive request/response examples
- Error handling and status code documentation

## Copilot Usage

Copilot was used to assist with writing the code in this project, but mostly
used in test generation and documentation. The core logic and architecture was
designed by me (so I get to claim all the shitty parts of it as my own) though
the actual snippets of code to implement the logic I fleshed out was also
assisted by Copilot. There are some files in the project that are specifically
generated by copilot for the LLM to use to assist it in providing more
contexually relevant responses. This was and continutes to be an interesting
experiment in where LLMs should be used and how they are can assist in
development.
