import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Nav } from '../nav/nav';

@Component({
  selector: 'app-home-page',
  imports: [Nav],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
