/**
 * ActionBar コンポーネントの設定定数
 */

export const ACTION_BAR_CONFIG = {
  /** レイアウト設定 */
  LAYOUT: {
    /** 水平パディング */
    PADDING_HORIZONTAL: 20,
    /** 垂直パディング */
    PADDING_VERTICAL: 16,
    /** 境界線の太さ */
    BORDER_WIDTH: 1,
  },
  
  /** ボタン設定 */
  BUTTON: {
    /** 垂直パディング */
    PADDING_VERTICAL: 12,
    /** 水平マージン */
    MARGIN_HORIZONTAL: 8,
    /** ボーダー半径 */
    BORDER_RADIUS: 8,
  },
  
  /** テキスト設定 */
  TEXT: {
    /** フォントサイズ */
    FONT_SIZE: 16,
    /** フォントウェイト */
    FONT_WEIGHT: 'bold' as const,
  },
  
  /** ボタンテキスト */
  BUTTON_TEXT: {
    /** 提案ボタンのテキスト */
    SUGGESTION: '提案を受ける',
    /** クリアボタンのテキスト */
    CLEAR: 'クリア',
    /** 食材追加ボタンのテキスト */
    ADD_INGREDIENT: '食材追加',
  }
} as const;