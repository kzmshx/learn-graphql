# [End-To-End Type-Safety with GraphQL, Prisma & React](https://www.prisma.io/blog/series/e2e-typesafety-graphql-react-yiw81oBkun)

## メモ

### Part 1: Frontend

- Viteでプロジェクト作るんだ
  - [はじめに | Vite](https://ja.vitejs.dev/guide/)
  - Viteを「ヴィート」と読むのを初めて知った
- Tailwind CSSが最近人気なのは知ってるが初めて使う
  - [Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.](https://tailwindcss.com/)
- デザイン、デザイン実装の経験がないのでBranchコンポーネントの実装見てすごいなぁと思ったり

### Part 2: API Prep

- RailwayでDBをプロビジョニングするまでが速すぎてびっくり
- Prismaのスキーマで、あるモデルから別のモデルを参照するコードを書いたら、自動的にもう一方のスキーマのコードが全部補完された、すごい

### Part 3: GraphQL API

- GraphQLのスキーマ定義のアプローチには「Code-first」と「SDL-first」がある
  - 鷲本でやったのは「SDL-first」
  - この記事は「Code-first」を採用していて、そのためのツールが `Pothos`
- 鷲本でも言及されてた `graphql-scalars` をこの記事では使っていく
- PrismaとPothosの連携で色んなことがスムーズにできるようになってるんだろうことは分かるんだが、手を動かす部分が少なすぎて何が起きてるのか今のところさっぱり分からん

### Part 4: Codegen & Deployment

- バックエンドとフロントエンドの型定義の同期の全体的なフローは
  - Prismaがデータベーススキーマに基づいて型を生成する
  - PothosがPrismaが生成した型を利用し、GraphQLスキーマを生成しAPIを公開する
  - GraphQL CodegenがAPIのGraphQLスキーマを読み、フロントエンドのための型を生成する
