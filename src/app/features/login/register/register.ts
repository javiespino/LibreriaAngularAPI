import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private title  = inject(Title);

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showPassword = false;
  error   = signal('');
  loading = signal(false);
  success = signal(false);

  ngOnInit() {
    this.title.setTitle('Librería de Javier - Registro');
  }

  register() {
    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.value;
    this.error.set('');
    this.loading.set(true);

    this.auth.register(username!, email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/books']), 1500);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.error.set('El usuario o email ya existe.');
        } else {
          this.error.set('Error al registrarse. Inténtalo de nuevo.');
        }
      }
    });
  }

  enterAsGuest() {
    this.router.navigate(['/books']);
  }
}