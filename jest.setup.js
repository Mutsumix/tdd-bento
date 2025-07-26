// Mock React Native components
jest.mock('react-native', () => {
  const React = require('react');
  
  return {
    View: ({ children, testID, style, ...props }) => {
      const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style) : {};
      return React.createElement('div', { 
        testID: testID,
        style: flatStyle,
        ...props 
      }, children);
    },
    
    Text: ({ children, testID, style, ...props }) => {
      const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style) : {};
      return React.createElement('span', { 
        testID: testID,
        style: flatStyle,
        ...props 
      }, children);
    },
    
    ScrollView: ({ children, testID, style, contentContainerStyle, horizontal, showsHorizontalScrollIndicator, showsVerticalScrollIndicator, ...props }) => {
      const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style) : {};
      const htmlProps = Object.keys(props).reduce((acc, key) => {
        // Only pass through standard HTML props
        if (!key.startsWith('shows') && !key.startsWith('keyboardShould') && !key.startsWith('onScroll')) {
          acc[key] = props[key];
        }
        return acc;
      }, {});
      
      return React.createElement('div', { 
        testID: testID,
        style: flatStyle,
        horizontal: horizontal,
        showsHorizontalScrollIndicator: showsHorizontalScrollIndicator,
        showsVerticalScrollIndicator: showsVerticalScrollIndicator,
        ...htmlProps
      }, children);
    },
    
    TouchableOpacity: ({ children, testID, onPress, style, disabled, ...props }) => {
      const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style) : {};
      const htmlProps = Object.keys(props).reduce((acc, key) => {
        // Only pass through standard HTML props
        if (!key.startsWith('accessible') && !key.startsWith('active')) {
          acc[key] = props[key];
        }
        return acc;
      }, {});
      
      return React.createElement('button', {
        testID: testID, 
        onClick: onPress,
        style: flatStyle,
        disabled: disabled,
        ...htmlProps
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