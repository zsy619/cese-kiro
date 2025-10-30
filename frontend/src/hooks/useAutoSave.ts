import { useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';
import { useDebouncedCallback } from './useDebounce';

export interface AutoSaveOptions {
  delay?: number;
  enabled?: boolean;
  onSave?: (data: any) => Promise<void> | void;
  onError?: (error: Error) => void;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useAutoSave<T>(
  data: T,
  options: AutoSaveOptions = {}
) {
  const {
    delay = 2000,
    enabled = true,
    onSave,
    onError,
    showSuccessMessage = true,
    showErrorMessage = true,
    successMessage = '自动保存成功',
    errorMessage = '自动保存失败'
  } = options;

  const lastSavedData = useRef<T>(data);
  const isSaving = useRef(false);

  // 检查数据是否发生变化
  const hasDataChanged = useCallback((newData: T, oldData: T): boolean => {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
  }, []);

  // 执行保存操作
  const performSave = useCallback(async (dataToSave: T) => {
    if (!onSave || isSaving.current) return;

    try {
      isSaving.current = true;
      await onSave(dataToSave);
      lastSavedData.current = dataToSave;
      
      if (showSuccessMessage) {
        message.success(successMessage);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('保存失败');
      
      if (onError) {
        onError(err);
      }
      
      if (showErrorMessage) {
        message.error(errorMessage);
      }
    } finally {
      isSaving.current = false;
    }
  }, [onSave, onError, showSuccessMessage, showErrorMessage, successMessage, errorMessage]);

  // 防抖保存函数
  const debouncedSave = useDebouncedCallback(performSave, delay);

  // 监听数据变化并触发自动保存
  useEffect(() => {
    if (!enabled || !hasDataChanged(data, lastSavedData.current)) {
      return;
    }

    debouncedSave(data);
  }, [data, enabled, hasDataChanged, debouncedSave]);

  // 手动保存函数
  const manualSave = useCallback(() => {
    if (hasDataChanged(data, lastSavedData.current)) {
      performSave(data);
    }
  }, [data, hasDataChanged, performSave]);

  // 检查是否有未保存的更改
  const hasUnsavedChanges = hasDataChanged(data, lastSavedData.current);

  return {
    manualSave,
    hasUnsavedChanges,
    isSaving: isSaving.current
  };
}

// 表单自动保存 Hook
export function useFormAutoSave<T extends Record<string, any>>(
  formData: T,
  options: AutoSaveOptions & {
    storageKey?: string;
    excludeFields?: (keyof T)[];
  } = {}
) {
  const {
    storageKey = 'form_auto_save',
    excludeFields = [],
    ...autoSaveOptions
  } = options;

  // 过滤掉排除的字段
  const filteredData = Object.keys(formData).reduce((acc, key) => {
    if (!excludeFields.includes(key)) {
      (acc as any)[key] = formData[key];
    }
    return acc;
  }, {} as Partial<T>);

  // 保存到本地存储
  const saveToStorage = useCallback(async (data: Partial<T>) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to save form data to localStorage:', error);
      throw error;
    }
  }, [storageKey]);

  // 从本地存储恢复数据
  const restoreFromStorage = useCallback((): Partial<T> | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        // 检查数据是否过期（24小时）
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to restore form data from localStorage:', error);
    }
    return null;
  }, [storageKey]);

  // 清除存储的数据
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear form data from localStorage:', error);
    }
  }, [storageKey]);

  // 使用自动保存
  const autoSaveResult = useAutoSave(filteredData, {
    ...autoSaveOptions,
    onSave: saveToStorage
  });

  return {
    ...autoSaveResult,
    restoreFromStorage,
    clearStorage
  };
}