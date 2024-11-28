import { type StyleProp, type TextStyle } from 'react-native';

export const getFontSizeFromStyle = (textStyle: StyleProp<TextStyle>) => {
  if (!textStyle) return undefined;
  if (Array.isArray(textStyle)) {
    for (const styleItem of textStyle.reverse()) {
      if (
        styleItem &&
        typeof styleItem === 'object' &&
        'fontSize' in styleItem
      ) {
        return styleItem.fontSize;
      }
    }
  } else if (typeof textStyle === 'object' && 'fontSize' in textStyle) {
    return textStyle.fontSize;
  }
  return undefined;
};
