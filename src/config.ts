import type {
	BlogCategoryConfig,
	CollectionConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	PersonalConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "随想录",
	subtitle: "技术 · 阅读 · 投资",
	lang: "zh_CN",
	themeColor: {
		hue: 200,
		fixed: false,
	},
	banner: {
		enable: false,
		src: "assets/images/demo-avatar.png",
		lightSrc: "assets/images/demo-avatar-light.png",
		position: "center",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const blogCategories: BlogCategoryConfig[] = [
	{
		slug: "tech",
		name: "技术",
		category: "技术心得",
		cover: "assets/images/demo-banner.png",
	},
	{
		slug: "invest",
		name: "投资",
		category: "投资心得",
		cover: "assets/images/demo-avatar.png",
	},
	{
		slug: "read",
		name: "阅读",
		category: "阅读心得",
		cover: "assets/images/demo-avatar-light.png",
	},
];

export const collectionsConfig: CollectionConfig[] = [
	{
		title: "技术心得",
		description: "编程实践、架构思考与工程习惯",
		href: "/blog/tech/",
	},
	{
		title: "阅读笔记",
		description: "书籍摘录与阅读反思",
		href: "/blog/read/",
	},
	{
		title: "投资思考",
		description: "市场观察与个人理财笔记",
		href: "/blog/invest/",
	},
];

export const navBarConfig: NavBarConfig = {
	links: [
		{ name: "Blog", url: "/blog/tech/", dropdown: true },
		LinkPreset.Archive,
		LinkPreset.About,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.png",
	name: "青菜君",
	bio: "记录技术心得、阅读感悟与投资思考",
	links: [
		{
			name: "GitHub",
			url: "https://github.com/cjun666",
			icon: "fa6-brands:github",
		},
	],
};

export const personalConfig: PersonalConfig = {
	location: "China",
	githubUsername: "cjun666",
	email: "",
	googleScholar: "",
	blogStartDate: "2024-06-15",
	aboutIntro:
		"一名程序员，在这里记录技术实践、阅读感悟与投资思考。欢迎通过 GitHub 交流。",
	education: [
		{
			heading: "Renrui Technology Co., Ltd.",
			subheading: "Backend R&D Engineer",
			date: "2023 - Present",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const blogPageSize = 15;
