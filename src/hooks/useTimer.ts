import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TimeEntry } from './useStorage';

export const useTimer = (addEntry: (entry: TimeEntry) => void) => {
    const [isRunning, setIsRunning] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning && startTime) {
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                setElapsedSeconds(diff);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, startTime]);

    const startTimer = (name: string) => {
        setTaskName(name || '無題のタスク');
        setStartTime(new Date());
        setElapsedSeconds(0);
        setIsRunning(true);
    };

    const stopTimer = () => {
        if (!isRunning || !startTime) return;

        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

        const newEntry: TimeEntry = {
            id: uuidv4(),
            taskName,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            durationSeconds: duration,
        };

        addEntry(newEntry);
        setIsRunning(false);
        setStartTime(null);
        setElapsedSeconds(0);
        setTaskName('');
    };

    return {
        isRunning,
        taskName,
        elapsedSeconds,
        startTimer,
        stopTimer,
        setTaskName,
    };
};
