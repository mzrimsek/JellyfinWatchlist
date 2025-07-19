import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthActions } from '../../actions/auth.actions';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { selectJellyfinServerName } from '../../reducers';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormComponent, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | undefined;
  instanceName$: Observable<string> | undefined;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.instanceName$ = this.store.select(selectJellyfinServerName);
  }

  login(): void {
    this.store.dispatch(
      AuthActions.login({
        username: this.loginForm?.value.username,
        password: this.loginForm?.value.password,
      }),
    );
  }

  getInstanceUrl(): string {
    return environment.jellyfin.baseUrl;
  }
}
