import { Component, OnInit } from '@angular/core';
import { Sidebar } from './shared/sidebar/sidebar';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from '../authentification/services/auth/auth';

@Component({
  selector: 'app-backoffice',
  imports: [RouterOutlet],
  templateUrl: './backoffice.html',
  styleUrl: './backoffice.css',
})
export class Backoffice implements OnInit {
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      if (!this.auth.checkUserRole('ADMIN')) {
        this.router.navigateByUrl('/dashboard');
      }else if(this.auth.checkUserRole('USER')){
        this.router.navigateByUrl('/dashboard');
      }else{
        this.router.navigateByUrl('/');
      }
    }else{
      this.router.navigateByUrl('/');
    }
  }
}
