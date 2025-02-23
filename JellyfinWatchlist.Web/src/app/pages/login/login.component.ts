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
import { JellyfinService } from '../../services/jellyfin.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

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
  instanceName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private jellyfinService: JellyfinService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.jellyfinService.getSystemInfo().then((systemInfo) => {
      this.instanceName = systemInfo.ServerName ?? this.getInstanceUrl();
    });
  }

  async login(): Promise<void> {
    const succeeded = await this.jellyfinService.login(
      this.loginForm?.value.username,
      this.loginForm?.value.password
    );
    if (!succeeded) {
      this.snackbar.open('Login failed', 'Dismiss', {
        duration: 3000,
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  getInstanceUrl(): string {
    return environment.jellyfin.baseUrl;
  }
}
