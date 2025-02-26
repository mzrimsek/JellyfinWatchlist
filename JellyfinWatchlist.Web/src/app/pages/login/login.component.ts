import * as jellyfinActions from '../../actions/jellyfin.actions';

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { selectJellyfinServerName } from '../../reducers';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormComponent,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | undefined;
  instanceName$: Observable<string> | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.instanceName$ = this.store.select(selectJellyfinServerName);
  }

  async login(): Promise<void> {
    this.store.dispatch(
      jellyfinActions.login({
        username: this.loginForm?.value.username,
        password: this.loginForm?.value.password,
      })
    );

    // move this to the effect handler
    // we need a special on init handler to dispatch the system info load action
    // if (!succeeded) {
    //   this.snackbar.open('Login failed', 'Dismiss', {
    //     duration: 3000,
    //   });
    // } else {
    //   this.router.navigate(['/']);
    // }
  }

  getInstanceUrl(): string {
    return environment.jellyfin.baseUrl;
  }
}
