import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);
  protected _form: FormGroup = new FormGroup({
    nom: new FormControl('', [Validators.required]),
    prenom: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telephone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'), // only digits
    ]),

    adresse: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  register() {
    if (this._form.valid) {
      const prepare = {
        nom: this._form.getRawValue().nom,
        prenom: this._form.getRawValue().prenom,
        email: this._form.getRawValue().email,
        telephone: this._form.getRawValue().telephone,
        adresse: this._form.getRawValue().adresse,
        password: this._form.getRawValue().password,
      };
      this.auth.register(prepare).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        },
      });
    }
  }
}
