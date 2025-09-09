import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Main } from './tab/main/main';
import { Player } from './tab/player/player';
import { Resource } from './tab/resource/resource';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Aitest } from './tab/aitest/aitest';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Main, Player,Resource, FormsModule, CommonModule, Aitest],
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
