# お弁当考えるアプリ - 設計文書

## アーキテクチャ概要

### レイヤー構造
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (React Native Components + Hooks)  │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│    (お弁当提案ロジック・評価計算)    │
├─────────────────────────────────────┤
│          Data Layer                 │
│  (AsyncStorage + Context/Reducer)  │
└─────────────────────────────────────┘
```

## データモデル

### 食材（Ingredient）
```typescript
interface Ingredient {
  id: string;
  name: string;
  category: 'main' | 'side' | 'vegetable' | 'fruit' | 'other';
  color: 'red' | 'yellow' | 'green' | 'white' | 'brown' | 'black';
  nutrition: {
    vitamin: number;  // 0-100
    protein: number;  // 0-100
    fiber: number;    // 0-100
  };
  cookingTime: number;  // 分
  cost: number;         // 円
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  isFrozen: boolean;    // 冷凍食品フラグ
  isReadyToEat: boolean; // そのまま詰められるフラグ
  defaultSize: { width: number; height: number }; // デフォルトサイズ
  icon: string;         // SVGパスまたは簡易図形データ
}
```

### お弁当箱（BentoBox）
```typescript
interface BentoBox {
  id: string;
  type: 'rectangle' | 'oval' | 'double'; // 将来的に拡張
  dimensions: { width: number; height: number };
  partitions: Partition[];
}

interface Partition {
  id: string;
  type: 'rice' | 'side';
  bounds: { x: number; y: number; width: number; height: number };
}
```

### 配置済み食材（PlacedIngredient）
```typescript
interface PlacedIngredient {
  id: string;
  ingredientId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  partitionId: string;
}
```

## 画面構成

### 1. メイン画面（BentoDesigner）
- 上部：お弁当箱表示エリア（ドラッグ＆ドロップ対応）
- 中部：食材リスト（横スクロール）
- 下部：アクションボタン（提案を受ける、クリア、保存※将来実装）

### 2. 提案画面（SuggestionModal）
- 評価軸選択
- 提案表示
- 採用/次の提案/キャンセルボタン

### 3. 食材追加画面（AddIngredientModal）
- 食材情報入力フォーム
- プレビュー表示

## 主要コンポーネント

### コンポーネント階層
```
App
├── BentoDesigner
│   ├── BentoBoxCanvas
│   │   ├── PartitionArea
│   │   └── PlacedIngredientItem (ドラッグ可能)
│   ├── IngredientList
│   │   └── IngredientItem (ドラッグ元)
│   └── ActionBar
├── SuggestionModal
│   ├── CriteriaSelector
│   └── SuggestionDisplay
└── AddIngredientModal
```

## ドラッグ＆ドロップ実装

### 使用ライブラリ
- `react-native-gesture-handler`: ジェスチャー検出
- `react-native-reanimated`: スムーズなアニメーション

### 実装方針
1. PanGestureHandlerで食材のドラッグを検出
2. Animated.Viewでスムーズな移動を実現
3. ドロップ時に配置可能エリアを判定
4. 既存食材との入れ替えロジック（パズドラ風）

## 提案アルゴリズム

### 評価軸ごとのスコア計算

#### 速さ重視
```typescript
score = (isFrozen ? 50 : 0) + (isReadyToEat ? 50 : 0) - cookingTime
```

#### 栄養バランス重視
```typescript
// 各栄養素の合計が100に近いほど高スコア
vitaminScore = 100 - Math.abs(totalVitamin - 100)
proteinScore = 100 - Math.abs(totalProtein - 100)
fiberScore = 100 - Math.abs(totalFiber - 100)
score = (vitaminScore + proteinScore + fiberScore) / 3
```

#### いろどり重視
```typescript
// 色の種類が多いほど高スコア、同じ色の重複はペナルティ
colorVariety = uniqueColors.length * 20
colorPenalty = duplicateColors.length * 10
score = colorVariety - colorPenalty
```

#### 季節感重視
```typescript
// 現在の季節と一致する食材に高スコア
seasonMatch = ingredient.season === currentSeason ? 50 : 0
score = seasonMatch + (ingredient.season === 'all' ? 25 : 0)
```

#### コスト重視
```typescript
// 総コストが低いほど高スコア
score = 1000 - totalCost
```

## 状態管理

### Context構成
```typescript
// BentoContext: お弁当の状態管理
interface BentoState {
  bentoBox: BentoBox;
  placedIngredients: PlacedIngredient[];
  selectedCriteria: Criteria[];
}

// IngredientsContext: 食材マスタ管理
interface IngredientsState {
  ingredients: Ingredient[];
  userIngredients: Ingredient[];
}
```

## 初期食材データ（20種類）

### 主菜（5種類）
1. 唐揚げ（茶、タンパク質高）
2. 卵焼き（黄、バランス良）
3. ハンバーグ（茶、タンパク質高）
4. 鮭の塩焼き（橙、タンパク質高）
5. エビフライ（橙、冷凍可）

### 副菜（8種類）
6. ブロッコリー（緑、ビタミン高）
7. プチトマト（赤、そのまま可）
8. きんぴらごぼう（茶、食物繊維高）
9. ほうれん草のおひたし（緑、ビタミン高）
10. にんじんのグラッセ（橙、ビタミン高）
11. ポテトサラダ（白、バランス良）
12. ひじきの煮物（黒、食物繊維高）
13. 枝豆（緑、冷凍可）

### その他（7種類）
14. 白ごはん（白、主食）
15. おにぎり（白、主食）
16. チーズ（黄、そのまま可）
17. ウインナー（赤、簡単）
18. 梅干し（赤、そのまま可）
19. たくあん（黄、そのまま可）
20. いちご（赤、果物、季節：春）

## パフォーマンス考慮事項

1. **ドラッグ処理**: 
   - useNativeDriverでネイティブスレッドで処理
   - 不要な再レンダリングを防ぐためmemo化

2. **画像/アイコン**:
   - SVGで軽量化
   - 必要に応じてキャッシュ

3. **状態更新**:
   - イミュータブルな更新
   - バッチ更新で再レンダリング最小化

## テスト戦略

1. **単体テスト**:
   - 提案アルゴリズムのロジック
   - スコア計算の正確性
   - TypeScript設定：ts-jest使用（jest-expoは依存関係問題あり）

2. **統合テスト**:
   - ドラッグ＆ドロップの動作
   - データ永続化

3. **E2Eテスト**:
   - 基本的な使用フロー
   - エッジケース（空のお弁当、満杯のお弁当）

## 実装メモ

### 開発環境セットアップ
- Expo Go対応
- TypeScriptフル活用（strict: true）
- パス解決設定：@/* → src/*
- テスト環境：ts-jest（jest-expoは回避）

### 食材データモデルの実装洞察

#### バリデーション設計
- 大きなバリデーション関数は小さな関数に分割して保守性向上
- 定数の外部化で変更に柔軟に対応（VALID_CATEGORIES、VALID_COLORS）
- 栄養値は0-100の数値範囲で統一

#### ID生成戦略
```typescript
// パターン: ingredient-{timestamp}-{random}
// 例: ingredient-1706247598123-abc123def
generateIngredientId(): `ingredient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
```

#### デフォルト値設計
```typescript
DEFAULT_NUTRITION = { vitamin: 0, protein: 0, fiber: 0 }
DEFAULT_SIZE = { width: 40, height: 30 } // ピクセル単位
DEFAULT_ICON = 'circle' // 簡易図形から開始
DEFAULT_SEASON = 'all' // 通年利用可能
```

#### バリデーション機能構成
- `validateRequiredFields()`: 必須フィールドの型チェック
- `validateNutrition()`: 栄養値の範囲チェック（0-100）
- `validateEnumFields()`: カテゴリ・色の有効値チェック
- nullish coalescing operator (??) で falsy 値の正確な処理

## セキュリティ・プライバシー
- ローカルデータのみ使用
- 外部通信なし
- ユーザーデータの暗号化は現時点では不要（機密情報なし）

## 今後の拡張ポイント
1. 仕切りの自由配置
2. お弁当箱形状の追加
3. 食材データベースの拡充
4. レシピ・履歴機能
5. 共有機能
6. 画像認識での食材追加