import { AuthActions } from '../../../actions/auth.actions';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shared-header',
  imports: [MatToolbarModule, MatButtonModule, RouterModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private store = inject(Store);

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
