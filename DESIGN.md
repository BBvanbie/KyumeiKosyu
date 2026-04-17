# KyumeiKosyu DESIGN.md

Airbnb の `DESIGN.md` を参考にした、このプロジェクト専用のデザインシステム。
目的は「旅行・予約体験のように、閲覧と決定が気持ちよく進む予約 UI」を一貫して作ること。

## 1. Visual Theme

- 白を主体にした、軽く、温かいキャンバス
- 主役は情報の流れとカード体験
- 予約システムであっても管理画面のように硬くしない
- アクセントは `#ff385c` のみを強く使う
- 情報量が増えても、余白と角丸で圧迫感を抑える

## 2. Color Tokens

```css
:root {
  --color-bg-page: #ffffff;
  --color-bg-subtle: #f7f7f7;
  --color-surface: #ffffff;
  --color-surface-muted: #f2f2f2;
  --color-text-primary: #222222;
  --color-text-secondary: #6a6a6a;
  --color-text-tertiary: #8b8b8b;
  --color-border-soft: #dddddd;
  --color-border-strong: #c1c1c1;
  --color-brand: #ff385c;
  --color-brand-pressed: #e00b41;
  --color-focus: rgba(255, 56, 92, 0.18);
  --shadow-card:
    rgba(0, 0, 0, 0.02) 0 0 0 1px,
    rgba(0, 0, 0, 0.04) 0 2px 6px,
    rgba(0, 0, 0, 0.1) 0 4px 8px;
  --shadow-hover: rgba(0, 0, 0, 0.08) 0 4px 12px;
}
```

## 3. Typography

- 見出しは warm, rounded, medium-to-bold
- 本文は読みやすさ優先
- 純黒は使わず `#222222`

```css
:root {
  --font-display: "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --font-body: "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --font-size-hero: clamp(2.25rem, 5vw, 4.4rem);
  --font-size-h1: 2rem;
  --font-size-h2: 1.4rem;
  --font-size-ui: 1rem;
  --font-size-body: 0.95rem;
  --font-size-small: 0.82rem;
}
```

ルール:

- 見出しは `500-700`
- 小さな UI ラベルにも軽すぎるウェイトを使わない
- 主要見出しは少し詰めた字間で親密さを出す

## 4. Radius & Spacing

```css
:root {
  --radius-button: 8px;
  --radius-badge: 14px;
  --radius-card: 20px;
  --radius-large: 32px;
  --radius-circle: 999px;

  --space-2: 2px;
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-24: 24px;
  --space-32: 32px;
  --space-40: 40px;
  --space-56: 56px;
}
```

ルール:

- カードは `20px`
- 大きい検索バーやヒーローは `32px`
- ナビやチップはピル型を優先

## 5. Core Components

### Header

- 白背景
- 下線か薄い境界で区切る
- 左にブランド、中央に検索、右に補助操作

### Search Bar

- 最重要コンポーネント
- `32px` radius
- 白背景
- 3層シャドウ
- CTA のみ `#ff385c`

### Buttons

- Primary: `#ff385c` 背景、白文字、`8px` radius
- Secondary: 白背景、濃い文字、薄い境界
- Ghost: 背景なし、hover で薄い surface

### Cards

- 白背景
- `20px` radius
- 3層シャドウ
- 情報は上から下へ自然に流す
- 画像付きなら画像を主役にする

### Inputs

- ピル型か soft rounded
- 境界は弱く、focus で赤系リング
- 密度より読みやすさ

## 6. Layout Principles

- セクション間に十分な余白を取る
- 情報は表よりカード優先
- 一覧は `1 → 2 → 3` 列に自然に拡張
- 画面全体を情報で埋めすぎない
- CTA は 1 セクションに 1 つ強いものを基本にする

## 7. Responsive Behavior

- Mobile: 1 列
- Tablet: 2 列
- Desktop: 3 列以上
- ヘッダーはモバイルで縦積み許容
- 検索バーは最優先で可読性を守る

## 8. Do

- `#222222` を本文基準に使う
- `#ff385c` は主 CTA と選択状態に限定する
- 大きい角丸と soft shadow を徹底する
- 予約関連 UI をカード体験として設計する
- 画像や空白を積極的に使い、圧迫感を避ける

## 9. Don't

- `#000000` を本文に使わない
- 赤を面で乱用しない
- 角の鋭いコンポーネントを作らない
- 重く濁ったシャドウを使わない
- 管理画面のような無機質な表中心 UI をデフォルトにしない
- 画面ごとに別の色体系や radius を持ち込まない
