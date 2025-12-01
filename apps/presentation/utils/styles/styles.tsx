import { Colors, ThemeManager, Typography } from 'react-native-ui-lib';
import { AppColors } from './colors';
import './themes';

Typography.loadTypographies({
  title: { fontSize: 26, fontWeight: '700', lineHeight: 34 },  
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  label: { fontSize: 16, fontWeight: '600', lineHeight: 22 }
});

ThemeManager.setComponentTheme('Button', () => ({
  backgroundColor: Colors.primary,
  borderRadius: 50, 
  paddingVertical: 14,
  paddingHorizontal: 24,
  labelStyle: { fontWeight: '600', fontSize: 16, color: Colors.white },
  enableShadow: true, 
  shadowColor: AppColors.shadow,
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
}));

ThemeManager.setComponentTheme('RadioButton', () => ({
  color: Colors.primary,
  borderRadius: 99,
  size: 24, 
  labelStyle: { ...Typography.body, color: Colors.textColor }
}));

ThemeManager.setComponentTheme('TextField', () => ({
  placeholderTextColor: Colors.border,
  floatingPlaceholderColor: Colors.primary,
  selectionColor: Colors.primary,
  enableErrors: true,
  validationMessageStyle: { color: Colors.error, fontSize: 13 },
  fieldStyle: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.inputBG,
    padding: 14,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  color: Colors.textColor,
  labelStyle: { ...Typography.label, color: Colors.textColor }
}));

ThemeManager.setComponentTheme('Picker', () => ({
  placeholderTextColor: Colors.border,
  style: { ...Typography.body, color: Colors.textColor },
  labelStyle: { ...Typography.label, color: Colors.textColor },
  fieldStyle: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.inputBG,
    padding: 14,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  }
}));
