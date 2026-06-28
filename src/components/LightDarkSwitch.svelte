<script lang="ts">
import { DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
	updateBannerForTheme,
} from "@utils/setting-utils.ts";
import { onMount } from "svelte";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

console.log("🟣 LightDarkSwitch.svelte: Script block executed");

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE];

// 使用 Svelte 5 的 $state rune
let mode: LIGHT_DARK_MODE = $state(LIGHT_MODE);

console.log("🟣 LightDarkSwitch.svelte: Component initialized, mode =", mode);

onMount(() => {
	console.log("🔵 LightDarkSwitch component: onMount called");

	// 初始化主题
	mode = getStoredTheme();
	console.log("🔵 Initial theme mode:", mode);
	applyThemeToDocument(mode);

	// 监听来自 Navbar.astro 脚本的主题变更事件
	const handleThemeChanged = (e: CustomEvent) => {
		console.log("🔵 Theme changed event received:", e.detail);
		const newTheme = e.detail?.theme;
		if (newTheme && ["light", "dark"].includes(newTheme)) {
			mode = newTheme as LIGHT_DARK_MODE;
			applyThemeToDocument(mode);
			requestAnimationFrame(() => {
				updateBannerForTheme();
			});
		}
	};
	window.addEventListener("theme-changed", handleThemeChanged as EventListener);
	console.log("🔵 Theme changed event listener added");

	// 确保按钮点击事件绑定（备用方案，确保点击能工作）
	const setupButton = () => {
		console.log("🔵 setupButton called, looking for #scheme-switch");
		const button = document.getElementById(
			"scheme-switch",
		) as HTMLButtonElement;
		if (button) {
			console.log("🔵 Button found!", button);
			console.log("🔵 Button has listener?", button.dataset.listenerAdded);
			// 不再需要添加原生事件监听器，Svelte 的 on:click 已经足够
			// 只保留鼠标进入事件用于显示面板
			if (!button.dataset.mouseenterAdded) {
				button.dataset.mouseenterAdded = "true";
				button.addEventListener("mouseenter", () => {
					console.log("🔵 Mouse enter event fired!");
					showPanel();
				});
			}
		} else {
			console.error("🔴 Button NOT FOUND!");
		}
	};

	// 立即设置
	console.log("🔵 Setting up button immediately");
	setupButton();
	// 延迟设置（确保 DOM 完全就绪）
	setTimeout(() => {
		console.log("🔵 Setting up button after 100ms");
		setupButton();
	}, 100);
	setTimeout(() => {
		console.log("🔵 Setting up button after 300ms");
		setupButton();
	}, 300);
	setTimeout(() => {
		console.log("🔵 Setting up button after 1000ms");
		setupButton();
	}, 1000);

	// 不再需要监听系统主题变化，因为已移除自动模式

	// 兼容 Astro 的 View Transitions
	const handleAfterSwap = () => {
		applyThemeToDocument(mode);
		setupButton(); // 页面切换后重新设置按钮
	};
	document.addEventListener("astro:after-swap", handleAfterSwap);

	return () => {
		document.removeEventListener("astro:after-swap", handleAfterSwap);
	};
});

function switchScheme(newMode: LIGHT_DARK_MODE) {
	mode = newMode;
	setTheme(newMode);
	applyThemeToDocument(newMode);

	// 延迟更新 Banner，确保 DOM 已就绪
	requestAnimationFrame(() => {
		updateBannerForTheme();
	});
}

function toggleScheme(event?: MouseEvent) {
	console.log("🟢 toggleScheme function called!", { event, mode });
	if (event) {
		event.preventDefault();
		event.stopPropagation();
	}
	const i = seq.indexOf(mode);
	const nextMode = seq[(i + 1) % seq.length];
	console.log("🟢 Current mode:", mode, "Next mode:", nextMode);
	switchScheme(nextMode);
}

function showPanel() {
	console.log("🟡 showPanel called");
	const panel = document.querySelector("#light-dark-panel");
	if (panel) {
		console.log("🟡 Panel found, removing float-panel-closed");
		panel.classList.remove("float-panel-closed");
	} else {
		console.error("🟡 Panel NOT FOUND!");
	}
}

function hidePanel() {
	const panel = document.querySelector("#light-dark-panel");
	if (panel) {
		panel.classList.add("float-panel-closed");
	}
}
</script>

<!-- z-[10000] make the panel higher than other float panels and candy rain -->
<div class="relative pointer-events-auto" style="z-index: 10000;" role="menu" tabindex="-1" on:mouseleave={hidePanel}>
    <button 
        type="button" 
        aria-label="Light/Dark Mode" 
        role="menuitem" 
        class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 pointer-events-auto" 
        id="scheme-switch"
        style="z-index: 10001 !important; position: relative !important;" 
        on:click={(e) => {
            console.log('🟣 Svelte on:click handler fired!', e);
            toggleScheme(e);
        }}
        on:mouseenter={(e) => {
            console.log('🟣 Svelte on:mouseenter handler fired!', e);
            showPanel();
        }}
    >
        <div class="absolute" class:opacity-0={mode !== LIGHT_MODE}>
            <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute" class:opacity-0={mode !== DARK_MODE}>
            <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
        </div>
    </button>

    <div id="light-dark-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5">
        <div class="card-base float-panel p-2">
            <button 
                type="button" 
                class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 border-2"
                class:current-theme-btn={mode === LIGHT_MODE}
                style={mode === LIGHT_MODE ? "border-color: var(--primary);" : "border-color: transparent;"}
                on:click={() => switchScheme(LIGHT_MODE)}
            >
                <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.lightMode)}
            </button>
            <button 
                type="button" 
                class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 border-2"
                class:current-theme-btn={mode === DARK_MODE}
                style={mode === DARK_MODE ? "border-color: var(--primary);" : "border-color: transparent;"}
                on:click={() => switchScheme(DARK_MODE)}
            >
                <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.darkMode)}
            </button>
        </div>
    </div>
</div>