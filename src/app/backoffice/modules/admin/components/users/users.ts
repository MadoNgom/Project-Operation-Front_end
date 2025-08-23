import { Component } from '@angular/core';
import { Sidebar } from '../../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-users',
  imports: [Sidebar],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {}
