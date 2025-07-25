import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './services/config.service';
import { CommonModule } from '@angular/common';
import { ConfigLoadingComponent } from './shared/components/config-loading/config-loading.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ConfigLoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private configService = inject(ConfigService);

  /**
   * Observable that tracks configuration loading state
   */
  configState$ = this.configService.state$;
}
