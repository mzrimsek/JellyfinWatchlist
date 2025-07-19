# GitHub Actions Workflows

This directory contains CI/CD workflows for the JellyfinWatchlist project.

## Workflows Overview

### 🔧 `api-ci.yml`

- **Triggers**: PRs and pushes to main/develop affecting API code
- **Purpose**: Test and build the NestJS API
- **Features**:
  - Tests on Node.js 20.x and 22.x
  - Linting and formatting checks
  - Unit tests and E2E tests
  - Production build verification
  - Test result artifacts

### 🌐 `web-ci.yml`

- **Triggers**: PRs and pushes to main/develop affecting Web code
- **Purpose**: Test and build the Angular Web application
- **Features**:
  - Tests on Node.js 20.x and 22.x
  - Comprehensive test suite (284 tests)
  - Code coverage reporting
  - Development and production builds
  - Formatting checks

### 🔄 `full-stack-ci.yml`

- **Triggers**: PRs and pushes to main/develop
- **Purpose**: Overall project health and integration testing
- **Features**:
  - Change detection (only runs relevant checks)
  - Security audits for both projects
  - Integration testing between API and Web
  - Overall status reporting

### ✅ `workflow-validation.yml`

- **Triggers**: Changes to workflow files
- **Purpose**: Validate workflow syntax and best practices
- **Features**:
  - YAML syntax validation
  - Deprecated action detection
  - Node.js version matrix validation

## Workflow Features

### 🎯 **Smart Triggering**

- Path-based filtering to only run relevant tests
- Change detection to optimize CI runtime
- Matrix builds for multiple Node.js versions

### 📊 **Comprehensive Testing**

- **API**: 75+ tests (unit + integration + E2E)
- **Web**: 284 tests (100% success rate)
- **Coverage**: Test coverage reporting with artifacts

### 🛡️ **Quality Gates**

- Code formatting validation
- Linting and static analysis
- Security audits
- Build verification

### 📦 **Artifact Management**

- Test results and coverage reports
- Build artifacts for deployment
- 7-day retention for debugging

## Local Development

To run the same checks locally:

### API Project

```bash
cd JellyfinWatchlist.Api
npm ci
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build
```

### Web Project

```bash
cd JellyfinWatchlist.Web
npm ci
npm run format:check
npm run test -- --watch=false --browsers=ChromeHeadless
npm run build
```

## PR Requirements

For a PR to be merged, all workflows must pass:

- ✅ All tests passing (API + Web)
- ✅ Code formatting compliant
- ✅ No linting errors
- ✅ Successful builds
- ✅ Security audit clean
- ✅ Integration tests passing

## Monitoring

- **Status badges** can be added to README
- **Artifacts** are retained for 7 days for debugging
- **Coverage reports** help track test quality
- **Security audits** alert to vulnerabilities

## Customization

The workflows use:

- **Node.js**: 20.x (primary), 22.x (compatibility)
- **OS**: Ubuntu Latest (Linux)
- **Browsers**: Chrome Headless (for Angular tests)
- **Cache**: npm cache for faster builds

Adjust node versions, add additional operating systems, or modify test commands
as needed for your specific requirements.
