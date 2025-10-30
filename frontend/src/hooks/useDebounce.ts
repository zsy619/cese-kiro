import { useState, useEffect, useCallback, useRef } from 'react';

// 防抖 Hook
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// 防抖回调 Hook
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // 更新回调引用
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // 清理定时器
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        }) as T,
        [delay]
    );
}

// 节流 Hook
export function useThrottle<T>(value: T, limit: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastRan = useRef<number>(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRan.current >= limit) {
                setThrottledValue(value);
                lastRan.current = Date.now();
            }
        }, limit - (Date.now() - lastRan.current));

        return () => {
            clearTimeout(handler);
        };
    }, [value, limit]);

    return throttledValue;
}

// 节流回调 Hook
export function useThrottledCallback<T extends (...args: any[]) => any>(
    callback: T,
    limit: number
): T {
    const callbackRef = useRef(callback);
    const lastRan = useRef<number>(0);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback(
        ((...args: Parameters<T>) => {
            if (Date.now() - lastRan.current >= limit) {
                callbackRef.current(...args);
                lastRan.current = Date.now();
            }
        }) as T,
        [limit]
    );
}

// 搜索防抖 Hook
export function useSearchDebounce(
    searchTerm: string,
    delay: number = 300
): {
    debouncedSearchTerm: string;
    isSearching: boolean;
} {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setIsSearching(true);

        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setIsSearching(false);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, delay]);

    return { debouncedSearchTerm, isSearching };
}
