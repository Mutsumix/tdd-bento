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

### BentoBoxCanvasコンポーネントの実装洞察

#### サブコンポーネント設計
```typescript
// コンポーネントの責任分離
BentoBoxCanvas       → コンテナとレイアウト管理
├── PartitionArea    → 仕切りの表示
└── PlacedIngredientItem → 配置済み食材の表示とインタラクション
```

#### スタイル管理パターン
```typescript
// 静的スタイルと動的スタイルの分離
const dynamicStyle: ViewStyle = {
  position: 'absolute',
  left: bounds.x,
  top: bounds.y,
  width: bounds.width,
  height: bounds.height
};
// StyleSheet.createで定義した静的スタイルと組み合わせ
style={[styles.static, dynamicStyle]}
```

#### テストID命名規則
- コンテナ: `bento-box-container`
- パーティション: `partition-${partition.id}`
- 配置済み食材: `placed-ingredient-${placedIngredient.id}`

#### React Nativeテスト環境の注意点
- jest.setup.jsでStyleSheet.flattenメソッドのモックが必要
- toJSON()を使用したスナップショットテストが有効
- react-test-rendererの非推奨警告は無視可能（現時点）

### IngredientListコンポーネントの実装洞察

#### リファクタリングパターンの確立
```typescript
// 定数抽出による保守性向上
const ITEM_DIMENSIONS = { WIDTH: 80, HEIGHT: 80 } as const;
const SPACING = { BORDER_RADIUS: 8, MARGIN_HORIZONTAL: 4 } as const;
const COLORS = { BACKGROUND: '#f0f0f0', BORDER: '#ddd' } as const;

// StyleSheet.createでの定数利用
const styles = StyleSheet.create({
  container: {
    width: ITEM_DIMENSIONS.WIDTH,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SPACING.BORDER_RADIUS,
  }
});
```

#### Jest環境での最適化
```typescript
// React Nativeモック用ヘルパー関数
const flattenStyle = (style) => Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;
const filterHtmlProps = (props, excludePatterns) => /* RN特有プロップのフィルタリング */;
const createBaseProps = (testID, style, additionalProps) => /* 共通プロップ生成 */;
```

#### インターフェース設計の段階的拡張
```typescript
// 初期実装: 最小限のプロップス
interface IngredientListProps {
  ingredients: Ingredient[];
  onIngredientPress?: (ingredient: Ingredient) => void;
  // 将来拡張: selectedCategory, onCategoryChange
}
```

#### テストID命名規則の統一
- リストコンテナ: `ingredient-list`
- 個別アイテム: `ingredient-item-${ingredient.id}`
- コンポーネント階層を反映した識別子設計

#### React Nativeテスト環境の注意点
- `testID`プロップの使用（`data-testid`ではない）
- StyleSheet.flattenメソッドのモック必要性
- HTMLプロップスとRNプロップスの適切な分離
- toJSON()を用いた構造テストの有効性

#### コンポーネント責任分離の実践
```typescript
// 親コンポーネント: レイアウトとデータ管理
IngredientList → ScrollView + IngredientItem[]

// 子コンポーネント: 個別表示とインタラクション
IngredientItem → TouchableOpacity + 食材情報表示
```

### AsyncStorageサービスの実装洞察

#### ジェネリクス型による共通化パターン
```typescript
// 型安全な汎用データ操作メソッド
private static async saveData<T>(key: string, data: T): Promise<void> {
  const jsonData = JSON.stringify(data);
  await AsyncStorage.setItem(key, jsonData);
}

private static async loadData<T>(key: string): Promise<T[]> {
  // データ破損への堅牢性を内包
  try {
    return JSON.parse(jsonData) as T[];
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
}
```

#### データ永続化のベストプラクティス
```typescript
// 一貫性のあるストレージキー管理
const STORAGE_KEYS = {
  USER_INGREDIENTS: 'user_ingredients',
  BENTO_STATE: 'bento_state',
} as const;

// データ破損への対応戦略
// 1. SyntaxError（JSON破損）→ 空配列を返す
// 2. その他のエラー → 呼び出し元に伝播
// 3. null（データなし）→ 空配列を返す
```

#### AsyncStorageの使用パターン
```typescript
// CRUD操作の実装パターン
// Create/Update: saveData + loadData + 配列操作
// Read: loadData
// Delete: loadData + filter + saveData
// Clear: AsyncStorage.removeItem
```

#### サービス層設計の利点
1. **テスタビリティ**: AsyncStorageのモックが容易
2. **保守性**: ビジネスロジックとストレージ操作の分離
3. **拡張性**: 新しいデータ型への対応が簡単
4. **一貫性**: 全てのストレージ操作が統一されたインターフェース

#### エラーハンドリング戦略
- **不要なtry-catch除去**: エラーの自然な伝播を活用
- **意図的なエラー処理**: データ破損時の graceful degradation
- **テスト観点**: エラーケースの網羅的なテスト設計

#### 今後の拡張予定
```typescript
// 可能な拡張ポイント
interface StorageServiceExtensions {
  // 設定データの永続化
  saveAppSettings(settings: AppSettings): Promise<void>;
  // お気に入りレシピの永続化
  saveFavoriteRecipes(recipes: Recipe[]): Promise<void>;
  // 使用履歴の永続化
  saveUsageHistory(history: UsageEvent[]): Promise<void>;
}
```

### ドラッグ＆ドロップ機能の実装洞察

#### コンポーネント設計パターンの確立
```typescript
// 段階的な機能拡張パターン
interface IngredientItemProps {
  // 基本機能
  ingredient: Ingredient;
  onPress?: (ingredient: Ingredient) => void;
  
  // 拡張機能（条件付き）
  onDragStart?: (ingredient: Ingredient) => void;
  onDragEnd?: (ingredient: Ingredient, position: DragPosition) => void;
  isDragging?: boolean;
}
```

#### 条件付きimportによるテスト互換性の実現
```typescript
// プロダクション環境とテスト環境の両方に対応
try {
  // 本番環境での動的import
  const gestureHandler = require('react-native-gesture-handler');
  const reanimated = require('react-native-reanimated');
  // ... 実際のライブラリを使用
} catch (error) {
  // テスト環境でのフォールバック
  PanGestureHandler = View;
  State = { BEGAN: 2, END: 5 };
  // ... モック実装
}
```

#### AABB衝突検出アルゴリズムの実装
```typescript
// 軸平行境界ボックス（AABB）による高速衝突検出
const isOverlapping = (pos1, size1, pos2, size2) => {
  return !(
    pos1.x + size1.width <= pos2.x ||   // 分離軸1: 左右
    pos2.x + size2.width <= pos1.x ||   // 分離軸2: 左右  
    pos1.y + size1.height <= pos2.y ||  // 分離軸3: 上下
    pos2.y + size2.height <= pos1.y     // 分離軸4: 上下
  );
};
```

#### 段階的バリデーション戦略
```typescript
// ドロップ処理での多段階検証
const handleDrop = (position) => {
  // 1. 必須条件チェック
  if (!draggedIngredient || !onIngredientDrop) return;
  
  // 2. パーティション境界チェック
  const targetPartition = findPartition(position);
  if (!targetPartition) return;
  
  // 3. 既存食材との重複チェック
  if (hasOverlap(position, draggedIngredient, placedIngredients)) return;
  
  // 4. サイズ適合チェック
  if (!fitsInPartition(draggedIngredient, targetPartition, position)) return;
  
  // 全検証通過 → ドロップ実行
  executeValidDrop();
};
```

#### TypeScript型安全性の強化
```typescript
// 明確な型定義による開発効率向上
interface DragPosition { x: number; y: number; }
interface DropInfo { partitionId: string; position: DragPosition; }

// JSDoc によるAPI文書化
/** 
 * Handles ingredient drop logic with comprehensive validation
 * - Checks if position is within a valid partition
 * - Validates no overlap with existing ingredients  
 * - Ensures ingredient fits within partition bounds
 */
```

#### テスト駆動開発（TDD）の実践結果
- **RED段階**: 10個の失敗テスト作成（機能要件の明確化）
- **GREEN段階**: 8個のテスト通過（主要機能の実装完了）  
- **REFACTOR段階**: コード品質向上（型安全性・保守性強化）
- **FEEDBACK段階**: 設計文書更新（今後の開発指針確立）

#### パフォーマンス最適化の考慮事項
1. **ジェスチャー処理**: `useNativeDriver` を使用してメインスレッドをブロックしない
2. **衝突検出**: O(n) の線形時間で既存食材との重複をチェック
3. **再レンダリング最小化**: `useSharedValue` による状態管理でReactの再レンダリングを回避
4. **条件付きレンダリング**: ドラッグ機能が不要な場合は通常のTouchableOpacityを使用

#### 残存課題と今後の改善点
1. **テスト環境での完全なジェスチャーシミュレーション**: react-native-gesture-handlerのモック改善
2. **複数食材の同時ドラッグ**: 現在は単一食材のみ対応
3. **ドラッグ中の視覚フィードバック強化**: リアルタイムなドロップ可能性表示
4. **パフォーマンス監視**: 大量の食材配置時のframe drop測定

#### アーキテクチャ上の利点
- **疎結合**: IngredientItemとBentoBoxCanvasが独立して動作
- **拡張性**: 新しいジェスチャーや検証ルールの追加が容易
- **テスト容易性**: 各検証ロジックが純粋関数として分離
- **型安全性**: TypeScriptによる実行時エラーの事前防止

### 食材配置ロジックの実装洞察

#### PlacedIngredientServiceの設計パターン
```typescript
// 責任分離による単一責任原則の実践
class PlacedIngredientService {
  // 作成: ID生成とオブジェクト構築
  static createPlacedIngredient(input: CreatePlacedIngredientInput): PlacedIngredient

  // 検証: 段階的バリデーション戦略
  static canPlaceIngredient(...): PlacementResult
  private static validateBounds(...): PlacementResult     // 境界チェック
  private static validateCollisions(...): PlacementResult // 衝突検出

  // 永続化: StorageServiceとの統合
  static saveToStorage(ingredients: PlacedIngredient[]): Promise<void>
  static loadFromStorage(): Promise<PlacedIngredient[]>

  // 管理: 不変性を保った配列操作
  static addPlacedIngredient(...): PlacedIngredient[]
  static removePlacedIngredient(...): PlacedIngredient[]
  static getByPartition(...): PlacedIngredient[]
}
```

#### 共通ユーティリティの抽出
```typescript
// /src/utils/collision.ts - 衝突検出の共通化
export function isOverlapping(pos1, size1, pos2, size2): boolean
export function fitsWithinBounds(position, size, bounds): boolean

// /src/constants/placement.ts - エラーメッセージの一元管理
export const PLACEMENT_ERROR_MESSAGES = {
  EXTENDS_BEYOND_BOUNDS: 'Ingredient extends beyond partition bounds',
  OVERLAPS_WITH_EXISTING: 'Ingredient overlaps with existing ingredient',
} as const;
```

#### ID生成戦略の統一
```typescript
// 一貫したID生成パターンの確立
generatePlacedIngredientId(): `placed-${timestamp}-${randomString}`

// 設定の外部化により保守性向上
const ID_GENERATION = {
  PLACED_INGREDIENT_PREFIX: 'placed',
  RANDOM_STRING_LENGTH: 9,
} as const;
```

#### 段階的バリデーション戦略
```typescript
// 責任を分離した検証ロジック
static canPlaceIngredient(...): PlacementResult {
  // 1段階目: 境界チェック（計算コスト低）
  const boundsResult = this.validateBounds(ingredient, partition, position);
  if (!boundsResult.canPlace) return boundsResult;

  // 2段階目: 衝突検出（計算コスト高）
  const collisionResult = this.validateCollisions(ingredient, partition, position, existing);
  if (!collisionResult.canPlace) return collisionResult;

  return { canPlace: true };
}
```

#### 不変性を重視したデータ管理
```typescript
// 副作用のない純粋関数によるデータ操作
static addPlacedIngredient(existing, newItem) {
  return [...existing, newItem]; // 元配列を変更せず新配列を返す
}

static removePlacedIngredient(ingredients, id) {
  return ingredients.filter(item => item.id !== id); // フィルタリングによる除去
}
```

#### StorageServiceとの統合パターン
```typescript
// 既存のStorageServiceを活用した永続化
static async saveToStorage(placedIngredients) {
  await StorageService.saveBentoState(placedIngredients);
}

static async loadFromStorage() {
  return await StorageService.loadBentoState();
}
```

#### 型安全性の強化
```typescript
// 明確な型定義による開発効率とエラー防止
interface PlacementResult {
  canPlace: boolean;
  reason?: string;
}

interface CreatePlacedIngredientInput {
  ingredientId: string;
  partitionId: string;
  position: Position;
  size: Size;
}
```

#### テスト駆動開発の成果
- **12個のテストケース** で包括的な機能検証
- **ID生成の一意性**: 複数生成での重複なし確認
- **境界検証**: パーティション境界内・外での正確な判定
- **衝突検出**: 同一・異なるパーティション間での適切な処理
- **永続化**: 保存・読み込み・空データ処理の確認
- **管理機能**: 追加・削除・フィルタリングの動作検証

#### リファクタリングによる改善点
1. **コード重複の除去**: BentoBoxCanvasとの`isOverlapping`関数統合
2. **定数の外部化**: エラーメッセージとID生成設定の管理改善
3. **責任分離**: 大きなメソッドを小さな専用メソッドに分割
4. **ユーティリティ化**: 汎用的な衝突検出機能の共通ライブラリ化

#### パフォーマンスの考慮
1. **段階的検証**: 軽い検証から重い検証の順で実行
2. **O(n)の衝突検出**: 線形時間での既存食材との重複チェック
3. **不変性**: 予測可能な状態管理によるデバッグ容易性
4. **メモリ効率**: 必要最小限のデータコピーによる省メモリ実装

#### 今後の拡張予定
- **入れ替え機能**: 既存食材との位置交換ロジック
- **自動配置**: 空きスペースを自動検出する配置アルゴリズム
- **配置制約**: 食材種別によるパーティション制限
- **undo/redo**: 配置操作の取り消し・やり直し機能

### 食材アイコン・名前表示機能の実装洞察

#### IngredientServiceの設計パターン
```typescript
// 食材データ検索の責任分離
export class IngredientService {
  static findById(id: string): Ingredient | null         // ID検索
  static getAll(): Ingredient[]                          // 全件取得
  static findByCategory(category): Ingredient[]          // カテゴリ検索
  static findByColor(color): Ingredient[]                // 色検索
}
```

#### PlacedIngredientItemの拡張設計
```typescript
// コンポーネント設計の改善ポイント
PlacedIngredientItem {
  // 依存性注入パターン: IngredientServiceを直接使用
  ingredient = IngredientService.findById(placedIngredient.ingredientId)
  
  // 動的サイズ計算: コンテナサイズに応じたレスポンシブ対応
  iconSize = calculateIconSize(placedIngredient.size)
  fontSize = calculateFontSize(placedIngredient.size)
  
  // 条件付きコンテナ: プロップスに応じた適切なラッパー選択
  Container = onPress ? TouchableOpacity : View
}
```

#### カラーマッピングシステム
```typescript
// 色の体系的管理と拡張性
export const COLOR_MAP = {
  red: '#E53E3E',      // 食材の自然な色を意識した選択
  yellow: '#F6E05E',   // UIでの視認性を重視
  green: '#38A169',    // コントラストと美的バランス
  white: '#F7FAFC',    // 背景との区別
  brown: '#975A16',    // 調理済み食材の表現
  black: '#2D3748'     // アクセント・区別用
} as const;

// フォールバック戦略
getColorCode(color) => COLOR_MAP[color] ?? DEFAULT_COLOR
```

#### 動的サイズ計算システム
```typescript
// レスポンシブ対応の実装パターン
const SIZING_CONFIG = {
  ICON_SIZE_RATIO: 0.4,      // コンテナ高さの40%
  FONT_SIZE_RATIO: 0.2,      // コンテナ高さの20%
  MIN_ICON_SIZE: 8,          // 最小サイズ保証
  MAX_ICON_SIZE: 24,         // 最大サイズ制限
}

// 計算ロジックの抽象化
calculateIconSize(containerSize) {
  const calculated = Math.min(width, height) * ICON_SIZE_RATIO
  return clamp(calculated, MIN_ICON_SIZE, MAX_ICON_SIZE)
}
```

#### TDD実装の成果
- **13テストケース**: 包括的な機能検証
- **完全な型安全性**: TypeScriptによる実行時エラー防止
- **モック戦略**: IngredientServiceの適切な分離テスト
- **リファクタリング耐性**: 内部実装変更に対するテストの安定性

#### アーキテクチャ上の利点
1. **単一責任原則**: IngredientService、色管理、サイズ計算の分離
2. **依存性の逆転**: サービス層への依存により上位レイヤーでの制御が可能
3. **開放閉鎖原則**: 新しい色やサイズルールの追加が既存コードに影響しない
4. **コンポーネントの合成**: TouchableOpacity/View の動的選択

#### パフォーマンス最適化
```typescript
// 計算結果のキャッシュ化（今後の拡張）
const memoizedIconSize = useMemo(
  () => calculateIconSize(placedIngredient.size),
  [placedIngredient.size.width, placedIngredient.size.height]
)

// 条件付きレンダリングの最適化
if (!ingredient) {
  return <FallbackComponent />  // 早期リターンでレンダリング負荷軽減
}
```

#### 今後の拡張予定
- **アニメーション**: React Native Reanimated による配置アニメーション
- **アイコンシステム**: SVGアイコンライブラリとの統合
- **テーマシステム**: ダークモード・ライトモード対応
- **アクセシビリティ**: スクリーンリーダー対応とアクセシビリティ向上

#### 学習ポイント
1. **段階的な機能拡張**: 基本機能→視覚的改善→パフォーマンス最適化
2. **テストファーストアプローチ**: REDでの期待動作定義の重要性
3. **ユーティリティ関数の価値**: 再利用可能な小さな関数の積み重ね
4. **型安全性の実践的活用**: コンパイル時エラー検出による開発効率向上

## 今後の拡張ポイント
1. 仕切りの自由配置
2. お弁当箱形状の追加
3. 食材データベースの拡充
4. レシピ・履歴機能
5. 共有機能
6. 画像認識での食材追加