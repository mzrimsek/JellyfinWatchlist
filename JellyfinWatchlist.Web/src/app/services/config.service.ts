import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppConfig, ConfigState } from '../config/app-config.interface';
import { environment } from '../../environments/environment';

/**
 * Runtime Configuration Service
 *
 * Loads application configuration at runtime from the API server,
 * falling back to compile-time environment configuration if needed.
 *
 * This enables Docker deployment with environment variable injection
 * without requiring rebuild of the Angular application.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);

  private configSubject = new BehaviorSubject<AppConfig>(environment);
  private stateSubject = new BehaviorSubject<ConfigState>({
    loaded: false,
    loading: false,
  });

  public config$ = this.configSubject.asObservable();
  public state$ = this.stateSubject.asObservable();

  /**
   * Load configuration from the API server
   * Falls back to compile-time environment if API is unavailable
   */
  async loadConfig(): Promise<void> {
    this.stateSubject.next({ loaded: false, loading: true });

    try {
      console.log('Loading runtime configuration...');

      // Attempt to load from API
      const runtimeConfig = await firstValueFrom(this.http.get<AppConfig>('/api/config'));

      console.log('Runtime configuration loaded successfully:', runtimeConfig);

      this.configSubject.next(runtimeConfig);
      this.stateSubject.next({ loaded: true, loading: false });
    } catch (error) {
      console.warn('Failed to load runtime configuration, using compile-time fallback:', error);

      // Fallback to compile-time environment
      this.configSubject.next(environment);
      this.stateSubject.next({
        loaded: true,
        loading: false,
        error: 'Failed to load runtime config, using fallback',
      });
    }
  }

  /**
   * Get current configuration synchronously
   */
  get config(): AppConfig {
    return this.configSubject.value;
  }

  /**
   * Get specific configuration values with type safety
   */
  get jellyfinBaseUrl(): string {
    return this.config.jellyfin?.baseUrl || '';
  }

  get watchlistBaseUrl(): string {
    return this.config.watchlist?.baseUrl || '';
  }

  get isProduction(): boolean {
    return this.config.production || false;
  }

  /**
   * Check if configuration has been loaded
   */
  get isLoaded(): boolean {
    return this.stateSubject.value.loaded;
  }

  /**
   * Check if configuration is currently loading
   */
  get isLoading(): boolean {
    return this.stateSubject.value.loading;
  }

  /**
   * Get any loading error message
   */
  get loadError(): string | undefined {
    return this.stateSubject.value.error;
  }
}
