import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TerrainService {
  constructor(private http: HttpClient) {}

  generatePreview(mapSize: number): Observable<any> {
    return this.http.post('http://localhost:1026/api/terrain/generatePreview', {
      width: mapSize,
      height: mapSize
    });
  }

  occupyTile(x: number, y: number, playerId: string): Observable<any> {
    return this.http.post('http://localhost:1026/api/terrain/occupy', {
      x,
      y,
      playerId
    });
  }

  battleEnemy(x: number, y: number, playerId: string, enemyType: string): Observable<any> {
    return this.http.post('http://localhost:1026/api/battle/start', {
      playerId,
      soldierIds: {},
      enemyType,
      locationX: x,
      locationY: y,
      isTest: true
    });
  }

  loadMapConfig(): Observable<any> {
    return this.http.get('http://localhost:1026/api/terrain/gameMap');
  }
}