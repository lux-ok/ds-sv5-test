type ConditionFunction<T> = (value: T[keyof T]) => boolean;
type ConditionFlags<T> = Partial<Record<keyof T, () => boolean>>;

/**
 * + DsFilter
 */
export class DsFilter<T extends Record<string, any>> {
	// - cacheConditions 保存了緩存的條件函數
	private cacheConditions: Partial<Record<keyof T, ConditionFunction<T>>> = {};

	constructor(
		conditions: Partial<Record<keyof T, ConditionFunction<T>>>, // - 條件函數
		private conditionFlags: ConditionFlags<T> // - 動態開關
	) {
		// - 這裡緩存每個條件函數，僅在初始化時生成一次
		for (const key in conditions) {
			if (Object.prototype.hasOwnProperty.call(conditions, key)) {
				this.cacheConditions[key] = conditions[key]!;
			}
		}
	}

	// - 核心篩選函數
	match(data: T): boolean {
		// - 遍歷 cacheConditions，檢查每個條件
		for (const key in this.cacheConditions) {
			// - 檢查開關是否啟用並執行相應的條件函數
			if (this.conditionFlags[key]?.() && this.cacheConditions[key]) {
				const conditionFunc = this.cacheConditions[key]!;
				// - 若某個條件不符合則返回 false
				if (!conditionFunc(data[key])) {
					return false;
				}
			}
		}
		// - 所有條件符合時返回 true
		return true;
	}
}
