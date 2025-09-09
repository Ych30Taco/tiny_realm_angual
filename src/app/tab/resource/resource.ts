import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resource',
  imports: [CommonModule, FormsModule],
  templateUrl: './resource.html',
  styleUrl: './resource.css'
})
export class Resource implements OnInit {
  resourceTypes: any[] = [];
  resourceForm: any = {
    editId: '',
    id: '',
    nameZh: '',
    nameEn: '',
    descZh: '',
    descEn: '',
    desc: '', // Add this line
    iconURL: '',
    premium: false,
    stackable: true,
    category: '',
    sortOrder: 0,
    baseProductionRate: 0,
    nowAmount: 0,
    maxAmount: 0,
    protectedStoragePercentage: 0,
    protectedStorageMaxAmount: 0,
    acquisitionMethods: ''
  };
  resultMsg: string = '';

  ngOnInit() {
    this.loadResourceTypeFullList();
  }

  loadResourceTypeFullList() {
    fetch('http://localhost:1026/api/resource/types')
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          this.resourceTypes = data.data;
        } else {
          this.resourceTypes = [];
        }
      });
  }

  editResourceTypeFull(type: any) {
    this.resourceForm.editId = type.id;
    this.resourceForm.id = type.id;
    this.resourceForm.nameZh = type.name['zh-TW'] || '';
    this.resourceForm.nameEn = type.name['en'] || '';
    this.resourceForm.descZh = type.resourceDescription || '';
    this.resourceForm.desc = type.description || ''; // Add this line
    this.resourceForm.iconURL = type.resourceIconURL || '';
    this.resourceForm.premium = !!type.premium;
    this.resourceForm.stackable = !!type.stackable;
    this.resourceForm.category = type.category || '';
    this.resourceForm.sortOrder = type.sortOrder || 0;
    this.resourceForm.baseProductionRate = type.baseProductionRate || 0;
    this.resourceForm.nowAmount = type.nowAmount || 0;
    this.resourceForm.maxAmount = type.maxAmount || 0;
    this.resourceForm.protectedStoragePercentage = type.protectedStoragePercentage || 0;
    this.resourceForm.protectedStorageMaxAmount = type.protectedStorageMaxAmount || 0;
    this.resourceForm.acquisitionMethods = (type.acquisitionMethods || []).join(',');
  }

  clearResourceTypeFullForm() {
    this.resourceForm = {
      editId: '',
      id: '',
      nameZh: '',
      nameEn: '',
      descZh: '',
      descEn: '',
      desc: '', // Add this line
      iconURL: '',
      premium: false,
      stackable: true,
      category: '',
      sortOrder: 0,
      baseProductionRate: 0,
      nowAmount: 0,
      maxAmount: 0,
      protectedStoragePercentage: 0,
      protectedStorageMaxAmount: 0,
      acquisitionMethods: ''
    };
  }

  saveResourceTypeFull(isUpdate: boolean) {
    const resource = {
      id: this.resourceForm.id,
      name: { 'zh-TW': this.resourceForm.nameZh || null, 'en': this.resourceForm.nameEn || null },
      resourceDescription: this.resourceForm.descZh || null,
      description: this.resourceForm.desc || null,
      resourceIconURL: this.resourceForm.iconURL || null,
      premium: this.resourceForm.premium,
      stackable: this.resourceForm.stackable,
      category: this.resourceForm.category || null,
      sortOrder: Number(this.resourceForm.sortOrder) || 0,
      baseProductionRate: Number(this.resourceForm.baseProductionRate) || 0,
      nowAmount: Number(this.resourceForm.nowAmount) || 0,
      maxAmount: Number(this.resourceForm.maxAmount) || 0,
      protectedStoragePercentage: Number(this.resourceForm.protectedStoragePercentage) || 0,
      protectedStorageMaxAmount: Number(this.resourceForm.protectedStorageMaxAmount) || 0,
      acquisitionMethods: this.resourceForm.acquisitionMethods ? this.resourceForm.acquisitionMethods.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []
    };
    const url = isUpdate ? 'http://localhost:1026/api/resource/update' : 'http://localhost:1026/api/resource/create';
    fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resource)
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        this.showResult(isUpdate ? '更新成功' : '新增成功');
        this.loadResourceTypeFullList();
        this.clearResourceTypeFullForm();
      } else {
        this.showResult((isUpdate ? '更新失敗：' : '新增失敗：') + data.message);
      }
    });
  }

  deleteResourceTypeFull() {
    const id = this.resourceForm.id;
    if (!id) { this.showResult('請先選擇要刪除的資源'); return; }
    fetch(`http://localhost:1026/api/resource/delete/${id}`, {
      method: 'DELETE'
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        this.showResult('刪除成功');
        this.loadResourceTypeFullList();
        this.clearResourceTypeFullForm();
      } else {
        this.showResult('刪除失敗：' + data.message);
      }
    });
  }

  showResult(msg: string) {
    this.resultMsg = msg;
    setTimeout(() => { this.resultMsg = ''; }, 2000);
  }
}
