import { Environment } from '../../environments/type';

/**
 * Application configuration interface
 * Extends the base Environment interface with additional runtime properties
 */
export interface AppConfig extends Environment {
  production?: boolean;
}

/**
 * Configuration loading state
 */
export interface ConfigState {
  loaded: boolean;
  loading: boolean;
  error?: string;
}
