import { Colors } from 'react-native-ui-lib';
import { ColorPalette } from './colors';

Colors.loadSchemes({
  light: {
    screenBG: ColorPalette.slate[50],
    textColor: ColorPalette.gray[900],
    primary: ColorPalette.indigo[600],
    secondary: ColorPalette.indigo[700],
    accent: ColorPalette.emerald[500],
    error: ColorPalette.red[500],
    border: ColorPalette.slate[300],
    inputBG: ColorPalette.white,
  },
  dark: {
    screenBG: ColorPalette.slate[50],
    textColor: ColorPalette.gray[900],
    primary: ColorPalette.indigo[600],
    secondary: ColorPalette.indigo[700],
    accent: ColorPalette.emerald[500],
    error: ColorPalette.red[500],
    border: ColorPalette.slate[300],
    inputBG: ColorPalette.white,
  },
});
