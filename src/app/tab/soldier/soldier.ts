import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-soldier',
  templateUrl: './soldier.html',
  imports: [FormsModule, HttpClientModule, CommonModule],
  styleUrls: ['./soldier.css']
})
export class Soldier implements OnInit {
  soldierForm: FormGroup;
  soldierList: any[] = [];
  soldier: any = {
    id: '',
    name: '',
    type: 'INFANTRY',
    description: '',
    formationPosition: 'FRONT',
    requirements: '{}',
    requiredTech: '{}',
    skills: '{}',
    stats: '{}'
  };

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.soldierForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      type: ['INFANTRY', Validators.required],
      description: [''],
      formationPosition: ['FRONT', Validators.required],
      requirements: ['{}'],
      requiredTech: ['{}'],
      skills: ['{}'],
      stats: ['{}']
    });
  }

  ngOnInit(): void {
    this.loadSoldierTypeFullList();
  }

  loadSoldierTypeFullList(): void {
    this.http.get<any>('http://localhost:1026/api/soldier/types').subscribe(res => {
      if (res.success && Array.isArray(res.data)) {
        this.soldierList = res.data;
      }
    });
  }

  editSoldierTypeFull(s: any): void {
    this.soldier.id = s.id;
    this.soldier.name = s.name;
    this.soldier.type = s.type;
    this.soldier.description = s.description;
    this.soldier.formationPosition = s.formationPosition;
    this.soldier.requirements = JSON.stringify(s.requirements || {}, null, 2);
    this.soldier.requiredTech = JSON.stringify(s.requiredTech || {}, null, 2);
    this.soldier.skills = JSON.stringify(s.skills || {}, null, 2);
    this.soldier.stats = JSON.stringify(s.stats || {}, null, 2);
  }

  clearSoldierTypeFullForm(): void {
    this.soldierForm.reset({
      id: '',
      name: '',
      type: 'INFANTRY',
      description: '',
      formationPosition: 'FRONT',
      requirements: '{}',
      requiredTech: '{}',
      skills: '{}',
      stats: '{}'
    });
  }

  saveSoldierTypeFull(): void {
    if (this.soldierForm.invalid) {
        alert('請填寫所有必填欄位');
        return;
    }

    let payload;
    try {
        payload = {
            id: this.soldier.id.trim(),
            name: this.soldier.name.trim(),
            type: this.soldier.type,
            description: this.soldier.description.trim(),
            formationPosition: this.soldier.formationPosition,
            requirements: JSON.parse(this.soldier.requirements),
            requiredTech: JSON.parse(this.soldier.requiredTech),
            skills: JSON.parse(this.soldier.skills),
            stats: JSON.parse(this.soldier.stats)
        };
    } catch (e) {
        alert('JSON 格式錯誤，請檢查需求建築、需求科技、技能或屬性欄位');
        return;
    }

    const isUpdate = !!this.soldier.id;
    const url = isUpdate ? 'http://localhost:1026/api/soldier/updateType' : 'http://localhost:1026/api/soldier/createType';
    const method = isUpdate ? 'PUT' : 'POST';

    this.http.request(method, url, { body: payload }).subscribe(res => {
        if (res) {
            alert('儲存成功');
            this.loadSoldierTypeFullList();
            this.clearSoldierTypeFullForm();
        } else {
            alert('儲存失敗：' + res);
        }
    });
  }

  deleteSoldierTypeFull(): void {
    const id = this.soldierForm.get('id')?.value;
    if (!id) {
      alert('請先選擇要刪除的士兵');
      return;
    }

    this.http.delete(`http://localhost:1026/api/soldier/deleteType/${id}`).subscribe(res => {
      if (res) {
        alert('刪除成功');
        this.loadSoldierTypeFullList();
        this.clearSoldierTypeFullForm();
      } else {
        alert('刪除失敗：' + res);
      }
    });
  }
}
