/**
 * Color Migration Guide
 *
 * Use this mapping to replace hardcoded colors with centralized AppColors
 */

export const colorMigrationMap = {
  // Primary Blues
  "#2196F3": "AppColors.primary",
  "#1976D2": "AppColors.primaryDark",
  "#E3F2FD": "AppColors.primaryLight",
  "#1a73e8": "AppColors.primary", // Alternative primary
  "#2563EB": "AppColors.primary",
  "#3B82F6": "AppColors.secondary",

  // Success/Green
  "#4CAF50": "AppColors.success",
  "#2E7D32": "AppColors.successText",
  "#E8F5E9": "AppColors.successBackground",
  "#F0FFF4": "AppColors.successLight",
  "#38A169": "AppColors.successBorder",
  "#2F855A": "AppColors.successDark",

  // Warning/Orange
  "#FF9800": "AppColors.warning",
  "#F57C00": "AppColors.warningDark",
  "#FFC107": "AppColors.warningBorder",
  "#FFF9E6": "AppColors.warningBackground",
  "#FFE0B2": "AppColors.warning (light variant)",

  // Error/Red
  "#F44336": "AppColors.error",
  "#C62828": "AppColors.errorDark",
  "#FFEBEE": "AppColors.errorLight",
  "#FF5722": "AppColors.errorDeep",
  "#f44336": "AppColors.error",

  // Text Colors
  "#212121": "AppColors.text.primary",
  "#666": "AppColors.text.secondary",
  "#666666": "AppColors.text.secondary",
  "#999": "AppColors.text.tertiary",
  "#A0AEC0": "AppColors.text.placeholder",
  "#2D3748": "AppColors.text.primary (alternate)",

  // Background Colors
  "#fff": "AppColors.white",
  "#FFFFFF": "AppColors.white",
  "#F4F7FC": "AppColors.background.tertiary",
  "#F9FAFB": "AppColors.background.screen",
  "#F5F5F5": "AppColors.background.secondary",
  "#f5f5f5": "AppColors.background.secondary",
  "#F7FAFC": "AppColors.background.inputAlt",
  "#EBF8FF": "AppColors.background.info",

  // Border Colors
  "#E0E0E0": "AppColors.border.light",
  "#E2E8F0": "AppColors.border.medium",
  "#D1D5DB": "AppColors.border.light",

  // Gray Scale
  "#9E9E9E": "AppColors.gray[500]",
  "#424242": "AppColors.gray[800]",
  "#CBD5E0": "AppColors.slate[400]",
  "#4A5568": "AppColors.slate[700]",
  "#2C5282": "AppColors.blueGray[700]",
  "#3182CE": "AppColors.blueGray[600]",

  // Special Colors
  "#000": "AppColors.shadow",
  "#10B981": "AppColors.accent",
  "#EF4444": "AppColors.error",
};

/**
 * Common patterns to search and replace
 */
export const replacementPatterns = [
  // Icon colors
  {
    search: /color="#2196F3"/g,
    replace: "color={AppColors.primary}",
    description: "Primary icon color",
  },
  {
    search: /color="#666"/g,
    replace: "color={AppColors.text.secondary}",
    description: "Secondary text/icon color",
  },
  {
    search: /color="#4CAF50"/g,
    replace: "color={AppColors.success}",
    description: "Success icon color",
  },
  {
    search: /color="#F44336"/g,
    replace: "color={AppColors.error}",
    description: "Error icon color",
  },

  // Style properties
  {
    search: /backgroundColor:\s*'#fff'/g,
    replace: "backgroundColor: AppColors.white",
    description: "White background",
  },
  {
    search: /backgroundColor:\s*'#F4F7FC'/g,
    replace: "backgroundColor: AppColors.background.tertiary",
    description: "Tertiary background",
  },
  {
    search: /color:\s*'#212121'/g,
    replace: "color: AppColors.text.primary",
    description: "Primary text color",
  },
  {
    search: /borderColor:\s*'#E0E0E0'/g,
    replace: "borderColor: AppColors.border.light",
    description: "Light border",
  },
  {
    search: /shadowColor:\s*'#000'/g,
    replace: "shadowColor: AppColors.shadow",
    description: "Shadow color",
  },
  {
    search: /placeholderTextColor="#A0AEC0"/g,
    replace: "placeholderTextColor={AppColors.text.placeholder}",
    description: "Placeholder text",
  },
];

/**
 * Functions to replace
 */
export const functionReplacements = {
  getSeverityColor: {
    old: `const getSeverityColor = (severity: AnemiaSeverity): string => {
   switch (severity) {
      case AnemiaSeverity.NONE: return '#4CAF50';
      case AnemiaSeverity.MILD: return '#FFC107';
      case AnemiaSeverity.MODERATE: return '#FF9800';
      case AnemiaSeverity.SEVERE: return '#F44336';
      default: return '#666';
   }
};`,
    new: `// Import: import { getAnemiaSeverityColor } from '@/utils/styles/colors';
// Replace calls: getSeverityColor(severity) -> getAnemiaSeverityColor(severity)`,
  },

  getRoleColor: {
    old: `const getRoleColor = (role: string | null | undefined): string => {
   if (!role) return '#9E9E9E';
   return role === 'DOCTOR' ? '#2196F3' : '#4CAF50';
};`,
    new: `// Import: import { getRoleColor } from '@/utils/styles/colors';
// Use directly: getRoleColor(role)`,
  },
};

/**
 * Steps to migrate a file:
 *
 * 1. Add import at the top:
 *    import { AppColors, getAnemiaSeverityColor } from '@/utils/styles/colors';
 *
 * 2. Remove local color functions (getSeverityColor, etc.)
 *
 * 3. Replace all hardcoded hex colors using the map above
 *
 * 4. Update function calls:
 *    getSeverityColor() -> getAnemiaSeverityColor()
 *
 * 5. Test the component to ensure colors are correct
 */

/**
 * Quick replacement examples:
 */
export const examples = {
  before: `
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F7FC',
  },
  title: {
    color: '#212121',
  },
});

<Ionicons name="check" size={24} color="#4CAF50" />
<View style={{ backgroundColor: getSeverityColor(severity) + '20' }} />
`,

  after: `
import { AppColors, getAnemiaSeverityColor } from '@/utils/styles/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background.tertiary,
  },
  title: {
    color: AppColors.text.primary,
  },
});

<Ionicons name="check" size={24} color={AppColors.success} />
<View style={{ backgroundColor: getAnemiaSeverityColor(severity) + '20' }} />
`,
};
