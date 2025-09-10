import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-building',
  templateUrl: './building.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./building.css']
})
export class Building implements OnInit {
  buildingTypeList: any[] = [];
  buildingType: any = {};
  buildingTypeEditId: string = '';

  ngOnInit(): void {
    this.loadBuildingTypeFullList();
  }

  loadBuildingTypeFullList(): void {
    fetch('http://localhost:1026/api/building/types')
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          this.buildingTypeList = data.data;
        }
      });
  }

  editBuildingTypeFull(type: any): void {
    this.buildingTypeEditId = type.id;
    this.buildingType = { ...type };
    this.buildingType.allowedTerrains = (type.allowedTerrains || []).join(',');
    this.buildingType.levels = JSON.stringify(type.levels || [], null, 2);
  }

  clearBuildingTypeFullForm(): void {
    this.buildingTypeEditId = '';
    this.buildingType = {
      id: '',
      name: '',
      type: 'function',
      resourceType: '',
      maxCount: 1,
      allowedTerrains: '',
      levels: ''
    };
  }

  saveBuildingTypeFull(): void {
    const id = this.buildingType.id.trim();
    const name = this.buildingType.name.trim();
    const type = this.buildingType.type;
    const resourceType = this.buildingType.resourceType.trim() || null;
    const maxCount = parseInt(this.buildingType.maxCount) || 1;
    const allowedTerrainsStr = this.buildingType.allowedTerrains;
    const levelsStr = this.buildingType.levels;

    if (!id) { alert('請輸入建築ID'); return; }
    if (!name) { alert('請輸入名稱'); return; }

    let allowedTerrains: string[] = [];
    if (allowedTerrainsStr && allowedTerrainsStr.trim().length > 0) {
      allowedTerrains = allowedTerrainsStr.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    let levels: any[] = [];
    try {
      levels = JSON.parse(levelsStr || '[]');
      if (!Array.isArray(levels)) throw new Error('levels 必須為陣列');
    } catch (e) {
      alert('等級資料格式錯誤：' + e);
      return;
    }

    const building = {
      id,
      name,
      type,
      resourceType,
      maxCount,
      allowedTerrains,
      levels
    };

    const url = this.buildingTypeEditId ? 'http://localhost:1026/api/building/type/update' : 'http://localhost:1026/api/building/type/create';
    fetch(url, {
      method: this.buildingTypeEditId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(building)
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert('儲存成功');
        this.loadBuildingTypeFullList();
        this.clearBuildingTypeFullForm();
      } else {
        alert('儲存失敗：' + data.message);
      }
    });
  }

  deleteBuildingTypeFull(): void {
    const id = this.buildingType.id;
    if (!id) { alert('請先選擇要刪除的建築'); return; }
    fetch(`http://localhost:1026/api/building/type/delete/${id}`, { method: 'DELETE' })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert('刪除成功');
        this.loadBuildingTypeFullList();
        this.clearBuildingTypeFullForm();
      } else {
        alert('刪除失敗：' + data.message);
      }
    });
  }
}