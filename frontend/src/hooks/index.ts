// 响应式设计 Hooks
export {
  useResponsive,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsDarkMode,
  useIsReducedMotion
} from './useResponsive';
export type { BreakpointConfig, ResponsiveInfo } from './useResponsive';

// 本地存储 Hooks
export {
  useLocalStorage,
  useSessionStorage,
  useUserPreferences
} from './useLocalStorage';
export type { UserPreferences } from './useLocalStorage';

// 防抖和节流 Hooks
export {
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
  useSearchDebounce
} from './useDebounce';

// 自动保存 Hooks
export {
  useAutoSave,
  useFormAutoSave
} from './useAutoSave';
export type { AutoSaveOptions } from './useAutoSave';