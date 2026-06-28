export function formatDateToYYYYMMDD(date: Date): string {
	// 使用本地时间而不是 UTC，避免时区问题
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}
