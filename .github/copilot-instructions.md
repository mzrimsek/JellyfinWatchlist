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
  interactions (unified service and module testing in single file)
- **E2E Tests**: `test/` directory with full HTTP testing via supertest
- **Test Utilities**: `src/test-utils/` contains centralized test configuration:
  - `WatchlistItemFactory` for test fixtures
  - `IntegrationTestHelpers.clearDatabase()` for cleanup
  - `getTestDatabaseConfig()` for in-memory SQLite configuration
  - `setupTestEnvironment()` for unified environment variable setup
  - `index.ts` exports all test utilities for easy importing
- **Coverage**: Achieves 75%+ overall coverage with 100% on core business logic

### Test Database Pattern

```typescript
// Always use test helpers for cleanup
afterEach(async () => {
  await IntegrationTestHelpers.clearDatabase(module);
});
```

### Test Environment Configuration (API)

- **Centralized Setup**: All test types use unified environment configuration
  from `src/test-utils/test-environment.config.ts`
- **Environment Variables**: Tests require `CONFIG_PATH` and `JELLYFIN_INSTANCE`
  to be set for NestJS configuration validation
- **Automatic Setup**: E2E tests automatically configure environment through
  `test/jest-setup.ts`
- **Usage Pattern**: Import and call `setupTestEnvironment()` at the top of test
  files

```typescript
// Unified test environment setup
import { setupTestEnvironment } from '../src/test-utils';

// Sets CONFIG_PATH='./test-config' and JELLYFIN_INSTANCE='http://localhost:8096'
setupTestEnvironment();
```

- **Test Module Types**:
  - **Unit/Integration**: Use `getTestDatabaseConfig()` for in-memory SQLite
  - **E2E Tests**: Use `TestAppModule` instead of production `AppModule` for
    proper in-memory database configuration

### Test Organization (Web)

- **Testing Library**: Uses `@ngneat/spectator@^20.0.0` for component and
  service testing ONLY (compatible with Angular 19)
- **Component Tests**: `*.spec.ts` using Spectator's `createComponentFactory`
- **Service Tests**: `*.spec.ts` using Spectator's `createServiceFactory`
- **NgRx Tests**: Use standard Angular testing utilities for reducers and
  effects
- **Integration Tests**: Use Spectator for component-level feature workflows
- **Test Plan**: Comprehensive plan in `TEST_PLAN.md` with 284 passing tests
- **Coverage Achievement**: 100% test success rate with complete NgRx testing

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

### NgRx Testing Patterns (Web)

```typescript
// Reducer testing with standard Angular testing
describe('AuthReducer', () => {
  const initialState: State = { isAuthenticated: false, loading: false };

  it('should handle login action', () => {
    const action = AuthActions.login({ username: 'test', password: 'test' });
    const result = authReducer(initialState, action);

    expect(result).toEqual({ isAuthenticated: false, loading: true });
    expect(result).not.toBe(initialState); // State immutability check
  });
});

// Effects testing with mock services
describe('LoginEffects', () => {
  let effects: LoginEffects;
  let service: jasmine.SpyObj<JellyfinService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('JellyfinService', ['login']);
    TestBed.configureTestingModule({
      providers: [
        LoginEffects,
        provideMockActions(() => actions$),
        { provide: JellyfinService, useValue: spy },
      ],
    });
    effects = TestBed.inject(LoginEffects);
    service = TestBed.inject(
      JellyfinService,
    ) as jasmine.SpyObj<JellyfinService>;
  });

  it('should handle successful login', () => {
    service.login.and.returnValue(of(mockResponse));
    const action = AuthActions.login({ username: 'test', password: 'test' });
    actions$ = of(action);

    effects.login$.subscribe((result) => {
      expect(result).toEqual(AuthActions.loginSucceeded());
    });
  });
});

// EntityAdapter testing for complex state management
describe('WatchlistReducer with EntityAdapter', () => {
  it('should maintain alphabetical sorting when adding items', () => {
    let state = adapter.addOne(mockItem1, initialState); // 'B Movie'
    state = adapter.addOne(mockItem2, initialState); // 'A Movie'

    expect(state.ids).toEqual(['movie-a', 'movie-b']); // Sorted by name
    expect(adapter.getSelectors().selectAll(state)[0].name).toBe('A Movie');
  });
});
```

### Testing Best Practices (Web)

- **State Immutability**: All reducer tests verify `result !== initialState`
- **EntityAdapter Testing**: Comprehensive testing of sorting, CRUD operations,
  and large datasets
- **Effects Testing**: Mock service dependencies with realistic success/error
  scenarios
- **Type Safety**: Full TypeScript integration with Jellyfin SDK types and
  strict type checking
- **Edge Cases**: Test duplicate handling, rapid state changes, and boundary
  conditions
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
- **Jasmine Matcher Compatibility**: Use `.length` property instead of
  `.toHaveLength()` matcher. Jasmine doesn't include Jest's `.toHaveLength()`
  matcher, so use standard JavaScript `.length` property for array length
  assertions.

```typescript
// ✅ Correct import for Karma/Jasmine setup
import {
  createComponentFactory,
  Spectator,
  mockProvider,
} from '@ngneat/spectator';

// ❌ Avoid this - causes Jest module resolution errors in Karma
import { mockProvider } from '@ngneat/spectator/jest';

// ✅ Correct Jasmine array length assertion
expect(items.length).toBe(2);

// ❌ Avoid this - Jest matcher not available in Jasmine
expect(items).toHaveLength(2);
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

- **API**: Complete with comprehensive test suite (66 tests: 44
  unit/integration + 22 E2E, all passing)
- **Web**: Core functionality implemented with complete testing framework
- **Testing Achievement**: 341 passing tests (100% success rate)
- **Testing Coverage**:
  - ✅ **Components**: 80+ tests across 10 components using Spectator
  - ✅ **Services**: 22 tests (4 JellyfinService SDK integration + 18
    WatchlistService HTTP testing)
  - ✅ **NgRx Reducers**: 108+ tests across 5 reducers with state immutability
    verification
  - ✅ **NgRx Effects**: 97+ tests across 6 effects with comprehensive service
    mocking
  - ✅ **Guards**: 1 test for AuthGuard with basic functionality
- **Architecture**: Full NgRx state management with effects, selectors, and
  comprehensive testing
- **Test Patterns**: Established robust patterns for EntityAdapter, async
  effects, and type-safe mocking

## Integration Points

- **Jellyfin SDK**: Web project authenticates and searches via official SDK
- **Custom API**: Handles watchlist persistence independent of Jellyfin
- **TypeORM**: Automatic migration execution on API startup
- **User Context**: Jellyfin user ID passed through all API operations for data
  isolation
