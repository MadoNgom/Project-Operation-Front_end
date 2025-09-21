import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Nav } from '../nav/nav';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../authentification/services/auth/auth';

@Component({
  selector: 'app-home-page',
  imports: [Nav],
  standalone: true,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  constructor(private auth: Auth, private router: Router) {}

  loading = false;

  ngOnInit() {
    // Si l'utilisateur est connecté, le rediriger vers le dashboard
    this.loading = true;
    if (this.auth.isAuthenticated()) {
      if (this.auth.checkUserRole('ADMIN')) {
        console.log('admin');
        this.loading = false;
        this.router.navigateByUrl('/backoffice');
      } else {
        console.log('user');
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      }
      this.loading = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
