# Agent Guide

このファイルは、KyumeiKosyu プロジェクトで Codex が迷わず作業するための運用ガイドです。
対象は React + TypeScript ベースの予約システム開発です。

## 目的

- skill の選択を毎回迷わないようにする
- 実装の順番と判断基準を固定する
- 無関係な変更や品質低下を防ぐ

## このプロジェクトで相性の良い skill

中核として使う skill:

- `brainstorming`
- `writing-plans`
- `frontend-design`
- `vercel-react-best-practices`
- `e2e-testing`
- `web-design-guidelines`

補助的に使う skill:

- `tailwind-design-system`
- `ui-ux-pro-max`
- `visual-explainer`
- `find-skills`

## デザイン運用ルール

- UI 実装時は必ずルートの `DESIGN.md` を参照する
- デザイン方針は `Airbnb inspired booking system`
- 白ベース、単一赤アクセント、大きい角丸、3 層シャドウを全画面で維持する
- 新しい画面やコンポーネントは、まず既存トークンで表現できるかを優先して考える
- 独自の色や radius を追加するときは、既存トークンで表現できない理由が必要
- 予約 UI は表よりカードを優先し、閲覧しやすさを落とさない
- 重要導線の CTA は 1 セクションに 1 つを原則にし、赤を乱用しない
- 新規 UI 実装では `frontend-design` を前提にし、仕上げで `web-design-guidelines` を使う

## skill の役割

### `brainstorming`

使う場面:

- 新機能追加前
- 画面構成を変える前
- 挙動変更を伴う実装前

役割:

- 要件整理
- 制約確認
- 選択肢の比較
- 設計の合意形成

ルール:

- いきなり実装に入らない
- 方針が曖昧なままコードを書かない

### `writing-plans`

使う場面:

- 実装対象が複数ステップに分かれるとき
- 画面、状態管理、API、テストが絡むとき

役割:

- 実装作業を小さく分解する
- 触るファイルと検証方法を明確にする

ルール:

- 実装前に計画を書く
- 大きい変更は一気に進めず、段階化する

### `frontend-design`

使う場面:

- 新しい画面を作るとき
- 既存画面の UI を改善するとき

役割:

- 予約システムに必要な画面を、安っぽくない UI で実装する
- レイアウト、配色、タイポグラフィ、レスポンシブ対応を整える

ルール:

- 汎用テンプレートのような無個性な UI にしない
- 既存の見た目と整合しないデザインを持ち込まない

### `vercel-react-best-practices`

使う場面:

- React 実装を追加、修正、レビューするとき
- パフォーマンスや構成を見直すとき

役割:

- React の設計品質を保つ
- 不要な複雑化を防ぐ
- 状態や描画の責務を適切に分ける

ルール:

- `useMemo` や `useCallback` を惰性で増やさない
- 必要のない抽象化をしない

### `e2e-testing`

使う場面:

- 予約作成、編集、確認、キャンセルなどの導線を追加したとき
- ログインや画面遷移を含む重要導線を変更したとき

役割:

- 実際の利用フローが壊れていないことを確認する
- 重要導線に対する回帰テストを作る

ルール:

- 重要導線の変更をテストなしで終わらせない
- セレクタは安定したものを使う

### `web-design-guidelines`

使う場面:

- 画面実装のあと
- UI/UX の品質確認をしたいとき

役割:

- アクセシビリティ
- 可読性
- 一貫性
- 操作性

ルール:

- 見た目だけで完了と判断しない
- フォームやナビゲーションの操作性を必ず見る

## 標準フロー

新しい機能を実装するときは、原則として次の順で進める。

1. `brainstorming`
要件、制約、成功条件、選択肢を整理する。

2. 設計確定
何を作るか、何を作らないかを明確にする。

3. `writing-plans`
実装を小さなタスクに分解する。

4. 実装
UI を含む場合は `frontend-design` を優先する。
React 実装の構成判断には `vercel-react-best-practices` を併用する。

5. テスト
単体確認に加えて、重要導線は `e2e-testing` を使う。

6. UI/UX レビュー
必要に応じて `web-design-guidelines` で見直す。

## 典型的な使い分け

### 画面を 1 つ追加するとき

- `brainstorming`
- `writing-plans`
- `frontend-design`
- `vercel-react-best-practices`
- 必要なら `web-design-guidelines`

### 予約フローを追加するとき

- `brainstorming`
- `writing-plans`
- `frontend-design`
- `vercel-react-best-practices`
- `e2e-testing`
- 必要なら `web-design-guidelines`

### UI だけを改善するとき

- `brainstorming`
- `frontend-design`
- `web-design-guidelines`

### 実装方針に迷うとき

- まず `brainstorming`
- 既存 skill で足りないなら `find-skills`

## 実装時の基本ルール

- いきなり大きなコード変更を始めない
- 先に目的、範囲、完了条件を明確にする
- 既存構成と整合する形で追加する
- 1 回の変更で責務を増やしすぎない
- 小さく実装して、小さく確認する
- 変更後は `lint`、`build`、`test` を可能な範囲で通す
- UI 変更はデスクトップとモバイルの両方を意識する
- 予約システムの重要導線は常に利用者目線で確認する

## 禁止事項

- 未整理の要件のまま実装を始めること
- 無関係な依存関係を追加すること
- ユーザーの依頼範囲を超えて大規模リファクタを行うこと
- 既存デザインの文脈を無視して UI を壊すこと
- 重要導線を変更したのに検証を省略すること
- 必要性の薄い抽象化や最適化を増やすこと
- 動いている既存コードを根拠なく作り直すこと

## 完了条件

作業完了と見なすには、少なくとも次を満たすこと。

- 目的に対する実装が入っている
- 変更範囲が依頼内容に収まっている
- 必要な skill の流れに沿っている
- 実行できる検証を済ませている
- 残課題があれば明示している

## このプロジェクトでのデフォルト判断

- 新規機能はまず `brainstorming` から始める
- 複数ファイルにまたがるなら `writing-plans` を使う
- 画面実装は `frontend-design` を優先する
- React の設計判断は `vercel-react-best-practices` を基準にする
- 予約導線の変更では `e2e-testing` をほぼ必須とする
- UI 完成後は `web-design-guidelines` で点検する
