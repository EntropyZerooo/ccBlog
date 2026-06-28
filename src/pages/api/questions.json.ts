import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { formatDateToYYYYMMDD } from "@utils/date-utils";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export const GET: APIRoute = async () => {
	try {
		// 获取所有题目（生产环境排除草稿）
		const allQuestions = await getCollection("daily-questions", ({ data }) => {
			return import.meta.env.PROD ? data.draft !== true : true;
		});

		// 转换为 JSON 格式，包含必要的题目数据
		const questionsData = await Promise.all(
			allQuestions.map(async (q) => {
				// 获取原始 markdown 内容
				const body = q.body || "";
				// 将 markdown 转换为 HTML
				const contentHtml = md.render(body);

				return {
					id: q.id,
					slug: q.slug,
					date: formatDateToYYYYMMDD(q.data.date),
					title: q.data.title,
					question: q.data.question,
					choices: q.data.choices,
					correct: q.data.correct,
					difficulty: q.data.difficulty || "medium",
					tags: q.data.tags || [],
					content: contentHtml, // 答案解析的 HTML
				};
			}),
		);

		// 按日期排序
		questionsData.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});

		return new Response(JSON.stringify(questionsData, null, 2), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=3600", // 缓存 1 小时
			},
		});
	} catch (error) {
		console.error("Error generating questions JSON:", error);
		return new Response(
			JSON.stringify({ error: "Failed to generate questions data" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
