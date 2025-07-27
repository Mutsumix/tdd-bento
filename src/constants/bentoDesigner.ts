/**
 * BentoDesigner コンポーネントの設定定数
 */

export const BENTO_DESIGNER_CONFIG = {
  /** デフォルトのお弁当箱設定 */
  DEFAULT_BENTO_BOX: {
    type: 'rectangle' as const,
    dimensions: { width: 300, height: 200 }
  },
  
  /** レイアウト設定 */
  LAYOUT: {
    /** コンテナのパディング */
    CONTAINER_PADDING: 16,
    /** お弁当箱エリアのフレックス比率 */
    BENTO_FLEX: 2,
    /** 食材リストエリアのフレックス比率 */
    INGREDIENT_FLEX: 1,
    /** 境界線の太さ */
    BORDER_WIDTH: 1
  }
} as const;