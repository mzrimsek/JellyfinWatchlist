# 📺 JellyfinWatchlist

> Track the shows and movies you want to watch without having to pollute your
> Jellyfin favorites!

## 🚀 Project Status

[![Full Stack CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/full-stack-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/full-stack-ci.yml)
[![API CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/api-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/api-ci.yml)
[![Web CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/web-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/web-ci.yml)
[![Workflow Validation](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/workflow-validation.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/workflow-validation.yml)

## 🚀 Quick Start

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

### **Docker Support** (Coming Soon)

- Multi-stage Docker builds for optimized production images
- Docker Compose setup for easy deployment
- Environment-based configuration management

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
