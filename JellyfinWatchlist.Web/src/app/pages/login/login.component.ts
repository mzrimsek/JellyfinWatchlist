import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { JellyfinService } from '../../services/jellyfin.service';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private jellyfinService: JellyfinService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
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
}
