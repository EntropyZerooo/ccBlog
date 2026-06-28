<script lang="ts">
	import { onMount } from "svelte";
	import DailyQuestionComponent from "./DailyQuestion.svelte";
	import { formatDateToYYYYMMDD, getTodayInChinaTimeZone } from "../utils/date-utils";

	interface QuestionData {
		id: string;
		slug: string;
		date: string;
		title: string;
		question: string;
		choices: string[];
		correct: number;
		difficulty: string;
		tags: string[];
		content: string;
	}

	interface Props {
		initialQuestion?: QuestionData;
		initialDate?: string;
	}

	let { initialQuestion, initialDate }: Props = $props();

	let currentQuestion = $state<QuestionData | null>(initialQuestion || null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let explanationHtml = $state<string>("");

	// 获取中国时区的当前日期字符串
	function getTodayDateString(): string {
		const today = getTodayInChinaTimeZone();
		return formatDateToYYYYMMDD(today);
	}

	// 从 API 加载题目数据
	async function loadQuestionForDate(dateStr: string) {
		loading = true;
		error = null;

		try {
			// 获取 base URL，处理相对路径
			let baseUrl = import.meta.env.BASE_URL || "/DailyQuestion/";
			// 确保 base URL 以 / 开头和结尾
			if (!baseUrl.startsWith("/")) baseUrl = "/" + baseUrl;
			if (!baseUrl.endsWith("/")) baseUrl = baseUrl + "/";
			// 移除开头的 /，因为 fetch 需要相对路径或绝对路径
			const apiUrl = baseUrl.replace(/^\/+/, "") + "api/questions.json";
			const response = await fetch(apiUrl);

			if (!response.ok) {
				throw new Error(`Failed to load questions: ${response.statusText}`);
			}

			const questions: QuestionData[] = await response.json();

			// 查找匹配日期的题目
			let question = questions.find((q) => q.date === dateStr);

			// 如果找不到当天的题目，找最近的题目（不超过指定日期）
			if (!question && questions.length > 0) {
				const targetTime = new Date(dateStr).getTime();
				const validQuestions = questions.filter((q) => {
					const questionTime = new Date(q.date).getTime();
					return questionTime <= targetTime;
				});

				if (validQuestions.length > 0) {
					// 按日期降序排序，取最近的
					validQuestions.sort((a, b) => {
						return new Date(b.date).getTime() - new Date(a.date).getTime();
					});
					question = validQuestions[0];
				}
			}

			if (question) {
				currentQuestion = question;
				explanationHtml = question.content;
			} else {
				throw new Error("没有找到可用的题目");
			}
		} catch (err) {
			error = err instanceof Error ? err.message : "加载题目失败";
			console.error("Error loading question:", err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const todayDateStr = getTodayDateString();

		// 如果初始题目日期不是今天，则加载今天的题目
		if (!initialDate || initialDate !== todayDateStr) {
			loadQuestionForDate(todayDateStr);
		} else if (initialQuestion) {
			// 使用初始题目，但需要设置答案解析 HTML
			explanationHtml = initialQuestion.content || "";
		}
	});

	// 将 QuestionData 转换为 DailyQuestionComponent 需要的格式
	function getQuestionProps() {
		if (!currentQuestion) return null;

		// 创建一个模拟的 CollectionEntry 格式
		return {
			id: currentQuestion.id,
			slug: currentQuestion.slug,
			data: {
				title: currentQuestion.title,
				question: currentQuestion.question,
				date: new Date(currentQuestion.date),
				choices: currentQuestion.choices,
				correct: currentQuestion.correct,
				difficulty: currentQuestion.difficulty as "easy" | "medium" | "hard",
				tags: currentQuestion.tags,
			},
		};
	}
</script>

{#if loading}
	<div class="flex items-center justify-center py-12">
		<div class="text-50">加载中...</div>
	</div>
{:else if error}
	<div class="flex items-center justify-center py-12">
		<div class="text-red-500">错误: {error}</div>
	</div>
{:else if currentQuestion}
	<div class="daily-question-wrapper">
		<!-- 显示日期 -->
		<div class="text-sm text-50 mb-5">
			{new Date(currentQuestion.date).toLocaleDateString("zh-CN", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})}
		</div>

		<!-- 题干 -->
		<div class="text-lg text-75 mb-6 font-medium">
			{currentQuestion.question}
		</div>

		<!-- 选项与提交 -->
		{#if getQuestionProps()}
			<DailyQuestionComponent
				question={getQuestionProps()}
				explanationId="daily-explanation"
			/>
		{/if}

		<!-- 答案解析 -->
		<div
			id="daily-explanation"
			class="hidden card-base px-6 md:px-9 pt-6 pb-6 md:pb-8 rounded-[var(--radius-large)] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 mt-4"
		>
			<div class="flex items-center gap-3 mb-4">
				<div
					class="transition h-9 w-9 rounded-lg flex items-center justify-center bg-[var(--btn-regular-bg)] text-[var(--primary)]"
					aria-hidden="true"
				>
					<svg
						class="text-xl"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						/>
					</svg>
				</div>
				<h2 class="text-xl md:text-2xl font-bold text-90">答案解析</h2>
			</div>
			<div class="custom-md text-75 prose dark:prose-invert !max-w-none" set:html={explanationHtml} />
		</div>
	</div>
{/if}
