import assert from "node:assert/strict";

const fields = [
	[
		["使用方式", "Product variant"],
		{
			Cloud: "deployment: cloud",
			"在线站点（resume.afeiii.com）": "deployment: cloud",
			"Self-hosted": "deployment: self-hosted",
			自行部署: "deployment: self-hosted",
		},
	],
	[
		["涉及功能", "Area"],
		{
			"Resume builder & data": "area: builder",
			简历编辑与数据: "area: builder",
			"Templates, preview & export": "area: rendering",
			"模板、预览与导出": "area: rendering",
			"Accounts & sharing": "area: account",
			账号与分享: "area: account",
			"AI & Agent": "area: ai",
			"AI 与助手": "area: ai",
			"Language & localization": "area: localization",
			语言与中文界面: "area: localization",
			"Self-hosting": "area: self-hosting",
			自托管部署: "area: self-hosting",
			"API & integrations": "area: integrations",
			"API 与集成": "area: integrations",
			"Applications & cover letters": "area: applications",
			申请记录与求职信: "area: applications",
		},
	],
];

export function getIssueLabels(body) {
	return fields.flatMap(([headings, labels]) => {
		for (const heading of headings) {
			const answer = body.match(new RegExp(`^### ${heading}\\r?\\n\\r?\\n([^\\r\\n]+)$`, "m"))?.[1].trim();
			if (answer && Object.hasOwn(labels, answer)) return [labels[answer]];
		}
		return [];
	});
}

if (import.meta.main) {
	const issueBody = `### Product variant

Self-hosted

### Area

Templates, preview & export`;

	assert.deepEqual(getIssueLabels(issueBody), ["deployment: self-hosted", "area: rendering"]);
	assert.deepEqual(getIssueLabels("### Area\n\nOther / unsure"), []);
	assert.deepEqual(getIssueLabels("#### Area\n\nAI & Agent"), []);
	assert.deepEqual(getIssueLabels("prefix ### Area\n\nAI & Agent"), []);

	const chineseBody = `### 使用方式

在线站点（resume.afeiii.com）

### 涉及功能

账号与分享`;
	assert.deepEqual(getIssueLabels(chineseBody), ["deployment: cloud", "area: account"]);
	assert.deepEqual(getIssueLabels(chineseBody.replaceAll("\n", "\r\n")), ["deployment: cloud", "area: account"]);
	assert.deepEqual(getIssueLabels("### 使用方式\n\nCloud\n\n### Area\n\n语言与中文界面"), [
		"deployment: cloud",
		"area: localization",
	]);
	assert.deepEqual(getIssueLabels("### 使用方式\n\n自行部署\n\n### 涉及功能\n\n模板、预览与导出"), [
		"deployment: self-hosted",
		"area: rendering",
	]);
	assert.deepEqual(getIssueLabels("### 使用方式\n\n自行部署\n\n### 涉及功能\n\n其他或不确定"), [
		"deployment: self-hosted",
	]);
	assert.deepEqual(getIssueLabels("#### 涉及功能\n\nAI 与助手"), []);
	assert.deepEqual(getIssueLabels("前缀 ### 涉及功能\n\nAI 与助手"), []);
	assert.deepEqual(getIssueLabels("### 涉及功能\n\ntoString"), []);
	assert.deepEqual(getIssueLabels("### 涉及功能\n\n__proto__"), []);
	console.log("Issue label parsing checks: 13 passed.");
}
