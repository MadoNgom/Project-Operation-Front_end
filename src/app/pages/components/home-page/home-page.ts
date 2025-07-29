import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Nav } from '../nav/nav';

@Component({
  selector: 'app-home-page',
  imports: [Nav],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
