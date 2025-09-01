import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Main } from './tab/main/main';
import { Player } from './tab/player/player';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Main, Player],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TinyRealm_angual');

  constructor(private router: Router) {}

  onTabClick(tab: string): void {
    this.router.navigate([`/${tab}`]);
  }
}
