# Copilot Instructions for JellyfinWatchlist

## Project Overview

Full-stack application for managing Jellyfin media server watchlists with
**NestJS API** (`JellyfinWatchlist.Api/`) and **Angular Web**
(`JellyfinWatchlist.Web/`) frontends.

## Key Architecture Patterns

### API Project (NestJS + TypeORM + SQLite)

- **Module Structure**: Standard NestJS modules in `src/` - each feature has
  `.module.ts`, `.controller.ts`, `.service.ts`
- **Database**: SQLite with TypeORM, uses migrations (`src/migrations/`) with
  auto-run on startup
- **Entities**: Single `WatchlistItem` entity with Jellyfin user isolation via
  `jellyfinUserId` field
- **Configuration**: Joi validation for required env vars `JELLYFIN_INSTANCE`,
  `CONFIG_PATH`

### Web Project (Angular + NgRx)

- **State Management**: NgRx with feature-based reducers (`src/app/reducers/`)
  and effects (`src/app/effects/`)
- **Jellyfin Integration**: Uses `@jellyfin/sdk` for direct Jellyfin API calls
  in `JellyfinService`
- **Routing**: Standalone components with provideRouter, no NgModules

## Essential Development Commands

### API Development

```bash
cd JellyfinWatchlist.Api
npm run start:dev              # Hot reload with webpack HMR
npm run test                   # Unit + integration tests
npm run test:e2e              # E2E tests with supertest
npm run migration:generate    # Create new TypeORM migrations
```

### Web Development

```bash
cd JellyfinWatchlist.Web
ng serve                      # Dev server on :4200
ng test                       # Karma unit tests with Spectator
ng test --watch=false         # Single run tests
ng test --code-coverage       # Test coverage report
```

### Formatting & Code Quality

```bash
# Both projects use Prettier for consistent formatting
npm run format               # Format code
npm run format:check         # Check formatting
npm run lint                 # ESLint (API only)
```

## Critical Testing Conventions

### Test Organization (API)

- **Unit Tests**: `*.spec.ts` alongside source files
- **Integration Tests**: `*.integration.spec.ts` test database + module
  interactions
- **E2E Tests**: `test/` directory with full HTTP testing via supertest
- **Test Utilities**: `src/test-utils/` contains `WatchlistItemFactory` for
  fixtures and `IntegrationTestHelpers.clearDatabase()`
- **Coverage**: Achieves 75%+ overall coverage with 100% on core business logic

### Test Database Pattern

```typescript
// Always use test helpers for cleanup
afterEach(async () => {
  await IntegrationTestHelpers.clearDatabase(module);
});
```

### Test Organization (Web)

- **Testing Library**: Uses `@ngneat/spectator@^20.0.0` for component and
  service testing ONLY (compatible with Angular 19)
- **Component Tests**: `*.spec.ts` using Spectator's `createComponentFactory`
- **Service Tests**: `*.spec.ts` using Spectator's `createServiceFactory`
- **NgRx Tests**: Use standard Angular testing utilities for reducers and
  effects
- **Integration Tests**: Use Spectator for component-level feature workflows
- **Test Plan**: Comprehensive plan in `TEST_PLAN.md` with 200+ test scenarios

### Spectator Testing Pattern

```typescript
// Component testing with Spectator
const createComponent = createComponentFactory({
  component: LoginComponent,
  imports: [ReactiveFormsModule],
  providers: [
    mockProvider(Store, {
      select: jasmine.createSpy('select').and.returnValue(of('mockData')),
      dispatch: jasmine.createSpy('dispatch'),
    }),
  ],
  detectChanges: false, // Manual control for better test setup
  shallow: true, // Use for components with complex child components
});

// Service testing with Spectator
const createService = createServiceFactory({
  service: JellyfinService,
  providers: [
    /* mock providers for dependencies */
  ],
});
```

### Testing Best Practices (Web)

- **Spectator Setup**: Always use `detectChanges: false` for manual control
- **Mock Child Components**: Use `shallow: true` or `mocks: [ChildComponent]` to
  isolate component under test
- **Store Mocking**: Use `mockProvider(Store)` with jasmine spies for NgRx
- **Input Properties**: Use `spectator.setInput()` or component props to set
  inputs
- **Material Components**: Import `NoopAnimationsModule` to avoid timing issues
- **Complex SDK Mocking**: For Jellyfin SDK, focus on testable methods like URL
  generation rather than complex async operations
- **Spectator Import Fix**: ALWAYS import from `@ngneat/spectator` only (not
  `@ngneat/spectator/jest`) to avoid Jest/Karma compatibility issues. The
  project uses Karma with Jasmine, not Jest, so jest-specific imports will cause
  module resolution errors.

```typescript
// ✅ Correct import for Karma/Jasmine setup
import {
  createComponentFactory,
  Spectator,
  mockProvider,
} from '@ngneat/spectator';

// ❌ Avoid this - causes Jest module resolution errors in Karma
import { mockProvider } from '@ngneat/spectator/jest';
```

## Project-Specific Patterns

### Data Flow

1. **Angular Frontend** → Jellyfin SDK → Jellyfin Server (authentication, media
   search)
2. **Angular Frontend** → Custom API → SQLite (watchlist persistence)
3. **User Isolation**: All watchlist operations scoped by `jellyfinUserId`
   parameter

### Entity Conventions

- **WatchlistItem**: Uses Jellyfin's `id` as primary key, stores
  `jellyfinUserId` for isolation
- **AddWatchlistItem**: DTO model without `jellyfinUserId` and `addedOn` (added
  by controller)

### API Controller Pattern

```typescript
@Controller('watchlist')
export class WatchlistController {
  @Get(':userId')           // Get user's watchlist
  @Post(':userId')          // Add item to user's watchlist
  @Delete(':userId/:itemId') // Remove item from user's watchlist
}
```

### NgRx State Structure

- **Feature States**: `auth`, `currentUser`, `systemInfo`, `search`, `watchlist`
- **Selectors**: Exported from reducer files, re-exported from
  `reducers/index.ts`
- **Effects**: Handle async operations, one effect class per feature
- **Testing**: Use standard Angular testing for reducers/effects, Spectator for
  components using store

### Component Architecture

- **Standalone Components**: No NgModules, using Angular's standalone approach
- **Smart/Dumb Pattern**: Page components dispatch actions, shared components
  receive inputs
- **Form Components**: Reactive forms with custom form controls
- **Material Design**: Uses Angular Material for UI components

## Environment & Configuration

- **API**: Requires `.env` with `JELLYFIN_INSTANCE` and `CONFIG_PATH`
- **Web**: Environment files in `src/environments/` with Jellyfin base URL
  configuration
- **Database**: SQLite file location determined by `CONFIG_PATH` env var
- **Code Quality**: Prettier configuration in `.prettierrc` with
  project-specific overrides

## Development Status

- **API**: Complete with comprehensive test suite (75 tests passing)
- **Web**: Core functionality implemented, testing framework established
- **Testing Progress**:
  - ✅ LoginComponent (9 tests) - Complete with form validation, action dispatch
  - ✅ LoginFormComponent (17 tests) - Complete with template integration
  - ✅ ReactiveInputComponent (10 tests) - Complete with accessibility
  - ✅ JellyfinService (4 tests) - Basic tests for URL generation and
    initialization
- **Architecture**: Full NgRx state management with effects and selectors

## Integration Points

- **Jellyfin SDK**: Web project authenticates and searches via official SDK
- **Custom API**: Handles watchlist persistence independent of Jellyfin
- **TypeORM**: Automatic migration execution on API startup
- **User Context**: Jellyfin user ID passed through all API operations for data
  isolation
