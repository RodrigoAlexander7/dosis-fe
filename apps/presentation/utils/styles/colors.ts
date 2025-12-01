/**
 * Centralized Color Palette
 *
 * All color values for the application.
 * Update colors here to apply changes across the entire app.
 */

export const ColorPalette = {
  // Primary Colors
  blue: {
    50: "#E3F2FD",
    100: "#BBDEFB",
    200: "#90CAF9",
    300: "#64B5F6",
    400: "#42A5F5",
    500: "#2196F3", // Main primary blue
    600: "#1E88E5",
    700: "#1976D2",
    800: "#1565C0",
    900: "#0D47A1",
  },

  // Success/Green Colors
  green: {
    50: "#E8F5E9",
    100: "#C8E6C9",
    200: "#A5D6A7",
    300: "#81C784",
    400: "#66BB6A",
    500: "#4CAF50", // Main success green
    600: "#43A047",
    700: "#388E3C",
    800: "#2E7D32",
    900: "#1B5E20",
    light: "#F0FFF4",
    border: "#38A169",
    dark: "#2F855A",
  },

  // Warning/Orange Colors
  orange: {
    50: "#FFF3E0",
    100: "#FFE0B2",
    200: "#FFCC80",
    300: "#FFB74D",
    400: "#FFA726",
    500: "#FF9800", // Main warning orange
    600: "#FB8C00",
    700: "#F57C00",
    800: "#EF6C00",
    900: "#E65100",
  },

  // Error/Red Colors
  red: {
    50: "#FFEBEE",
    100: "#FFCDD2",
    200: "#EF9A9A",
    300: "#E57373",
    400: "#EF5350",
    500: "#F44336", // Main error red
    600: "#E53935",
    700: "#D32F2F",
    800: "#C62828",
    900: "#B71C1C",
    deep: "#FF5722",
  },

  // Yellow Colors
  yellow: {
    50: "#FFF9E6",
    100: "#FFF3CD",
    200: "#FFE69C",
    300: "#FFDB6A",
    400: "#FFD039",
    500: "#FFC107", // Main yellow
    600: "#FFB300",
    700: "#FFA000",
    800: "#FF8F00",
    900: "#FF6F00",
  },

  // Gray/Neutral Colors
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#666666",
    800: "#424242",
    900: "#212121",
    999: "#999999",
  },

  // Slate/Cool Gray Colors
  slate: {
    50: "#F9FAFB",
    100: "#F7FAFC",
    200: "#EDF2F7",
    300: "#E2E8F0",
    400: "#CBD5E0",
    500: "#A0AEC0",
    600: "#718096",
    700: "#4A5568",
    800: "#2D3748",
    900: "#1A202C",
  },

  // Blue Gray Colors
  blueGray: {
    50: "#F4F7FC",
    100: "#EBF8FF",
    200: "#BEE3F8",
    300: "#90CDF4",
    400: "#63B3ED",
    500: "#4299E1",
    600: "#3182CE",
    700: "#2C5282",
    800: "#2A4365",
    900: "#1A365D",
  },

  // Indigo Colors (for custom primary)
  indigo: {
    50: "#E3F2FD",
    500: "#1a73e8",
    600: "#2563EB",
    700: "#3B82F6",
  },

  // Emerald Colors
  emerald: {
    500: "#10B981",
  },

  // Base Colors
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

/**
 * Semantic Color Mappings
 *
 * Maps semantic meaning to specific colors from the palette.
 * Use these in your components for better maintainability.
 */
export const AppColors = {
  // Primary brand colors
  primary: ColorPalette.blue[500],
  primaryLight: ColorPalette.blue[50],
  primaryDark: ColorPalette.blue[700],
  secondary: ColorPalette.indigo[700],
  accent: ColorPalette.emerald[500],
  info: ColorPalette.blue[500],

  // Status colors
  success: ColorPalette.green[500],
  successLight: ColorPalette.green.light,
  successBorder: ColorPalette.green.border,
  successDark: ColorPalette.green.dark,
  successBackground: ColorPalette.green[50],
  successText: ColorPalette.green[800],

  warning: ColorPalette.orange[500],
  warningLight: ColorPalette.orange[50],
  warningDark: ColorPalette.orange[700],
  warningText: ColorPalette.orange[900],
  warningBackground: ColorPalette.yellow[50],
  warningBorder: ColorPalette.yellow[500],

  error: ColorPalette.red[500],
  errorLight: ColorPalette.red[50],
  errorDark: ColorPalette.red[800],
  errorDeep: ColorPalette.red.deep,
  errorText: ColorPalette.red[800],

  // Anemia severity colors
  anemia: {
    none: ColorPalette.green[500],
    mild: ColorPalette.yellow[500],
    moderate: ColorPalette.orange[500],
    severe: ColorPalette.red[500],
  },
  disabled: ColorPalette.gray[500],
  // Text colors
  text: {
    primary: ColorPalette.gray[900],
    secondary: ColorPalette.gray[700],
    tertiary: ColorPalette.gray[999],
    disabled: ColorPalette.gray[500],
    placeholder: ColorPalette.slate[500],
    inverse: ColorPalette.white,
  },

  // Background colors
  background: {
    primary: ColorPalette.white,
    secondary: ColorPalette.gray[100],
    tertiary: ColorPalette.blueGray[50],
    screen: ColorPalette.slate[50],
    input: ColorPalette.white,
    inputAlt: ColorPalette.slate[100],
    disabled: ColorPalette.gray[300],
    blue: ColorPalette.blue[50],
    info: ColorPalette.blueGray[100],
    success: ColorPalette.green[500],
  },

  // Border colors
  border: {
    light: ColorPalette.gray[300],
    medium: ColorPalette.slate[300],
    dark: ColorPalette.gray[800],
  },

  // Shadow colors
  shadow: ColorPalette.black,

  // Icon colors
  icon: {
    primary: ColorPalette.blue[500],
    secondary: ColorPalette.gray[700],
    success: ColorPalette.green[500],
    warning: ColorPalette.orange[500],
    error: ColorPalette.red[500],
  },

  // Role colors
  role: {
    doctor: ColorPalette.blue[500],
    other: ColorPalette.green[500],
    none: ColorPalette.gray[500],
  },

  // Special colors
  white: ColorPalette.white,
  black: ColorPalette.black,
  transparent: ColorPalette.transparent,
} as const;

/**
 * Helper function to add transparency to hex colors
 * @param color - Hex color code
 * @param opacity - Opacity value (0-1)
 * @returns Color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return `${color}${alpha}`;
};

/**
 * Get anemia severity color
 * @param severity - Anemia severity level
 * @returns Color code
 */
export const getAnemiaSeverityColor = (
  severity: string | null | undefined
): string => {
  if (!severity) return AppColors.anemia.none;

  switch (severity.toUpperCase()) {
    case "NONE":
      return AppColors.anemia.none;
    case "MILD":
    case "LEVE":
      return AppColors.anemia.mild;
    case "MODERATE":
    case "MODERADA":
      return AppColors.anemia.moderate;
    case "SEVERE":
    case "SEVERA":
      return AppColors.anemia.severe;
    default:
      return AppColors.text.secondary;
  }
};

/**
 * Get role-based color
 * @param role - User role
 * @returns Color code
 */
export const getRoleColor = (role: string | null | undefined): string => {
  if (!role) return AppColors.role.none;
  return role === "DOCTOR" ? AppColors.role.doctor : AppColors.role.other;
};
