import { useAppStore } from '../store/appStore';

export function useTheme() {
  const theme = useAppStore(state => state.preferences.theme);
  const setTheme = useAppStore(state => state.setTheme);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme
  };
}
