# 梗语者 · Emoji Decoder

> 看 emoji，说人话。同一个 emoji，不同的脑回路。

纯前端的多人同屏派对小游戏，使用 **React + TypeScript + Vite** 构建。没有后端、没有登录，开一局就能玩。

## 技术栈

- React 19
- TypeScript 5
- Vite 6
- 原生 CSS / Canvas / Web Audio，无 UI 框架、无外部字体和图片资源

## 本地运行

```bash
npm install
npm run dev
```

打开 <http://127.0.0.1:5173/>（或终端输出的地址）。

```bash
npm run build      # TypeScript 检查 + 生产构建
npm run preview    # 预览 dist
npm run typecheck  # 只做类型检查
```

## 玩法

1. 输入 1–6 位玩家昵称，开始一局。
2. 每局随机抽 8 道 emoji 题，难度逐轮递增。
3. 玩家按顺序轮流作答，提交后答案立即封存，后面的人看不到。
4. 全员答完统一开奖：关键词命中越多分越高，完全跑偏也有参与分。
5. 8 题后按总分排名，生成可保存、可分享的战报图片。

## 功能

- 30 道内置题库，每局抽 8 道，按「3 热身 + 3 脑洞 + 2 高阶」组卷
- 1–6 人同屏轮流作答，每轮轮换首发玩家
- 答案封存 + 交接遮罩，防止后手偷看
- 关键词 + 编辑距离相似度评分，满分 100
- 开奖页逐条动画、本轮最高分高亮、参考答案展示
- 最终排名、神来一笔、Canvas 战报卡片
- 移动端适配，输入框 16px+，按钮触控友好
- 本地记忆玩家昵称与音效开关
- 系统字体 + 原生 Web Audio，无任何外部资源请求

## 评分规则

- 文本先做 NFKC、小写、去标点空格归一化。
- 玩家答案命中标准答案的 3 个不同关键词，即可拿满关键词分；命中 1–2 个按比例给分。
- 与标准答案的编辑距离相似度最多加 10 分。
- 和任一标准答案完全一致时直接 100 分。
- 没有命中任何关键词时，按题目保底分给 25–26 分，避免挫败。
- 少于 2 个字不计分，提交时也会被拦下。

## 目录结构

```text
.
├── index.html                 # Vite HTML 入口
├── package.json
├── vite.config.ts             # base: './'，适配 GitHub Pages 子路径
├── tsconfig.json
├── public/
│   └── .nojekyll
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages 自动构建部署
└── src/
    ├── main.tsx
    ├── App.tsx                # 游戏状态机、计时器与流程编排
    ├── styles.css
    ├── components/            # 开始页 / 作答页 / 开奖页 / 结算页 / 浮层
    └── game/
        ├── questions.ts       # 30 道题库
        ├── scoring.ts         # 归一化、关键词、Levenshtein 评分
        ├── game.ts            # 抽题与排名
        ├── shareCard.ts       # Canvas 战报绘制
        ├── sound.ts           # Web Audio 音效
        ├── storage.ts
        ├── constants.ts
        └── types.ts
```

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。推送 `main` 分支后：

1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **GitHub Actions**。
3. 等待 Actions 完成，访问 `https://<用户名>.github.io/<仓库名>/`。

工作流会执行 `npm ci`、`npm run build`，并把 `dist/` 发布为 Pages 站点。Vite 的 `base` 已设为相对路径，项目页和用户页都能正常加载资源。

## 说明

Emoji 由系统字体渲染，画面中的颜色和字形可能随设备略有差异。游戏不收集任何数据，昵称和音效偏好只保存在浏览器 `localStorage` 中。
