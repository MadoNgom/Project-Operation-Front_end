import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Register } from '../register/register';

@Component({
  selector: 'app-login',
  imports: [Register],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isRegister = signal(false);

  toggleForm() {
    this.isRegister.set(!this.isRegister());
  }
}
