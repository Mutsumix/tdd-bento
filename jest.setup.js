// Mock React Native components
jest.mock('react-native', () => {
  const React = require('react');
  
  return {
    View: ({ children, testID, ...props }) => 
      React.createElement('div', { 'data-testid': testID, ...props }, children),
    
    Text: ({ children, testID, ...props }) => 
      React.createElement('span', { 'data-testid': testID, ...props }, children),
    
    ScrollView: ({ children, testID, ...props }) => 
      React.createElement('div', { 'data-testid': testID, ...props }, children),
    
    TouchableOpacity: ({ children, testID, onPress, ...props }) => 
      React.createElement('button', { 
        'data-testid': testID, 
        onClick: onPress, 
        ...props 
      }, children),
      
    // Add other common RN components
    StyleSheet: {
      create: (styles) => styles,
    },
    Platform: {
      OS: 'ios',
      select: (obj) => obj.ios || obj.default,
    },
  };
});