import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);

	// Update banner image based on theme
	// 使用 requestAnimationFrame 确保 DOM 更新后再执行
	requestAnimationFrame(() => {
		updateBannerForTheme();
	});
}

export function updateBannerForTheme() {
	const banner = document.getElementById("banner");
	const bannerLight = document.getElementById("banner-light");

	if (!banner) {
		// 如果元素还没加载，延迟执行
		setTimeout(updateBannerForTheme, 100);
		return;
	}

	const isDark = document.documentElement.classList.contains("dark");

	// 移除所有可能影响显示的类
	banner.classList.remove("opacity-0", "scale-105");
	if (bannerLight) {
		bannerLight.classList.remove("opacity-0", "scale-105");
	}

	// 使用 CSS 变量 + 内联样式双重保障
	if (isDark) {
		// 暗色主题：显示暗色背景图，隐藏浅色背景图
		banner.style.setProperty("--banner-opacity", "1");
		banner.style.setProperty("opacity", "1", "important");
		banner.style.opacity = "1";
		banner.style.display = "block";
		if (bannerLight) {
			bannerLight.style.setProperty("--banner-opacity", "0");
			bannerLight.style.setProperty("opacity", "0", "important");
			bannerLight.style.opacity = "0";
			bannerLight.style.display = "none";
		}
	} else {
		// 浅色主题：显示浅色背景图，隐藏暗色背景图
		banner.style.setProperty("--banner-opacity", "0");
		banner.style.setProperty("opacity", "0", "important");
		banner.style.opacity = "0";
		banner.style.display = "none";
		if (bannerLight) {
			bannerLight.style.setProperty("--banner-opacity", "1");
			bannerLight.style.setProperty("opacity", "1", "important");
			bannerLight.style.opacity = "1";
			bannerLight.style.display = "block";
			console.log("🟢 Banner light should be visible now");
		} else {
			console.error("🔴 banner-light element not found!");
		}
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
