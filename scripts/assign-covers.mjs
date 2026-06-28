import fs from "node:fs";
import path from "node:path";

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
const coversDir = path.join("public", "images", "covers");

for (const file of fs.readdirSync(postsDir)) {
	if (!file.endsWith(".md")) continue;
	const slug = file.replace(/\.md$/, "");
	const coverFile = path.join(coversDir, `${slug}.jpg`);
	if (!fs.existsSync(coverFile)) {
		console.warn(`skip ${slug}: no cover file`);
		continue;
	}

	const filePath = path.join(postsDir, file);
	const content = fs.readFileSync(filePath, "utf8");
	const imageLine = `image: /images/covers/${slug}.jpg`;
	fs.writeFileSync(filePath, upsertImageFrontmatter(content, imageLine));
	console.log("updated", slug);
}
