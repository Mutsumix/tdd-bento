// Mock React Native components
jest.mock('react-native', () => {
  const React = require('react');
  
  // Helper function for flattening styles
  const flattenStyle = (style) => {
    if (!style) return {};
    if (Array.isArray(style)) {
      return Object.assign({}, ...style.filter(Boolean));
    }
    return style;
  };
  
  // Helper function for filtering React Native specific props
  const filterHtmlProps = (props, excludePatterns = []) => {
    return Object.keys(props).reduce((acc, key) => {
      const shouldExclude = excludePatterns.some(pattern => key.startsWith(pattern));
      if (!shouldExclude) {
        acc[key] = props[key];
      }
      return acc;
    }, {});
  };
  
  // Helper function for creating base element props
  const createBaseProps = (testID, style, additionalProps = {}) => ({
    testID,
    style: flattenStyle(style),
    ...additionalProps,
  });
  
  return {
    View: ({ children, testID, style, ...props }) => {
      return React.createElement('div', {
        ...createBaseProps(testID, style),
        ...props
      }, children);
    },
    
    Text: ({ children, testID, style, ...props }) => {
      return React.createElement('span', {
        ...createBaseProps(testID, style),
        ...props
      }, children);
    },
    
    ScrollView: ({ children, testID, style, contentContainerStyle, horizontal, showsHorizontalScrollIndicator, showsVerticalScrollIndicator, ...props }) => {
      const htmlProps = filterHtmlProps(props, ['shows', 'keyboardShould', 'onScroll']);
      
      return React.createElement('div', {
        ...createBaseProps(testID, style, {
          horizontal,
          showsHorizontalScrollIndicator,
          showsVerticalScrollIndicator,
          ...htmlProps
        })
      }, children);
    },
    
    TouchableOpacity: ({ children, testID, onPress, style, disabled, ...props }) => {
      const htmlProps = filterHtmlProps(props, ['accessible', 'active']);
      
      return React.createElement('button', {
        ...createBaseProps(testID, style, {
          onClick: onPress,
          disabled,
          ...htmlProps
        })
      }, children);
    },
      
    // Add other common RN components
    StyleSheet: {
      create: (styles) => styles,
      flatten: (style) => {
        if (!style) return {};
        if (Array.isArray(style)) {
          return Object.assign({}, ...style.filter(Boolean));
        }
        return style;
      },
    },
    Platform: {
      OS: 'ios',
      select: (obj) => obj.ios || obj.default,
    },
  };
});