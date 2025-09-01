import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Nav } from '../nav/nav';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../authentification/services/auth/auth';

@Component({
  selector: 'app-home-page',
  imports: [Nav, RouterLink],
  standalone: true,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    // Si l'utilisateur est connecté, le rediriger vers le dashboard
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
