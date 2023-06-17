# 初めてのGraphQL - Webサービスを作って学ぶ新世代API

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

## 参照

- [O'Reilly Japan - 初めてのGraphQL](https://www.oreilly.co.jp/books/9784873118932/)
- [MoonHighway/learning-graphql: The code samples for Learning GraphQL by Eve Porcello and Alex Banks, published by O'Reilly Media](https://github.com/MoonHighway/learning-graphql)
