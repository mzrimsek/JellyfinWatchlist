# 📺 JellyfinWatchlist

> A comprehensive full-stack application for managing Jellyfin media server.

## 🚀 Project Status

[![Full Stack CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/full-stack-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/full-stack-ci.yml)
[![API CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/api-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/api-ci.yml)
[![Web CI](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/web-ci.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/web-ci.yml)
[![Workflow Validation](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/workflow-validation.yml/badge.svg)](https://github.com/mzrimsek/JellyfinWatchlist/actions/workflows/workflow-validation.yml)

## 📖 Overview

JellyfinWatchlist is a modern full-stack application that provides an enhanced
watchlist management experience for Jellyfin media servers. Copilot may have
helped a bit :)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or 22.x
- **npm** (latest version)
- **Jellyfin Server** (accessible via network)

### 1. Clone the Repository

```bash
git clone https://github.com/mzrimsek/JellyfinWatchlist.git
cd JellyfinWatchlist
```

### 2. Setup API Server

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

### 3. Setup Web Application

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
- [Branch Protection Setup](./.github/BRANCH_PROTECTION.md) - Repository
  security configuration

### **API Documentation**

- OpenAPI/Swagger documentation available at `/api` when running the API server
- RESTful endpoints with comprehensive request/response examples
- Error handling and status code documentation

### **Architecture Documentation**

- NgRx state management patterns and best practices
- TypeORM entity relationships and migration strategies
- Jellyfin SDK integration patterns and authentication flows
