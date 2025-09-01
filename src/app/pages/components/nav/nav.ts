import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../authentification/services/auth/auth';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  private router = inject(Router);
  private auth = inject(Auth);

  isAuthenticated = false;
  userInfo: any;

  ngOnInit() {
    this.isAuthenticated = this.auth.isAuthenticated();
    if (this.isAuthenticated) {
      this.userInfo = this.auth.getUserInfo();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.auth.logout();
  }
}
