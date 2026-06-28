export function formatDateToYYYYMMDD(date: Date): string {
	// 使用本地时间而不是 UTC，避免时区问题
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * 获取中国时区（UTC+8）的当前日期
 * 用于在构建时确定应该显示哪一天的题目，避免时区问题
 * @returns 返回中国时区的当前日期对象
 */
export function getTodayInChinaTimeZone(): Date {
	const now = new Date();
	// 获取当前 UTC 时间戳
	const utcTimestamp = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
	// 转换为中国时区（UTC+8）的时间戳
	const chinaTimestamp = utcTimestamp + (8 * 60 * 60 * 1000);
	// 创建中国时区的日期对象
	const chinaDate = new Date(chinaTimestamp);
	// 获取中国时区的年月日（使用 UTC 方法，因为 chinaTimestamp 已经是 UTC+8 的时间戳）
	const year = chinaDate.getUTCFullYear();
	const month = chinaDate.getUTCMonth();
	const day = chinaDate.getUTCDate();
	// 在本地时区创建一个日期对象，使用中国时区的年月日
	// 这样当调用 getFullYear(), getMonth(), getDate() 时会返回正确的值
	return new Date(year, month, day);
}
