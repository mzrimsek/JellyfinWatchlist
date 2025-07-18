# Angular Web Project - Test Plan using @ngneat/spectator

## Overview

This test plan covers comprehensive testing of the Angular Web project using
@ngneat/spectator for component and service testing, with standard Angular
testing utilities for NgRx reducers and effects.

## Test Structure

### 1. Component Tests (Using Spectator)

#### **Page Components** (`src/app/pages/`)

- [x] **LoginComponent** ✅ Complete
  - Form validation (username/password required) ✅
  - Login action dispatch on form submission ✅
  - Instance name display from store ✅
  - Error handling scenarios ✅
  - Form state management ✅

- [ ] **HomeComponent**
  - Watchlist display from store
  - User greeting with current user name
  - Empty state when no watchlist items
  - Navigation to search page

- [ ] **SearchComponent**
  - Search form interactions
  - Results display from store
  - Add to watchlist functionality
  - Loading states during search

#### **Shared Components** (`src/app/shared/components/`)

- [ ] **HeaderComponent**
  - User name display
  - Logout functionality
  - Navigation links
  - Responsive behavior

- [ ] **LayoutComponent**
  - Routing outlet functionality
  - Header integration
  - Authentication state handling

- [ ] **MediaItemComponent**
  - Media item display (title, year, image)
  - Add/Remove from watchlist actions
  - Different states (in watchlist vs. not)
  - Media type display

- [x] **ReactiveInputComponent** ✅ Complete
  - Form control integration ✅
  - Validation error display ✅
  - Input types (text, password) ✅
  - Accessibility attributes ✅

#### **Form Components** (`src/app/pages/*/components/form/`)

- [x] **LoginFormComponent** ✅ Complete
  - Form group input handling ✅
  - Submit event emission ✅
  - Loading state display ✅
  - Instance URL/name display ✅
  - Form validation states ✅

- [ ] **SearchFormComponent**
  - Search query input
  - Submit event emission
  - Form validation

- [ ] **ResultsListComponent**
  - Results iteration and display
  - Empty state handling
  - Action button states
  - Performance with large lists

### 2. Service Tests (Using Spectator)

#### **JellyfinService** (`src/app/services/`) ✅ Partially Complete

- [x] **Service Creation** ✅
- [x] **Image URL Generation** ✅
- [x] **SDK Integration** ✅
- [ ] **Authentication Methods** (Complex SDK mocking required)
  - `login()` - success/failure scenarios
  - `logout()` - session cleanup
  - SDK configuration

- [ ] **API Methods** (Complex SDK mocking required)
  - `getSystemInfo()` - system information retrieval
  - `getCurrentUser()` - user data retrieval
  - `search()` - media search functionality
  - Error handling for network failures
  - Observable behavior and operators

### 3. State Management Tests (Standard Angular Testing)

#### **Reducers** (`src/app/reducers/`)

- [ ] **AuthReducer**
  - `login` action - loading state
  - `loginSucceeded` - authenticated state
  - `loginFailed` - error state
  - `logout` - reset state

- [ ] **CurrentUserReducer**
  - `loadCurrentUser` - loading state
  - `loadCurrentUserSucceeded` - user data storage
  - `loadCurrentUserFailed` - error handling

- [ ] **SearchReducer**
  - `search` - loading state
  - `searchSucceeded` - results storage
  - `searchFailed` - error handling
  - `clearSearch` - state reset

- [ ] **WatchlistReducer** (EntityAdapter)
  - `loadWatchlist` - loading state
  - `loadWatchlistSucceeded` - entities population
  - `addToWatchlist` - entity addition
  - `removeFromWatchlist` - entity removal
  - Entity selectors (`selectAll`, `selectEntities`, etc.)

- [ ] **SystemInfoReducer**
  - `loadSystemInfo` - loading state
  - `loadSystemInfoSucceeded` - info storage

#### **Selectors** (`src/app/reducers/index.ts`)

- [ ] **Composite Selectors**
  - `selectJellyfinServerName` - fallback to environment
  - `selectCurrentUserName` - fallback to 'User'
  - `selectCurrentUserId` - fallback to empty string

#### **Effects** (`src/app/effects/`) (Standard Angular Testing)

- [ ] **LoginEffects**
  - `login$` - service call and action dispatch
  - `loginSucceededNavigate$` - routing after success
  - `loginSucceededGetCurrentUser$` - user data loading
  - `loginFailedShowError$` - error message display

- [ ] **CurrentUserEffects**
  - `loadCurrentUser$` - service integration
  - Error handling scenarios

- [ ] **SearchEffects**
  - `search$` - service call and result handling
  - Debouncing and error handling

- [ ] **WatchlistEffects**
  - `loadWatchlist$` - API integration
  - `addToWatchlist$` - API calls
  - `removeFromWatchlist$` - API calls
  - Error handling and optimistic updates

### 4. Guard Tests (Standard Angular Testing)

#### **AuthGuard** (`src/app/guards/`)

- [ ] **Route Protection**
  - Allow access when authenticated
  - Redirect to login when not authenticated
  - Store integration for auth state

### 5. Integration Tests (Using Spectator for Components)

#### **Feature Workflows**

- [ ] **Login Flow**
  - Complete login process
  - State updates across multiple reducers
  - Navigation and user data loading

- [ ] **Search and Add to Watchlist**
  - Search execution
  - Results display
  - Add to watchlist with API integration

- [ ] **Watchlist Management**
  - Load existing watchlist
  - Remove items from watchlist
  - State synchronization

## Testing Utilities

### **Spectator Test Helpers**

- [ ] **MockProviders Setup**
  - Store mocking with initial state
  - Service mocking (JellyfinService)
  - Router and ActivatedRoute mocks

- [ ] **Custom Matchers**
  - NgRx action dispatching assertions
  - Component state assertions
  - Form validation helpers

- [ ] **Test Data Factories**
  - User data factory
  - Media item data factory
  - Search result data factory
  - Store state factory

### **Mock Data**

- [ ] **Jellyfin API Responses**
  - System info mock data
  - User data mock data
  - Search results mock data
  - Error response scenarios

## Implementation Priority

1. **Phase 1**: Service tests (JellyfinService) with Spectator - Foundation ✅
   Started
2. **Phase 2**: Component tests with Spectator (starting with LoginComponent) ✅
   Started
3. **Phase 3**: Reducer tests with standard Angular testing - State management
   verification
4. **Phase 4**: Effects tests with standard Angular testing - Async flow
   verification
5. **Phase 5**: Integration tests with Spectator - End-to-end workflows

## Notes

- Use **Spectator** for: Components and Services only
- Use **Standard Angular Testing** for: Reducers, Effects, Guards, and Pipes
- Mock all external dependencies (Jellyfin SDK, HTTP calls)
- Test both success and error scenarios
- Focus on user interaction patterns and edge cases
- Ensure proper NgRx state testing with mock store
