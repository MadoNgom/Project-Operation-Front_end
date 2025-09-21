import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Register } from '../register/register';
import { Auth } from '../../services/auth/auth';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [Register, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  // Signal to toggle between login
  islogin = signal(false);

  toggleForm() {
    this.islogin.set(!this.islogin());
  }
  protected _form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    if (this._form.valid) {
      const prepare = {
        email: this._form.getRawValue().email,
        password: this._form.getRawValue().password,
      };
      this.auth.login(prepare).subscribe({
        next: (response) => {
          // Handle successful login
          console.log('connecté', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          // Handle login error
          console.error('Login failed', error);
        },
      });
    }
  }
}
