import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { formatDateToYYYYMMDD, getTodayInChinaTimeZone } from "./date-utils";

/**
 * 根据日期获取对应的每日一题
 * @param date 日期对象，如果不提供则使用当前日期（中国时区）
 * @returns 返回对应日期的题目，如果没有找到则返回最近的题目（不超过指定日期）
 */
export async function getDailyQuestion(
	date?: Date,
): Promise<CollectionEntry<"daily-questions"> | null> {
	const targetDate = date || getTodayInChinaTimeZone();
	const dateString = formatDateToYYYYMMDD(targetDate);
	const targetTime = new Date(
		targetDate.getFullYear(),
		targetDate.getMonth(),
		targetDate.getDate(),
	).getTime();

	// 获取所有题目
	const allQuestions = await getCollection("daily-questions", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// 查找匹配日期的题目
	let question = allQuestions.find((q) => {
		const questionDate = formatDateToYYYYMMDD(q.data.date);
		return questionDate === dateString;
	});

	// 如果找不到当天的题目，找最近的题目（不超过指定日期）
	if (!question && allQuestions.length > 0) {
		const validQuestions = allQuestions.filter((q) => {
			const questionTime = new Date(
				q.data.date.getFullYear(),
				q.data.date.getMonth(),
				q.data.date.getDate(),
			).getTime();
			return questionTime <= targetTime;
		});

		if (validQuestions.length > 0) {
			// 按日期降序排序，取最近的
			validQuestions.sort(
				(a, b) => b.data.date.getTime() - a.data.date.getTime(),
			);
			question = validQuestions[0];
		}
	}

	return question || null;
}

/**
 * 获取所有可用的题目日期
 */
export async function getAvailableQuestionDates(): Promise<Date[]> {
	const allQuestions = await getCollection("daily-questions", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	return allQuestions
		.map((q) => q.data.date)
		.sort((a, b) => b.getTime() - a.getTime());
}
