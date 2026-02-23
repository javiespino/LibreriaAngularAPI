import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  showPassword = false;
  error   = signal(false);
  loading = signal(false);

  login() {
    const { username, password } = this.loginForm.value;
    this.error.set(false);
    this.loading.set(true);

    this.auth.login(username!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/books']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  enterAsGuest() {
    this.router.navigate(['/books']);
  }

  registerUser() {
    this.router.navigate(['/register']);
  }
}