import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ModulesService, ModuleStatus } from '../../services/modules.service';

@Component({
	selector: 'app-overview',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="container my-4">
			<div class="row">
				<div class="col-md-6">
					<div class="card module-card">
						<div class="card-header module-header">
							<h5 class="mb-0"><i class="fas fa-chart-line me-2"></i>系統狀態</h5>
						</div>
						<div class="card-body module-body">
							<div class="d-flex justify-content-between align-items-center mb-3" *ngFor="let s of statuses()">
								<span>{{ labelMap[s.key] }}</span>
								<span>
									<span class="status-indicator" [ngClass]="{
										'status-loading': loading(),
										'status-active': !loading() && s.active,
										'status-inactive': !loading() && !s.active
									}"></span>
									{{ loading() ? '檢查中...' : (s.active ? '正常' : '異常') }}
								</span>
							</div>
							<button class="btn btn-module btn-info w-100 mt-3" (click)="refresh()" [disabled]="loading()">
								<i class="fas fa-sync me-2"></i>重新檢查狀態
							</button>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="card module-card">
						<div class="card-header module-header">
							<h5 class="mb-0"><i class="fas fa-cogs me-2"></i>快速操作</h5>
						</div>
						<div class="card-body module-body">
							<button class="btn btn-module btn-primary w-100 mb-3" (click)="initializeAll()" [disabled]="busy()">
								<i class="fas fa-play me-2"></i>初始化所有模組
							</button>
							<button class="btn btn-module btn-success w-100 mb-3" (click)="runTests()" [disabled]="busy()">
								<i class="fas fa-vial me-2"></i>執行完整測試
							</button>
							<button class="btn btn-module btn-warning w-100 mb-3" (click)="generateData()" [disabled]="busy()">
								<i class="fas fa-database me-2"></i>生成測試資料
							</button>
							<button class="btn btn-module btn-danger w-100" (click)="resetAll()" [disabled]="busy()">
								<i class="fas fa-trash me-2"></i>重置所有資料
							</button>
							<div class="result-area mt-3" *ngIf="message()">
								<pre class="mb-0">{{ message() }}</pre>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
		:host { display: block; }
		.module-card { border: none; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
		.module-header { background: linear-gradient(45deg, #667eea, #764ba2); color: #fff; border-radius: 15px 15px 0 0; }
		.module-body { padding: 1.25rem; }
		.btn-module { border-radius: 25px; font-weight: 600; }
		.status-indicator { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 8px; }
		.status-active { background-color: #28a745; }
		.status-inactive { background-color: #dc3545; }
		.status-loading { background-color: #ffc107; }
		.result-area { background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 10px; padding: 12px; }
		`
	]
})
export class OverviewComponent implements OnInit {
	private readonly modules = inject(ModulesService);
	protected readonly loading = signal<boolean>(false);
	protected readonly busy = signal<boolean>(false);
	protected readonly message = signal<string>('');
	protected readonly statuses = signal<ModuleStatus[]>([
		{ key: 'player', active: false },
		{ key: 'resource', active: false },
		{ key: 'building', active: false },
		{ key: 'terrain', active: false },
	]);

	protected readonly labelMap: Record<ModuleStatus['key'], string> = {
		player: '玩家模組',
		resource: '資源模組',
		building: '建築模組',
		terrain: '地形地圖模組'
	};

	ngOnInit(): void {
		this.refresh();
	}

	refresh(): void {
		this.loading.set(true);
		this.modules.getModuleStatuses().subscribe({
			next: (list) => { this.statuses.set(list); this.loading.set(false); },
			error: () => { this.loading.set(false); }
		});
	}

	initializeAll(): void {
		this.busy.set(true);
		this.modules.initializeAllModules().subscribe({
			next: (msg) => { this.message.set(msg); this.busy.set(false); this.refresh(); },
			error: (e) => { this.message.set(String(e?.message || e)); this.busy.set(false); }
		});
	}

	runTests(): void {
		this.busy.set(true);
		this.modules.runFullTest().subscribe({
			next: (msg) => { this.message.set(msg); this.busy.set(false); },
			error: (e) => { this.message.set(String(e?.message || e)); this.busy.set(false); }
		});
	}

	generateData(): void {
		this.busy.set(true);
		this.modules.generateTestData().subscribe({
			next: (msg) => { this.message.set(msg); this.busy.set(false); },
			error: (e) => { this.message.set(String(e?.message || e)); this.busy.set(false); }
		});
	}

	resetAll(): void {
		if (!confirm('確定要重置所有資料嗎？此操作不可恢復！')) { return; }
		this.busy.set(true);
		this.modules.resetAllData().subscribe({
			next: (msg) => { this.message.set(msg); this.busy.set(false); this.refresh(); },
			error: (e) => { this.message.set(String(e?.message || e)); this.busy.set(false); }
		});
	}
}


