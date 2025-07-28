import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UI_COLORS } from '@/utils/colors';

export interface ErrorMessageProps {
  /** Error message to display. If null, component won't render */
  error: string | null;
  /** Callback when user dismisses the error */
  onDismiss: () => void;
  /** Auto-dismiss duration in milliseconds. If not provided, won't auto-dismiss */
  autoDismissMs?: number;
}

/**
 * Component for displaying user-friendly error messages
 * Supports manual dismiss and optional auto-dismiss
 */
export function ErrorMessage({ error, onDismiss, autoDismissMs }: ErrorMessageProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup auto-dismiss timer
  useEffect(() => {
    if (error && autoDismissMs) {
      timeoutRef.current = setTimeout(() => {
        onDismiss();
      }, autoDismissMs);
    }

    // Cleanup timer on unmount or when error changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [error, autoDismissMs, onDismiss]);

  // Don't render if no error
  if (!error) {
    return null;
  }

  return (
    <View style={styles.container} testID="error-message">
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{error}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onDismiss}
          testID="error-message-close"
          accessibilityLabel="エラーメッセージを閉じる"
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  messageContainer: {
    backgroundColor: UI_COLORS.destructive,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageText: {
    flex: 1,
    color: UI_COLORS.background.modal,
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: UI_COLORS.background.modal,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});