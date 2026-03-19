import { useState, useRef, useEffect } from 'react';

export const useThrottle = <T>(value: T, delay = 300) => {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(0);

    useEffect(() => {
        const now = Date.now();
        const remaining = delay - (now - lastExecuted.current);

        if (remaining <= 0) {
            setThrottledValue(value);
            lastExecuted.current = now;
        } else {
            const timeout = setTimeout(() => {
                setThrottledValue(value);
                lastExecuted.current = Date.now();
            }, remaining);

            return () => clearTimeout(timeout);
        }
    }, [value, delay]);

    return throttledValue;
};