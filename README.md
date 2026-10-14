<h1 align="center">十三月简历</h1>

<p align="center">
免费的在线简历制作工具 —— 编辑经历、选择模板、保存简历、导出 PDF。
<br />
<a href="https://resume.afeiii.com"><strong>立即使用 resume.afeiii.com »</strong></a>
</p>

## 这是什么

十三月简历（[resume.afeiii.com](https://resume.afeiii.com)）是一款中文在线简历工具，支持从零创建简历，也可以导入已有内容继续编辑。

本项目基于 [Reactive Resume](https://github.com/reactive-resume/reactive-resume) **v6.0.3** 进行中文品牌与站点定制，保留原作者署名和 MIT 许可证。

仓库默认分支为 [`brand/thirteen-month-v6`](https://github.com/bigzhihui/reactive-resume/tree/brand/thirteen-month-v6)，日常定制修改在该分支完成。

![十三月简历中文首页，包含源码入口和简历预览](docs/images/thirteen-month-resume/homepage.png)

截图来自本站首页，预览中的人物与经历为演示内容。

## 主要功能

| 分类       | 功能                                                                                                                                                                                      |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 简历编辑   | 个人资料、教育经历、工作经历、项目、技能、自定义栏目与自动保存                                                                                                                            |
| 模板与排版 | 17 个模板、字体、配色、间距、单双栏、A4 与 Letter 纸张                                                                                                                                    |
| 导入与导出 | 导入已有简历，导出 PDF、Word、OpenDocument（ODT）、Markdown 与 JSON；具体格式和可选依赖见[导入说明](docs/guides/importing-resumes.mdx)与[导出说明](docs/guides/exporting-your-resume.mdx) |
| 检查与分享 | ATS 可读性检查、关键词匹配、私有或公开简历、分享链接与密码保护                                                                                                                            |
| 求职管理   | 求职信、申请记录、文档版本与回收站                                                                                                                                                        |
| 账号与邮件 | 邮箱注册、验证邮件、密码重置与账号管理                                                                                                                                                    |
| 可选 AI    | 使用用户自行连接的服务商与 API Key，辅助修改措辞、检查简历和准备求职材料                                                                                                                  |

基础简历编辑、模板与 PDF 导出免费。AI 功能需要独立配置服务商，相关用量可能由服务商收费。

## 相比上游的改动

- **中文默认界面**：默认使用简体中文，站名、首页介绍、SEO 信息与账号邮件使用“十三月简历”。
- **本站源码入口**：首页、页脚和设置页指向本仓库的定制分支，不展示上游项目的星数作为本站统计。
- **本站隐私说明**：提供独立的[隐私说明](https://resume.afeiii.com/privacy)，说明账号、简历、文件、邮件与可选 AI 的数据处理。
- **统一支持联系**：使用 [support@afeiii.com](mailto:support@afeiii.com) 处理本站问题，账号邮件配置对应的 Reply-To。
- **Docker 定制镜像**：从本分支源码构建，适配本站的 Oracle ARM64 部署。

## 数据与隐私

- 账号、保存的简历、求职记录与文档版本会存储在本站服务器的 PostgreSQL 数据库中；头像等上传文件保存在服务器的持久化文件存储中。
- 私有简历需要登录访问。公开分享或设置分享密码前，请检查简历中需要展示的信息。
- 本站通过 Resend 投递账号验证和密码重置邮件。收件地址与邮件内容会用于完成投递，账号邮件不会包含简历正文。
- 使用可选 AI 时，相关输入会发送给所连接的服务商；请根据服务商政策决定提供哪些内容。
- 完整说明与联系入口见[本站隐私说明](https://resume.afeiii.com/privacy)。

## 本地开发

环境要求：**Node.js 24、pnpm 12.11.2、Docker 与 Docker Compose**。

```sh
git clone --branch brand/thirteen-month-v6 https://github.com/bigzhihui/reactive-resume.git
cd reactive-resume

npm install --global pnpm@12.11.2
pnpm install --frozen-lockfile
cp .env.example .env.local
```

编辑 `.env.local`，为本机运行调整数据库和存储配置：

```dotenv
APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
STORAGE_BACKEND="local"
REDIS_URL=""
```

另行生成并填写 `AUTH_SECRET`；需要保存 AI 服务商配置时，也要填写独立的 `ENCRYPTION_SECRET`。可以分别运行 `openssl rand -hex 32` 生成，两者应使用不同值并保持稳定。`.env.local` 仅用于本机配置。

```sh
docker compose -f compose.dev.yml up -d postgres
pnpm dev
```

打开 <http://localhost:3000>。开发服务包含前端 `3000`、后端 `3001` 和邮件模板预览 `3002`。

常用命令：

```sh
pnpm build          # 生产构建
pnpm typecheck      # TypeScript 类型检查
pnpm lint:agent     # 代码规范检查
pnpm format:check   # 格式检查
pnpm test           # 工作区测试
```

更详细的结构和环境配置见[开发说明](docs/contributing/development.mdx)与[项目架构](docs/contributing/architecture.mdx)。

## Docker 部署

部署定制版时，从本分支构建镜像：

```sh
cp .env.example .env
# 编辑 .env：填写实际 APP_URL、认证密钥，以及需要启用的邮件和存储配置。
docker compose up -d --build
```

根目录 `compose.yml` 提供应用、PostgreSQL、Redis 和 SeaweedFS 的通用自托管示例。数据库、文件存储与必要密钥需要持久化；根据实际域名配置 HTTPS。

本站生产采用 **Oracle Cloud ARM64 + Docker + PostgreSQL 17 + 本地文件存储**，通过 **Caddy** 提供 HTTPS。应用仅监听服务器回环地址，数据库端口不向公网开放。邮件通过 Resend SMTP 发送。

单实例可使用本地文件存储，Redis 为可选组件。选择本地存储时设置 `STORAGE_BACKEND=local`，持久化 `/app/data`，并确保容器用户有读写权限。v6 的 PDF 生成使用 Forme，无需 Browserless 或独立浏览器打印服务。

Docker Hub 的 `amruthpillai/reactive-resume` 和 GHCR 的 `reactive-resume/reactive-resume` 属于上游官方镜像。部署本仓库的品牌定制时，请构建本分支源码。

完整自托管说明见[上游 Docker 文档](docs/self-hosting/docker.mdx)。旧版本迁移步骤见[升级至 v6](docs/self-hosting/upgrading-to-v6.mdx)。

### 仓库工作流

- 日常检查已覆盖 `brand/thirteen-month-v6` 分支。
- Docker 镜像发布通过 Actions 的 **Publish Docker Image** 手动触发，目标为本仓库的 GHCR；配置自己的 Docker Hub 登录后，也可以推送到对应的 `bigzhihui/reactive-resume` 镜像地址。
- 默认分支上的普通手动构建生成提交 SHA 镜像；选择 `release` 会发布该 SHA 已构建的镜像，应先完成对应提交的构建。
- 镜像发布流程只发布镜像；本站应用由独立的服务器部署流程更新。
- 上游 Crowdin 同步仅在上游仓库执行。Cloudflare 与 Vercel 兼容检查在本定制仓库按需手动运行。

## 技术栈

React 19、TanStack Router、Vite、TypeScript、Hono、Node.js 24、pnpm、Turborepo、PostgreSQL、Drizzle ORM、Better Auth、Tailwind CSS、Lingui 与 Forme。

## 反馈与交流

发现本站问题或有功能建议，欢迎提交 [Issue](https://github.com/bigzhihui/reactive-resume/issues)，也可通过 [support@afeiii.com](mailto:support@afeiii.com) 联系。

反馈时请提供页面、版本、浏览器和复现步骤，并移除个人简历内容、密码、邮件操作链接与 API Key。安全问题请通过邮箱私下反馈，详见[安全联系说明](SECURITY.md)。

## 上游文档与致谢

本项目基于 [Amruth Pillai](https://amruthpillai.com) 与[开源贡献者](https://github.com/reactive-resume/reactive-resume/graphs/contributors)共同维护的 [Reactive Resume](https://github.com/reactive-resume/reactive-resume)。感谢原作者与社区的工作。

- [上游完整文档](https://docs.rxresu.me)
- [v6 功能说明](docs/guides/whats-new-in-v6.mdx)
- [上游使用说明](https://github.com/reactive-resume/reactive-resume/blob/v6.0.3/README.md)
- [支持上游作者](https://github.com/sponsors/AmruthPillai)

## 开源协议

本项目遵循 [MIT](LICENSE) 许可证，保留原作者版权与许可声明。
