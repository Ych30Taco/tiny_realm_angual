import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terrain-map',
  templateUrl: './terrain-map.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./terrain-map.css']
})
export class TerrainMap implements OnInit {
  mapSize: number = 10;
  currentMap: any[][] = [];
  selectedTile: any = null;
  terrainTypes: string[] = [];
  terrainInfo: any = {};
  playerSelect: string = '';
  players: any[] = [];
  playerResources: any = null;
  stats: any = {};
  resultMsg: string = '';
  previewMapData: any = null;

  ngOnInit(): void {
    this.generateRandomMap();
    this.loadPlayers();
  }

  loadPlayers(): void {
    fetch('http://localhost:1026/api/storage/allGameStateList')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          this.players = Object.entries(data.data).map(([id, state]: [string, any]) => ({
            id,
            name: state?.player?.name || id
          }));
        }
      })
      .catch(() => {});
  }

  onPlayerChange(): void {
    if (this.playerSelect) {
      this.loadPlayerResources();
    } else {
      this.playerResources = null;
    }
  }

  loadPlayerResources(): void {
    if (!this.playerSelect) return;
    fetch(`http://localhost:1026/api/storage/gameState/${this.playerSelect}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.resources) {
          this.playerResources = data.data.resources;
        }
      })
      .catch(() => {});
  }

  generateRandomMap(): void {
    fetch('http://localhost:1026/api/terrain/generatePreview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ width: this.mapSize, height: this.mapSize })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        this.displayPreviewMap(data.data);
      } else {
        this.showResult(`生成預覽失敗：${data.message}`);
      }
    })
    .catch(error => {
      this.showResult(`生成預覽失敗：${error.message}`);
    });
  }

  displayPreviewMap(mapData: any): void {
    const width = mapData.width;
    const height = mapData.height;
    this.currentMap = Array.from({ length: height }, () => Array(width).fill(null));
    let mapArr = Array.from({ length: height }, () => Array(width).fill(null));
    mapData.tiles.forEach((tile: any) => {
      if (tile.x < width && tile.y < height) {
        mapArr[tile.y][tile.x] = tile;
      }
    });
    for (let i = 0; i < height; i++) {
      this.currentMap[i] = [];
      for (let j = 0; j < width; j++) {
        const tile = mapArr[i][j];
        let terrainType = 'plain';
        if (tile && tile.terrain) {
          terrainType = tile.terrain.id || 'plain';
        }
        const isOccupied = tile ? (tile.ownerId !== null) : false;
        const hasEnemy = tile ? tile.hasEnemy : false;
        const enemyType = tile ? tile.enemyType : null;
        const enemyLevel = tile ? tile.enemyLevel : 0;
        this.currentMap[i][j] = {
          x: j,
          y: i,
          terrainType: terrainType,
          owner: tile ? tile.ownerId : null,
          building: tile ? tile.buildingId : null,
          occupied: isOccupied,
          hasEnemy: hasEnemy,
          enemyType: enemyType,
          enemyLevel: enemyLevel
        };
      }
    }
    this.updateTerrainStats(width);
  }

  selectTile(x: number, y: number): void {
    this.selectedTile = { ...this.currentMap[y][x] };
  }

  occupyTile(x: number, y: number): void {
    if (!this.playerSelect) {
      this.showResult('請先選擇玩家');
      return;
    }
    fetch('http://localhost:1026/api/terrain/occupy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, playerId: this.playerSelect })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        const tile = this.currentMap[y][x];
        tile.occupied = true;
        tile.owner = this.playerSelect;
        this.selectedTile = { ...tile };
        this.showResult(`成功佔領座標 (${x}, ${y})`);
        this.loadPlayerResources();
      } else {
        this.showResult(`佔領失敗：${data.message}`);
      }
    })
    .catch(error => {
      this.showResult(`佔領失敗：${error.message}`);
    });
  }

  battleEnemy(x: number, y: number): void {
    const tile = this.currentMap[y][x];
    if (!this.playerSelect) {
      this.showResult('請先選擇玩家');
      return;
    }
    if (!tile.hasEnemy || !tile.enemyType) {
      this.showResult('此地沒有野怪');
      return;
    }
    fetch('http://localhost:1026/api/battle/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: this.playerSelect,
        soldierIds: {},
        enemyType: tile.enemyType,
        locationX: x,
        locationY: y,
        isTest: true
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        const result = data.data?.result || 'WIN';
        this.showResult(`戰鬥${result === 'WIN' ? '勝利' : result === 'LOSE' ? '失敗' : '平手'}！對手：${tile.enemyType} (等級${tile.enemyLevel})`);
        if (result === 'WIN') {
          tile.hasEnemy = false;
          tile.enemyType = null;
          tile.enemyLevel = 0;
        }
        this.selectedTile = { ...tile };
        this.loadPlayerResources();
      } else {
        this.showResult(`戰鬥失敗：${data.message}`);
      }
    })
    .catch(error => {
      this.showResult(`戰鬥失敗：${error.message}`);
    });
  }

  abandonTile(x: number, y: number): void {
    if (!this.playerSelect) {
      this.showResult('請先選擇玩家');
      return;
    }
    fetch('http://localhost:1026/api/terrain/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, playerId: this.playerSelect })
    })
    .then(r => r.json())
    .then(data => {
      const tile = this.currentMap[y][x];
      if (data.success) {
        tile.occupied = false;
        tile.owner = null;
        tile.building = null;
        this.selectedTile = { ...tile };
        this.showResult(`放棄了座標 (${x}, ${y})`);
        this.loadPlayerResources();
      } else {
        this.showResult(`放棄失敗：${data.message}`);
      }
    })
    .catch(error => {
      this.showResult(`放棄失敗：${error.message}`);
    });
  }

  updateTerrainStats(mapSize: number): void {
    this.stats = {};
    this.terrainTypes.forEach(type => {
      this.stats[type] = 0;
    });
    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        if (this.currentMap[i] && this.currentMap[i][j]) {
          const type = this.currentMap[i][j].terrainType;
          this.stats[type]++;
        }
      }
    }
  }

  loadMapFromConfig(): void {
    fetch('http://localhost:1026/api/terrain/gameMap')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data && data.data.tiles) {
          this.displayPreviewMap(data.data);
          this.showResult('後端配置地圖載入成功！');
        } else {
          this.showResult('載入地圖失敗：' + data.message);
        }
      })
      .catch(error => {
        this.showResult('載入地圖失敗：' + error.message);
      });
  }

  overrideWithConfigMap(): void {
    if (this.previewMapData) {
      this.savePreviewMap();
    }
  }

  savePreviewMap(): void {
    fetch('http://localhost:1026/api/terrain/savePreview', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.showResult('預覽地圖已成功保存到記憶體和map.json文件');
        this.previewMapData = null;
        this.loadMapFromConfig();
      } else {
        this.showResult(`保存失敗：${data.message}`);
      }
    })
    .catch(error => {
      this.showResult(`保存失敗：${error.message}`);
    });
  }

  clearMapSelection(): void {
    this.previewMapData = null;
    this.loadMapFromConfig();
    this.showResult('已清除預覽地圖，重新載入配置地圖');
  }

  showResult(msg: string): void {
    this.resultMsg = msg;
  }
}
