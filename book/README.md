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

## 参照

- [O'Reilly Japan - 初めてのGraphQL](https://www.oreilly.co.jp/books/9784873118932/)
- [MoonHighway/learning-graphql: The code samples for Learning GraphQL by Eve Porcello and Alex Banks, published by O'Reilly Media](https://github.com/MoonHighway/learning-graphql)
