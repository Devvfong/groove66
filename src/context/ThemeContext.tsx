import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  lightColors,
  getThemeColors,
  spacing,
  radius,
  typography,
  type ThemeColors,
} from '../theme/tokens';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
// Backward-compatibility alias
export type ThemeMode = ResolvedTheme;

export interface ThemeContextType {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  mode: ResolvedTheme;
  isDark: boolean;
  setThemePreference: (pref: ThemePreference) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const THEME_STORAGE_KEY = '@groove66_theme_preference';

const defaultContext: ThemeContextType = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  themePreference: 'system',
  resolvedTheme: 'light',
  mode: 'light',
  isDark: false,
  setThemePreference: async () => {},
  toggleTheme: async () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const ThemeProvider: React.FC<{
  children: ReactNode;
  initialPreference?: ThemePreference;
}> = ({ children, initialPreference = 'system' }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setPreferenceState] = useState<ThemePreference>(initialPreference);

  // Hydrate saved preference from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (isMounted && saved && (saved === 'system' || saved === 'light' || saved === 'dark')) {
          setPreferenceState(saved as ThemePreference);
        }
      } catch (err) {
        // Fall back gracefully to initial preference
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const setThemePreference = useCallback(async (pref: ThemePreference) => {
    setPreferenceState(pref);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch (err) {
      // Non-fatal if storage fails
    }
  }, []);

  // Compute resolved active theme ('light' or 'dark')
  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (themePreference === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themePreference;
  }, [themePreference, systemColorScheme]);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = useCallback(async () => {
    // If currently dark, switch to light; if light, switch to dark
    const nextPref: ThemePreference = isDark ? 'light' : 'dark';
    await setThemePreference(nextPref);
  }, [isDark, setThemePreference]);

  const activeColors = useMemo(() => getThemeColors(resolvedTheme), [resolvedTheme]);

  const value = useMemo<ThemeContextType>(
    () => ({
      colors: activeColors,
      spacing,
      radius,
      typography,
      themePreference,
      resolvedTheme,
      mode: resolvedTheme,
      isDark,
      setThemePreference,
      toggleTheme,
    }),
    [activeColors, themePreference, resolvedTheme, isDark, setThemePreference, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
