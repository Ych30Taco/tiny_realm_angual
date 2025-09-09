import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface PlayerInfo {
  id: string;
  name: string;
  status: number;
  incomplete?: boolean;
}

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {
  players: PlayerInfo[] = [];
  playerName: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    forkJoin([
      this.http.get<any>('http://localhost:1026/api/storage/playerList'),
      this.http.get<any>('http://localhost:1026/api/storage/onlinePlayers'),
      this.http.get<any>('http://localhost:1026/api/storage/offlinePlayers'),
      this.http.get<any>('http://localhost:1026/api/storage/allGameStateList')
    ]).subscribe({
      next: ([allPlayersRes, onlinePlayersRes, offlinePlayersRes, allGameStatesRes]) => {
        const allPlayers = (allPlayersRes && allPlayersRes.success && Array.isArray(allPlayersRes.data)) ? allPlayersRes.data : [];
        const onlinePlayers = (onlinePlayersRes && onlinePlayersRes.success && Array.isArray(onlinePlayersRes.data)) ? onlinePlayersRes.data : [];
        const offlinePlayers = (offlinePlayersRes && offlinePlayersRes.success && Array.isArray(offlinePlayersRes.data)) ? offlinePlayersRes.data : [];
        const allGameStates = (allGameStatesRes && allGameStatesRes.success && allGameStatesRes.data) ? allGameStatesRes.data : {};

        this.message = `載入玩家列表...\n所有玩家: ${allPlayers.length}\n上線: ${onlinePlayers.length}\n下線: ${offlinePlayers.length}`;
        this.players = allPlayers.map((id: string) => {
          const state = allGameStates[id];
          if (!state || !state.player) {
            return { id, name: `玩家 ${id}`, status: 0, incomplete: true };
          }
          return {
            id,
            name: state.player.name || `玩家 ${id}`,
            status: typeof state.player.status === 'number' ? state.player.status : 0,
            incomplete: false
          };
        });
      },
      error: (error) => {
        this.message = `錯誤：${error.message}`;
        this.players = [];
      }
    });
  }

  createPlayer() {
    if (!this.playerName.trim()) {
      this.message = '請輸入玩家名稱';
      return;
    }
    this.http.post<any>('http://localhost:1026/api/player/create', { name: this.playerName.trim() }).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = `玩家 ${this.playerName} 創建成功`;
          this.playerName = '';
          this.loadPlayers();
        } else {
          this.message = `創建失敗: ${res.message}`;
        }
      },
      error: (error) => {
        this.message = `錯誤：${error.message}`;
      }
    });
  }

  setPlayerOnline(id: string) {
    this.http.post<any>('http://localhost:1026/api/player/login', { playerId: id }).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = `玩家 ${id} 已上線`;
          this.loadPlayers();
        } else {
          this.message = `上線失敗: ${res.message}`;
        }
      },
      error: (error) => {
        this.message = `錯誤：${error.message}`;
      }
    });
  }

  setPlayerOffline(id: string) {
    this.http.post<any>('http://localhost:1026/api/player/logOut', { playerId: id }).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = `玩家 ${id} 已下線`;
          this.loadPlayers();
        } else {
          this.message = `下線失敗: ${res.message}`;
        }
      },
      error: (error) => {
        this.message = `錯誤：${error.message}`;
      }
    });
  }
}
