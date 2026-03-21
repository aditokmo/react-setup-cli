import { useState, useCallback } from 'react';

export const useToggle = (initialValue: boolean = false) => {
    const [isToggled, setIsToggled] = useState<boolean>(initialValue);

    const toggle = useCallback(() => setIsToggled((prev) => !prev), []);

    return [isToggled, toggle] as const;
}