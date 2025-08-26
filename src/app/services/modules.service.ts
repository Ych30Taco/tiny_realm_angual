import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type ModuleKey = 'player' | 'resource' | 'building' | 'terrain';

export interface ModuleStatus {
	key: ModuleKey;
	active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModulesService {
	private readonly http = inject(HttpClient);

	getModuleStatuses(): Observable<ModuleStatus[]> {
		// 合理猜測：以呼叫數個健康檢查或單一狀態端點。這裡使用 modules/status 作為匯總。
		return this.http.get<any>('/modules/status').pipe(
			map(res => {
				const data = res?.data || {};
				return [
					{ key: 'player', active: !!data.player },
					{ key: 'resource', active: !!data.resource },
					{ key: 'building', active: !!data.building },
					{ key: 'terrain', active: !!data.terrain }
				];
			})
		);
	}

	initializeAllModules(): Observable<string> {
		return this.http.post<any>('/modules/init', {}).pipe(
			map(r => r?.message || '所有模組初始化完成！')
		);
	}

	runFullTest(): Observable<string> {
		return this.http.post<any>('/modules/test', {}).pipe(
			map(r => r?.message || '完整測試執行完成！')
		);
	}

	generateTestData(): Observable<string> {
		return this.http.post<any>('/modules/generate-data', {}).pipe(
			map(r => r?.message || '測試資料生成完成！')
		);
	}

	resetAllData(): Observable<string> {
		return this.http.post<any>('/modules/reset', {}).pipe(
			map(r => r?.message || '所有資料已重置！')
		);
	}
}


