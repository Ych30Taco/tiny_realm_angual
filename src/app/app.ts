import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Main } from './tab/main/main';
import { Player } from './tab/player/player';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Main, Player, FormsModule, CommonModule],
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
