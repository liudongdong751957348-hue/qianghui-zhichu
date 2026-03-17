# 墙绘直出

面向墙绘公司、文旅项目方、乡村改造团队的墙绘提案工作台。

当前第一阶段已经完成这些链路：

- 首页演示与案例化展示
- 生成页上传现场图并生成提案
- 结果页提案展示、快捷微调、模板切换重出、版本对比
- 导出提案页
- 项目提交与回执页
- 邮件 / 飞书 / 企业微信通知
- 内部线索工作台 `/inquiries`
- 线索页最小可用访问保护

---

## 1. 项目结构与当前能力

主要页面：

- `/` 首页与产品演示
- `/generate` 生成提案
- `/result` 提案结果页
- `/proposal-export` 导出提案页
- `/cases` 案例演示总览
- `/submit-project` 项目提交入口
- `/inquiries` 内部线索工作台

主要服务层：

- `services/proposal-*`：提案生成、微调、模板与 provider
- `services/project-inquiry-*`：项目提交、本地保存、通知投递、线索读取与状态更新

---

## 2. 本地运行方式

### 2.1 安装依赖

```bash
/usr/local/bin/npm install
```

### 2.2 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env.local
```

本地最小可用配置建议：

1. 配置 `INQUIRY_ACCESS_PASSWORD`
2. 配置 `INQUIRY_ACCESS_COOKIE_SECRET`
3. 保持：

```bash
PROPOSAL_SERVICE_MODE=mock
PROPOSAL_PROVIDER=mock
```

这样可以本地跑通：

- 首页
- 生成提案 mock 流程
- 提交项目
- 本地保存线索
- `/inquiries` 权限保护

### 2.3 启动开发环境

```bash
/usr/local/bin/npm run dev
```

默认访问：

- 首页：[http://localhost:3000](http://localhost:3000)
- 线索工作台：[http://localhost:3000/inquiries](http://localhost:3000/inquiries)

### 2.4 本地验收命令

```bash
/usr/local/bin/npm run lint
/usr/local/bin/npm run build
```

---

## 3. 环境变量说明

请优先查看 [.env.example](/Users/qingshanyun/Desktop/codex/.env.example)。

### 3.1 必填

用于内部线索页保护：

- `INQUIRY_ACCESS_PASSWORD`
- `INQUIRY_ACCESS_COOKIE_SECRET`

如果不配置：

- `/inquiries` 无法进入
- 页面会提示尚未配置内部访问口令

### 3.2 启用真实 OpenAI 能力时必填

- `OPENAI_API_KEY`

如果当前只跑 mock：

- 可以不填 OpenAI 相关变量
- `PROPOSAL_SERVICE_MODE=mock`
- `PROPOSAL_PROVIDER=mock`

### 3.3 可选：OpenAI 高级配置

- `OPENAI_BASE_URL`
- `OPENAI_IMAGE_MODEL`
- `OPENAI_IMAGE_EDIT_MODEL`
- `OPENAI_SUMMARY_MODEL`
- `OPENAI_IMAGE_SIZE`
- `OPENAI_IMAGE_QUALITY`
- `OPENAI_IMAGE_INPUT_FIDELITY`

不配时会走代码默认值。

### 3.4 可选：邮件通知

- `PROJECT_INQUIRY_SMTP_HOST`
- `PROJECT_INQUIRY_SMTP_PORT`
- `PROJECT_INQUIRY_SMTP_SECURE`
- `PROJECT_INQUIRY_SMTP_USER`
- `PROJECT_INQUIRY_SMTP_PASS`
- `PROJECT_INQUIRY_NOTIFY_TO`
- `PROJECT_INQUIRY_NOTIFY_FROM`

不配时：

- 项目提交仍成功
- 本地线索仍保存
- 回执页显示“邮件通知未配置，已跳过发送”

### 3.5 可选：飞书通知

- `PROJECT_INQUIRY_FEISHU_WEBHOOK_URL`

不配时会自动跳过，不影响主流程。

### 3.6 可选：企业微信通知

- `PROJECT_INQUIRY_WECOM_WEBHOOK_URL`

不配时会自动跳过，不影响主流程。

### 3.7 安全原则

以下变量都只应在服务端配置，不应暴露到前端：

- OpenAI 相关变量
- SMTP 相关变量
- 飞书 / 企业微信 webhook
- 内部访问口令与 cookie secret

---

## 4. Vercel 部署方式

### 4.1 创建项目

1. 将仓库推到 Git 平台
2. 在 Vercel 导入项目
3. Framework 选择 `Next.js`

### 4.2 配置环境变量

在 Vercel 项目设置中添加 `.env.example` 里的变量。

建议至少先配：

- `INQUIRY_ACCESS_PASSWORD`
- `INQUIRY_ACCESS_COOKIE_SECRET`

如果要上线真实提案能力，再补：

- `OPENAI_API_KEY`

如果要启用通知，再补：

- SMTP 变量
- 飞书 webhook
- 企业微信 webhook

### 4.3 构建命令

默认即可：

- Install Command: `npm install`
- Build Command: `npm run build`
- Output: Next.js 默认输出

### 4.4 部署前建议

至少先在 Preview 或本地确认：

- 提交项目能成功写入线索
- `/inquiries` 会拦截未授权访问
- 通知通道按预期发送或明确跳过

---

## 5. 通知通道验证方式

### 5.1 邮件通知验证

1. 配好 SMTP 变量
2. 提交一条测试项目
3. 检查收件邮箱是否收到结构化通知
4. 回执页应显示“邮件通知：已发送”

如果失败：

- 先检查主机、端口、账号、密码
- 再检查 `PROJECT_INQUIRY_NOTIFY_TO`
- 若仍失败，回执页会显示“邮件通知发送失败，项目资料已成功保存”

### 5.2 飞书通知验证

1. 在飞书群配置机器人 webhook
2. 将 webhook 填到 `PROJECT_INQUIRY_FEISHU_WEBHOOK_URL`
3. 提交测试项目
4. 检查飞书群是否收到结构化消息

如果没配：

- 回执页会显示“飞书通知未配置，已跳过发送”

### 5.3 企业微信通知验证

1. 在企业微信群配置机器人 webhook
2. 将 webhook 填到 `PROJECT_INQUIRY_WECOM_WEBHOOK_URL`
3. 提交测试项目
4. 检查企业微信群是否收到 markdown 消息

如果没配：

- 回执页会显示“企业微信通知未配置，已跳过发送”

### 5.4 通知失败时的原则

无论邮件、飞书还是企业微信是否发送成功：

- 项目提交都不会失败
- 本地线索仍然会保存
- 线索工作台仍然可查看

---

## 6. /inquiries 权限保护配置方式

当前采用“单密码 + 服务端 HttpOnly cookie”的最小保护方案。

### 6.1 需要配置

- `INQUIRY_ACCESS_PASSWORD`
- `INQUIRY_ACCESS_COOKIE_SECRET`

### 6.2 使用方式

1. 访问 `/inquiries`
2. 输入内部访问口令
3. 验证通过后，当前浏览器会写入访问 cookie
4. 在 cookie 有效期内可继续查看和更新线索状态

### 6.3 退出方式

线索工作台页面内有“退出内部访问”按钮，会清掉当前 cookie。

### 6.4 当前保护范围

- `/inquiries` 页面入口
- `GET /api/project-inquiries`
- `PATCH /api/project-inquiries/[id]`

### 6.5 后续升级点

如果未来要升级到正式登录体系，优先替换这些位置：

- [lib/inquiry-auth.ts](/Users/qingshanyun/Desktop/codex/lib/inquiry-auth.ts)
- [app/api/inquiries/session/route.ts](/Users/qingshanyun/Desktop/codex/app/api/inquiries/session/route.ts)
- [app/inquiries/page.tsx](/Users/qingshanyun/Desktop/codex/app/inquiries/page.tsx)

---

## 7. 生产自检清单

上线前建议按以下顺序逐项检查：

1. 首页访问正常，按钮与案例入口可点击
2. 生成提案可正常提交，mock 或 real 模式按预期运行
3. 结果页正常展示，快捷微调、模板切换、版本对比可使用
4. 导出提案页可打开，浏览器打印 / 导出 PDF 正常
5. 提交项目页可正常提交，并生成回执编号
6. 邮件通知按预期发送，或明确显示“未配置 / 失败但已保存”
7. 飞书通知按预期发送，或明确显示“未配置 / 失败但已保存”
8. 企业微信通知按预期发送，或明确显示“未配置 / 失败但已保存”
9. `/inquiries` 未授权时会被拦截
10. `/inquiries` 授权后可正常查看线索列表
11. 线索详情可查看完整资料与通知状态
12. 线索状态更新可写回并刷新显示
13. `npm run lint` 通过
14. `npm run build` 通过

---

## 8. 缺省配置与错误说明

### 未配置 OpenAI

表现：

- 提案生成继续可用，但应保持在 mock 模式

处理：

- 确认 `PROPOSAL_SERVICE_MODE=mock`
- 或补齐 `OPENAI_API_KEY`

### 未配置邮件 / 飞书 / 企业微信

表现：

- 提交项目成功
- 本地线索保存成功
- 回执页显示对应通知“未配置，已跳过发送”

处理：

- 补齐对应变量后重新提交通知测试

### 未配置线索访问口令

表现：

- `/inquiries` 无法正常进入工作台

处理：

- 配置 `INQUIRY_ACCESS_PASSWORD`
- 配置 `INQUIRY_ACCESS_COOKIE_SECRET`

### 通知发送失败

表现：

- 回执页显示失败说明
- 线索仍在工作台中可见

处理：

- 先确认本地保存成功
- 再分别检查 SMTP、飞书 webhook、企业微信 webhook

---

## 9. 建议的第一阶段交付方式

第一阶段建议按下面方式交付：

1. 默认以 mock 模式部署，确保产品链路稳定
2. 先启用项目提交、通知和线索工作台
3. 内部通过 `/inquiries` 管理线索
4. 视试单情况再逐步开启真实 OpenAI 能力

这能保证“墙绘直出”先成为一个可演示、可留资、可跟进、可交付的第一阶段产品。
