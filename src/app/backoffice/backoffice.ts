import { Component } from '@angular/core';
import { Sidebar } from './shared/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-backoffice',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './backoffice.html',
  styleUrl: './backoffice.css',
})
export class Backoffice {}
