import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Configuration Loading Component
 *
 * Displays a loading spinner while the application configuration
 * is being loaded from the API server.
 */
@Component({
  selector: 'app-shared-config-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="config-loading-container">
      <div class="config-loading-content">
        <mat-spinner diameter="50"></mat-spinner>
        <h2>Loading Configuration...</h2>
        <p>Please wait while we set up your application</p>
      </div>
    </div>
  `,
  styles: [
    `
      .config-loading-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }

      .config-loading-content {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      h2 {
        margin: 1rem 0 0.5rem 0;
        color: #333;
        font-weight: 500;
      }

      p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class ConfigLoadingComponent {}
