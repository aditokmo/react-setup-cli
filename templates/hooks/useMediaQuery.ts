import { useState, useEffect } from 'react';

export const useMediaQuery = (mediaQuery: string): boolean => {
    const [isMediaQueryMatching, setIsMediaQueryMatching] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(mediaQuery).matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQueryList = window.matchMedia(mediaQuery);

        setIsMediaQueryMatching(mediaQueryList.matches);

        const listener = (event: MediaQueryListEvent) => setIsMediaQueryMatching(event.matches);

        mediaQueryList.addEventListener('change', listener);
        return () => mediaQueryList.removeEventListener('change', listener);
    }, [mediaQuery]);

    return isMediaQueryMatching;
}