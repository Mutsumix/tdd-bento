// Mock React Native components
jest.mock('react-native', () => {
  const React = require('react');
  
  return {
    View: ({ children, testID, style, ...props }) => {
      const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style) : {};
      return React.createElement('div', { 
        'data-testid': testID,
        style: flatStyle,
        ...props 
      }, children);
    },
    
    Text: ({ children, testID, style, ...props }) => {
      const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style) : {};
      return React.createElement('span', { 
        'data-testid': testID,
        style: flatStyle,
        ...props 
      }, children);
    },
    
    ScrollView: ({ children, testID, style, ...props }) => {
      const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style) : {};
      return React.createElement('div', { 
        'data-testid': testID,
        style: flatStyle,
        ...props 
      }, children);
    },
    
    TouchableOpacity: ({ children, testID, onPress, style, ...props }) => {
      const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style) : {};
      return React.createElement('button', { 
        'data-testid': testID, 
        onClick: onPress,
        style: flatStyle,
        ...props 
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