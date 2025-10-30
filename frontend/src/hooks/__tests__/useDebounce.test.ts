import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce, useDebouncedCallback } from '../useDebounce';

describe('useDebounce Hook', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('初始值应该立即返回', () => {
        const { result } = renderHook(() => useDebounce('initial', 500));
        expect(result.current).toBe('initial');
    });

    test('值在延迟后更新', async () => {
        const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
            initialProps: { value: 'initial', delay: 500 }
        });

        expect(result.current).toBe('initial');

        // 更新值
        rerender({ value: 'updated', delay: 500 });

        // 值应该还是旧的
        expect(result.current).toBe('initial');

        // 快进时间
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // 现在值应该更新了
        await waitFor(() => {
            expect(result.current).toBe('updated');
        });
    });

    test('快速连续更新只保留最后一个值', async () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
            initialProps: { value: 'initial' }
        });

        // 快速连续更新
        rerender({ value: 'update1' });
        rerender({ value: 'update2' });
        rerender({ value: 'update3' });

        // 快进时间
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // 应该只有最后一个值被应用
        await waitFor(() => {
            expect(result.current).toBe('update3');
        });
    });
});

describe('useDebouncedCallback Hook', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('回调在延迟后执行', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 500));

        // 调用防抖回调
        act(() => {
            result.current('test');
        });

        // 回调还没执行
        expect(callback).not.toHaveBeenCalled();

        // 快进时间
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // 现在回调应该执行了
        expect(callback).toHaveBeenCalledWith('test');
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('快速连续调用只执行最后一次', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useDebouncedCallback(callback, 500));

        // 快速连续调用
        act(() => {
            result.current('call1');
            result.current('call2');
            result.current('call3');
        });

        // 快进时间
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // 只执行最后一次
        expect(callback).toHaveBeenCalledWith('call3');
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
