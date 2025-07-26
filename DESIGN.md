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
- React Native対応：jest.setup.jsでモック設定

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

### お弁当箱データモデルの実装洞察

#### ID生成戦略の統一
```typescript
// 統一されたID生成パターン
generateId(prefix: string): `${prefix}-${timestamp}-${random}`
// 例:
// bento-1706247598123-abc123def
// partition-1706247598124-def456ghi
// placed-1706247598125-ghi789jkl
```

#### デフォルト仕切り設計（2分割）
```typescript
// 長方形お弁当箱の2分割パターン
createDefaultPartitions(dimensions) {
  halfWidth = width / 2
  return [
    { type: 'rice', bounds: { x: 0, y: 0, width: halfWidth, height } },      // 左半分：ご飯
    { type: 'side', bounds: { x: halfWidth, y: 0, width: halfWidth, height } } // 右半分：おかず
  ]
}
```

#### 食材配置の衝突検出アルゴリズム
```typescript
// 矩形重複判定（AABB collision detection）
isOverlapping(pos1, size1, pos2, size2) {
  // 4つの分離軸をチェック
  return !(
    pos1.x + size1.width <= pos2.x ||   // 1が2の左
    pos2.x + size2.width <= pos1.x ||   // 2が1の左  
    pos1.y + size1.height <= pos2.y ||  // 1が2の上
    pos2.y + size2.height <= pos1.y     // 2が1の上
  )
}
```

#### バリデーション戦略の改善
- **共通化**: `validateObjectWithNumericFields()` で数値フィールドの検証を統一
- **再利用性**: `validateNumericField()` で positive/non-negative の条件を柔軟に指定
- **階層化**: dimensions → bounds → position/size の段階的バリデーション

#### 配置制約の実装
1. **境界チェック**: 食材がパーティション境界内に収まるか
2. **重複チェック**: 既存食材との衝突がないか
3. **パーティション一致**: 指定されたパーティションが存在するか

```typescript
canPlaceIngredientInPartition(ingredient, partition, existing) {
  // 1. 境界チェック
  if (ingredient exceeds partition.bounds) return false
  // 2. 重複チェック  
  if (overlaps with any existing in same partition) return false
  return true
}
```

### 初期食材データの実装洞察

#### データ構造の最適化
```typescript
// 構造化されたデータ管理
const MAIN_DISHES: Ingredient[] = [...];     // 5種類（主菜）
const SIDE_DISHES: Ingredient[] = [...];     // 8種類（副菜）
const OTHER_ITEMS: Ingredient[] = [...];     // 7種類（その他・果物）

const INITIAL_INGREDIENTS = [...MAIN_DISHES, ...SIDE_DISHES, ...OTHER_ITEMS];
```

#### 共通化によるコード効率化
```typescript
// ヘルパー関数で重複排除
function createIngredient(
  id, name, category, color, nutrition, cookingTime, cost, size,
  overrides = {}
): Ingredient {
  return {
    ...基本値,
    ...引数,
    ...COMMON_DEFAULTS,    // season: 'all', isFrozen: false, etc.
    ...overrides          // 個別の例外設定
  };
}
```

#### 食材データの栄養バランス設計
- **主菜**: 高タンパク質（60-85）、中程度ビタミン（15-40）
- **副菜**: 高ビタミン（40-95）、中程度食物繊維（30-90）
- **その他**: バランス型、特殊用途（いちご：ビタミン100）

#### 実用性重視の属性設定
```typescript
// 調理時間の現実的な設定
cookingTime: {
  冷凍食品: 3-8分     // エビフライ、枝豆
  そのまま可: 0分      // プチトマト、チーズ、梅干し
  簡単調理: 5-12分    // ブロッコリー、ウインナー
  本格調理: 15-20分   // 唐揚げ、ハンバーグ、ひじき
}

// コスト設定（円）
cost: {
  調味料系: 30-40     // 梅干し、たくあん
  基本食材: 50-90     // ごはん、野菜類
  加工品: 100-150     // 卵焼き、チーズ、ウインナー
  高級食材: 200-300   // 鮭、いちご、ハンバーグ
}
```

#### フィルタリング機能の設計
```typescript
// カテゴリフィルタ（料理の種類別）
getIngredientsByCategory('main')    // 主菜5種類
getIngredientsByCategory('side')    // 副菜8種類

// 属性フィルタ（利便性重視）
getFrozenIngredients()              // 時短料理用
getReadyToEatIngredients()          // そのまま使用可能

// 季節フィルタ（旬の食材）
getIngredientsBySeason('spring')    // いちご + all-season食材
getIngredientsBySeason('summer')    // 枝豆 + all-season食材
```

#### データ整合性チェック機能
```typescript
validateInitialIngredientsData() {
  // 1. ID重複チェック
  // 2. 名前重複チェック  
  // 3. 個別バリデーション（栄養値0-100、必須フィールド等）
  // 4. 総数チェック（期待値20種類）
}
```

#### カラーパレットの戦略的配分
- **赤系**: プチトマト、鮭、エビフライ、にんじん、ウインナー、梅干し、いちご（7種類）
- **緑系**: ブロッコリー、ほうれん草、枝豆（3種類）
- **茶系**: 唐揚げ、ハンバーグ、きんぴらごぼう（3種類） 
- **白系**: ポテトサラダ、白ごはん、おにぎり（3種類）
- **黄系**: 卵焼き、チーズ、たくあん（3種類）
- **黒系**: ひじきの煮物（1種類）

→ 「いろどり重視」提案で視覚的バランスを取りやすい配分

### 基本的なプロジェクト構造の実装洞察

#### コンポーネント階層の設計
```
src/components/
├── BentoDesigner/           # メイン画面コンポーネント
├── BentoBoxCanvas/          # お弁当箱表示エリア
│   ├── PartitionArea/       # 仕切りエリア
│   └── PlacedIngredientItem/ # 配置済み食材アイテム
├── IngredientList/          # 食材リスト
│   └── IngredientItem/      # 食材アイテム
├── ActionBar/               # アクションボタン群
├── SuggestionModal/         # 提案モーダル
│   ├── CriteriaSelector/    # 評価軸選択
│   └── SuggestionDisplay/   # 提案表示
└── AddIngredientModal/      # 食材追加モーダル
```

#### Context設計パターン
```typescript
// 状態管理の分離
BentoContext    → お弁当の配置状態・選択基準
IngredientsContext → 食材マスタデータ・ユーザー追加食材
```

#### テスト設定の最適化
- **React Native Mock**: Jest環境でRNコンポーネントを正しく処理
- **JSX Transform**: ts-jest設定でreact-jsx使用
- **Module Resolution**: @/* パス解決でクリーンなimport

#### プロジェクト構造の利点
1. **モジュール化**: 各コンポーネントが独立してテスト・開発可能
2. **型安全性**: TypeScript interface でProps定義
3. **拡張性**: サブコンポーネントの段階的追加が容易
4. **保守性**: index.ts で export を整理

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