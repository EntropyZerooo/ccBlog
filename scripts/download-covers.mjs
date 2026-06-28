import fs from "node:fs";
import path from "node:path";
import { coverFallbacks, coverManifest } from "./covers-manifest.mjs";

const outDir = path.join("public", "images", "covers");
fs.mkdirSync(outDir, { recursive: true });

async function downloadCover(source) {
	const url = source.startsWith("http")
		? source
		: `https://images.unsplash.com/${source}?auto=format&fit=crop&w=1200&h=675&q=85`;
	const res = await fetch(url, { redirect: "follow" });
	if (!res.ok) return null;
	return Buffer.from(await res.arrayBuffer());
}

function upsertImageFrontmatter(content, imageLine) {
	if (/^image:/m.test(content)) {
		return content.replace(/^image:.*\r?\n/m, `${imageLine}\n`);
	}
	if (/^draft:/m.test(content)) {
		return content.replace(/^(draft: .+\r?\n)/m, `${imageLine}\n$1`);
	}
	return content.replace(/^(---\r?\n[\s\S]*?\r?\n)(---)/, `$1${imageLine}\n$2`);
}

const postsDir = path.join("src", "content", "posts");
const slugs = fs
	.readdirSync(postsDir)
	.filter((f) => f.endsWith(".md"))
	.map((f) => f.replace(/\.md$/, ""));

const failed = [];

for (const slug of slugs) {
	const primary = coverManifest[slug];
	const fallback = coverFallbacks[slug];
	let buf = null;

	if (primary) buf = await downloadCover(primary);
	if (!buf && fallback) buf = await downloadCover(fallback);
	if (!buf) {
		const picsum = await fetch(
			`https://picsum.photos/seed/fuwari-${slug}/1200/675`,
			{ redirect: "follow" },
		);
		if (picsum.ok) buf = Buffer.from(await picsum.arrayBuffer());
	}

	if (!buf) {
		failed.push(slug);
		console.log(`${slug}: FAILED`);
		continue;
	}

	fs.writeFileSync(path.join(outDir, `${slug}.jpg`), buf);
	console.log(`${slug}: OK (${Math.round(buf.length / 1024)}KB)`);
}

for (const slug of slugs) {
	const coverPath = path.join(outDir, `${slug}.jpg`);
	if (!fs.existsSync(coverPath)) continue;

	const filePath = path.join(postsDir, `${slug}.md`);
	const content = fs.readFileSync(filePath, "utf8");
	const imageLine = `image: /images/covers/${slug}.jpg`;
	fs.writeFileSync(filePath, upsertImageFrontmatter(content, imageLine));
}

if (failed.length) {
	console.log("\nFailed:", failed.join(", "));
	process.exit(1);
}

console.log(`\nDone: ${slugs.length} posts updated.`);
