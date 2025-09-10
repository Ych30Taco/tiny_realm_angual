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
  stats: any = {};
  resultMsg: string = '';
  previewMapData: any = null;

  ngOnInit(): void {
    this.generateRandomMap();
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
    this.selectedTile = this.currentMap[y][x];
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
        this.showResult(`玩家 ${this.playerSelect} 成功佔領座標 (${x}, ${y}) 的 ${this.terrainInfo[tile.terrainType]?.name}`);
        this.showTileInfo(tile);
      } else {
        this.showResult(`佔領失敗：${data.message}`);
      }
    })
    .catch(error => {
      this.showResult(`佔領失敗：${error.message}`);
    });
  }

  buildOnTile(x: number, y: number): void {
    const tile = this.currentMap[y][x];
    tile.building = 'townhall';
    this.showResult(`在座標 (${x}, ${y}) 建造了市政廳`);
    this.showTileInfo(tile);
  }

  abandonTile(x: number, y: number): void {
    const tile = this.currentMap[y][x];
    tile.occupied = false;
    tile.owner = null;
    tile.building = null;
    this.showResult(`放棄了座標 (${x}, ${y}) 的 ${this.terrainInfo[tile.terrainType]?.name}`);
    this.showTileInfo(tile);
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
        this.showResult(`戰鬥勝利！擊敗了 ${tile.enemyType} (等級${tile.enemyLevel})`);
        tile.hasEnemy = false;
        tile.enemyType = null;
        tile.enemyLevel = 0;
        this.showTileInfo(tile);
      } else {
        this.showResult(`戰鬥失敗：${data.message}`);
      }
    })
    .catch(error => {
      this.showResult(`戰鬥失敗：${error.message}`);
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
    // 若要支援 else 分支可再補 overrideWithConfigMapOnly()
  }

  savePreviewMap(): void {
    // console.log('保存預覽地圖函數被調用');
    // showLoading('正在保存預覽地圖...');
    fetch('http://localhost:1026/api/terrain/savePreview', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
      // hideLoading();
      if (data.success) {
        this.showResult('預覽地圖已成功保存到記憶體和map.json文件');
        this.previewMapData = null;
        this.loadMapFromConfig();
      } else {
        this.showResult(`保存失敗：${data.message}`);
      }
    })
    .catch(error => {
      // hideLoading();
      this.showResult(`保存失敗：${error.message}`);
    });
  }

  clearMapSelection(): void {
    this.previewMapData = null;
    this.loadMapFromConfig();
    this.showResult('已清除預覽地圖，重新載入配置地圖');
  }

  showTileInfo(tile: any): void {
    // 可根據需求將資訊顯示在元件內
  }

  showResult(msg: string): void {
    this.resultMsg = msg;
  }
}