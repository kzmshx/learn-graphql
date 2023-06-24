# 初めてのGraphQL - Webサービスを作って学ぶ新世代API

https://www.oreilly.co.jp/books/9784873118932/

## メモ

### 1章 GraphQLへようこそ

- GraphQLは言語仕様であってライブラリとかフレームワークではないんだ
- GraphQL自体にはJavaScriptだとかReactだとかの制約はない
- RESTの「過剰な取得」「過小な取得」の問題はよく遭遇する、色んなページで異なるデータが必要で全部のユースケースに対応しようとしてレスポンスのロジックが複雑になったりは仕事でもよくある

### 2章 グラフ理論

- GraphQL使う上でグラフ理論の知識前提が必須かというとそうでもないんだな
- Neo4jのLTで、グラフデータベースがRDBよりも人間にとって分かりやすいクエリを書くことができる点が利点に挙げられてたな

### 3章 GraphQL問い合わせ言語

- GraphQLの言語仕様の簡単な解説
- フラグメントで選択セットの再利用ができるんだ
- サブスクリプションはFaceBookのために作りましたって感じ
- クエリの開発で柔軟にクエリを書けるんだなと感心しつつ、RDBのバックエンドがストレージなのに対して、GraphQLは特にバックエンドを規定してなくて、RESTや他のGraphQLがバックエンドにもなりえるとあった
- そうするとそれってどうやって実装するの感、パフォーマンスいかにもやばそう感
- GraphiQLとかGraphQL Playgroundはそういう単体のWebサービスがあるんじゃなくて、GraphQL APIの提供元がユーザーに提供できるお試しツールみたいな感じなのか、いいね

### 4章 スキーマの設計

- REST APIはエンドポイントの集合、GraphQL APIは型の集合
- PHPで`?string`でnullable stringみたいなのに慣れてるから、デフォルトでnullableで`!`付きだとnon-nullになるのが最初少し違和感があった
- カスタムスカラー型を作れて、型に対してバリデーションを実装できるの、いいね
- GraphQLでノードとノードをつなぐのは、RESTのURIでパスを繋いでいくのと感覚的には似ている、`/users/123/friends`みたいな感じで
- GraphQLの型は無向グラフにしておくのが望ましいとある、任意のノードを起点に他のノードをたどることができるからとある
- GraphQLは循環参照を定義できてしまうけど、実装上最終的にはJSONで返すのだとすると、JSONに循環参照はないので、実装どうなるんだろう
- 「スルー型」は初耳、型同士の多対多の関係において、それぞれの関係自体に意味（プロパティ）を持たせたいときに使う
- 「スルー型」の由来は、2つのノードをつなぐために通過（スルー）する経路になるから
- 含まれている複数の型がまったく異なる場合はユニオン型を、複数の型に共通のフィールドがある場合はインターフェース
- オプショナル引数が取れるのいい
- 任意のフィールドに引数を渡せるのいい
- 入力型で入力の型を再利用できるのいい
- ミューテーションはアプリケーションにおける動詞、実装したことないがRPCと同じ考え方？
- OpenAPIだとYAMLで書くけど、GraphQLはSDLで書くので、SDLの時点で可読性がOpenAPIよりも高い気がしていい

### 5章 GraphQLサーバーの実装

- カスタムスカラー型の定義には`parseLiteral`、`parseValue`、`serialize`の実装が必要
  - `parseLiteral`はクエリに直接追加された値を取得する
  - `parseValue`はクエリとともに送られてくる文字列をパースする
  - `serialize`はフィールド値を文字列に変換する
- `apollo-server-express`がDeprecatedになってるからと思って`@apollo/server`
  に移行したりしてたらめちゃめちゃ時間消費してしまった、耐えて本の指示通りにやるべきだった、Revertしてやり直す
- 簡素なAPIを一通り作ってみて、GraphQLは仕様に過ぎず、実際のAPIの実装は開発者に委ねられてることが分かった
- 現状は、InMemoryとMongoDBの2つのデータベースで簡易なAPIを実装しただけだからパフォーマンスの懸念とかセキュリティ上の懸念とか扱い方は全然見えてない
- JSをこねこねして無理やり作り通した感があるのでTypeScriptを導入したり、ファイル・ディレクトリ構成についても学んでいきたい

### 6章 GraphQLクライアントの実装

- `graphql-request`は`fetch`のGraphQL向けラッパー
- `create-react-app`を使うけど、pnpmを使いたいので工夫、記事を参考にした
  - [create-react-app with pnpm | DEV Community](https://dev.to/lico/set-up-create-react-app-using-pnpm-nji)
  - [React+TypeScript環境構築(pnpm用) | Zenn](https://zenn.dev/kage1020/articles/0dd1ecc13c78be)
- React環境でのeslint/prettierのセットアップ
  - [TypeScriptプロジェクトに3分でESLint/Prettierを入れる（2022年） | Zenn](https://zenn.dev/sumiren/articles/97e19ebcce8197)
  - [[React] ESLint - Reactでソースコードを分析してバグやエラーを探すため、ESLintを使う方法について説明します。](https://dev-yakuza.posstree.com/react/eslint/)
- `pnpm run start`で`toBeInTheDocument not a function`で怒られ詰んだ、pnpmだとなるらしい
  - [After seting up with pnpm, thne, when it runs, there is an error 'Property 'toBeInTheDocument' does not exist on type 'JestMatchers<HTMLElement>' in App.test.tsx · Issue #12622 · facebook/create-react-app | GitHub](https://github.com/facebook/create-react-app/issues/12622)
    で解決した、訳分からん、、。
- useQueryを使ってるのに状態が更新されなくなって困ったがChat-GPTに助けてもらった
  - [React Apollo StrictMode Issue | ChatGPT](https://chat.openai.com/share/94fa4b3e-88e7-412c-bdc2-cd9ffe806a76)
  - [Apollo Boost migration | Apollo GraphQL Docs](https://www.apollographql.com/docs/react/v2/migrating/boost-migration/)
  - [React + TypeScript: Apollo ClientのGraphQLクエリを使ってみる | Qiita](https://qiita.com/FumioNonaka/items/0c6b711627e3443ff73b)
- この本ではスキーマ設計、サーバー実装、クライアント実装の各章で「認証」「認可」について触れている。Web
  Frameworkの解説とかだったら認証はデファクトスタンダードな実装があってそんなに丁寧に解説されない気がする
  - GraphQLでは認証周りのそういったスタンダードがないのかな？
  - GraphQLはやはり仕様であって実装ではないので、認証周りは実装者に委ねられていそう。Apolloとかがそういった実装を提供しているライブラリ・フレームワークの1つという認識でいい？
  - でも、この本では丁寧に認証認可の実装を解説してるので学びがあっていい
- この本で新しいライブラリを入れて実装を増やすたびに、バージョンが新しくなって仕様が変わってて、本の内容を全然そのまま使えない、フロントエンド変化はやすぎ
- `react-apollo`、`apollo-boost`、`apollo-cache-persist`を使ってる箇所を`@apollo/client`、`apollo3-cache-persist`で書き直した、大変だった
  - でもそれまで微妙に動いてなかった箇所が動くようになった
  - 具体的には `useQuery` とか `useApolloClient` を使ってる部分でリアクティブが効かなくなってたのが直った
- useEffectの中で async/await を使う方法で迷った
  - [useEffectに非同期関数を設定する方法 | Zenn](https://zenn.dev/syu/articles/b97fb155137d1f)

### 7章 GraphQLの実戦投入にあたって

- この章で扱うトピック
  - リアルタイムのデータ更新
  - APIのセキュリティ
  - フロントエンドとバックエンドの分業
  - 漸進的なGraphQLへの移行
- WebSocketによるリアルタイムのデータ更新は、6章で試したポーリングによる更新とは別
  - WebSocket → TCPソケット上で全二重双方向通信
  - Polling → HTTPリクエストを定期的に送信してデータを取得
- Subscriptionの実装でまたしても本のコードが使えない
  - [Migrating to Apollo Server 3 | Apollo GraphQL Docs](https://www.apollographql.com/docs/apollo-server/v3/migration/)
    - 動いたけど `subscription-transport-ws` も deprecated になってる
- `apollo-server-express`から`PubSub`が取れない
  - [Subscriptions in Apollo Server | Apollo GraphQL Docs](https://www.apollographql.com/docs/apollo-server/v3/data/subscriptions#the-pubsub-class)
- Subscription の実装途中で、いよいよ本のコードと自分のコードの乖離が大きくなってきた
  - Subscriptionがサーバーの設定周り（Contextの扱い）で動かないが、ESMモジュールにもApolloライブラリにも詳しくなさすぎてデバッグが非常に困難
  - → サンプルコードの実装は一旦諦める
  - → でもサブスクリプションの実装例の意味は分かったし、挙動は実際に確かめていないが理解できた
- GraphQLのセキュリティ
  - リクエストタイムアウト
  - データ量制限
  - クエリ深度制限 `graphql-depth-limit`
  - クエリ複雑度（コスト）制限 `graphql-validation-complexity`
    - クエリの複雑度（コスト）を各フィールドに設定した複雑度の合計でとらえる手法、おもろい
  - パフォーマンス監視
    - Apollo Engine
      - GraphQLは柔軟性のかわりにパフォーマンスの問題が発生しやすい（予測がしづらい）ので監視体制を整えるのは他の手法よりも重要そう
- 発展的な内容
  - Schema Stitching
  - **Prisma**
    - データベースによらず、既存のデータベースをGraphQL APIに変えるツール、どゆことだ？
  - AWS AppSync

### Relay

- React+GraphQLでのフロントエンド開発のためのライブラリ
- Relayを便利にするために、GraphQLスキーマの仕様を追加している
  - Global Object Identification
    - 全データを共通IDで一意に識別 → 再取得を容易に
    - すごい運用大変そう
    - 技術書典は `TableName:ID` で一意に識別してる
    - GitHubは `IdSpecVersion:ResouceName:ID` で一意に識別してるっぽい
  - Cursor Connections
    - ページング手法
    - メリット
      - 幅広いDBにおいて実装可能
      - 取得予定のリソースの数が事前に計算可能になる → データ量制限が容易になる
  - Input Object Mutations
  - Mutation Updater
    - Mutationによるデータ変更時に、サーバー側で変更したデータのIDをレスポンスで返すことで、クライアント側がデータ変更を検知し、キャッシュの更新等を行うことができる

## 感想

- 分量が多くなくて読みやすかった
- GraphiQLとかGraphQL Playgroundとか、APIを触るためのツールが充実してるのがいい
- 本ではJavaScript/Express/React/Apolloの構成だったが、GraphQLは「仕様」である分、開発生産性はプログラミング言語とかライブラリの完成度に左右される部分も大きそうだと思った
  - 果たしてPHPで快適に使えるのか、、、？
  - Goの[gqlgen](https://gqlgen.com/)が快適さでは最高峰っぽいので触ってみよう
- スキーマ駆動開発の次元がRESTとは違うので早く試したい
- 本のコードが古くなっているのがしんどかった
  - JS界隈は進化が早いので障壁を避けるならちゃんとバージョン揃えないとだめだ、反省した
  - JSのモジュール関連の機能をもう少し理解深めて使いこなせるようになりたい
- Apollo、RelayにはGraphQLを実際に運用する上での課題とその解決策が詰まってそうなので深掘りしていきたい
- 本が古くなっているのでライブラリ、ツールなどの動向に変化がないかも見ていきたい

## 参照

- [MoonHighway/learning-graphql: The code samples for Learning GraphQL by Eve Porcello and Alex Banks, published by O'Reilly Media](https://github.com/MoonHighway/learning-graphql)
