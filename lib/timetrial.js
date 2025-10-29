import { useState, useEffect } from "react";

export function useTimer(duration, onFinish) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);

    const startTimer = () => {
        setTimeLeft(duration);
        setIsActive(true);
    };

    useEffect(() => {
        if (!isActive) return;
        if (timeLeft <= 0) {
            setIsActive(false);
            onFinish?.();
            return;
        }

        const timerId = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timerId);
    }, [timeLeft, isActive, onFinish]);

    return { timeLeft, isActive, startTimer };
}
