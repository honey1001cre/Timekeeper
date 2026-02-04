"use client";

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { format, isSameDay } from 'date-fns';

interface VisualTimerProps {
    entries: { taskName: string; durationSeconds: number; startTime: string }[];
    currentTaskName?: string;
    currentElapsedSeconds: number;
    isRunning: boolean;
    displayDate?: Date;
    chartColors?: string[];
}

export const VisualTimer = ({
    entries,
    currentTaskName,
    currentElapsedSeconds,
    isRunning,
    displayDate = new Date(),
    chartColors,
}: VisualTimerProps) => {
    const isToday = useMemo(() => {
        return new Date().toDateString() === displayDate.toDateString();
    }, [displayDate]);

    const data = useMemo(() => {
        const dailyEntries = entries.filter(
            (e) => isSameDay(new Date(e.startTime), displayDate)
        );

        const aggregates: Record<string, number> = {};
        dailyEntries.forEach((e) => {
            aggregates[e.taskName] = (aggregates[e.taskName] || 0) + e.durationSeconds;
        });

        if (isRunning && currentTaskName && isToday) {
            aggregates[currentTaskName] = (aggregates[currentTaskName] || 0) + currentElapsedSeconds;
        }

        const chartData = Object.entries(aggregates).map(([name, value]) => ({
            name,
            value,
        }));

        if (chartData.length === 0) {
            return [{ name: 'No Data', value: 1 }];
        }

        return chartData;
    }, [entries, currentTaskName, currentElapsedSeconds, isRunning, displayDate, isToday]);

    const totalToday = useMemo(() => {
        return data.reduce((acc, curr) => acc + (curr.name === 'No Data' ? 0 : curr.value), 0);
    }, [data]);

    const COLORS = chartColors || ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const formatDisplayTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full aspect-square max-w-[350px] md:max-w-[650px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="85%"
                        paddingAngle={3}
                        isAnimationActive={!isRunning || !isToday}
                        stroke="none"
                        labelLine={{ stroke: 'rgba(255, 255, 255, 0.15)', strokeWidth: 1 }}
                        label={({ name, x, y, textAnchor }) => {
                            if (name === 'No Data') return null;
                            return (
                                <text
                                    x={x}
                                    y={y}
                                    fill="white"
                                    textAnchor={textAnchor}
                                    className="text-[8px] md:text-[10px] font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                                >
                                    {name}
                                </text>
                            );
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.name === 'No Data' ? '#333' : COLORS[index % COLORS.length]}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        ))}
                        <Label
                            content={({ viewBox }) => {
                                const { cx, cy } = viewBox as { cx: number; cy: number };
                                return (
                                    <g>
                                        <text
                                            x={cx}
                                            y={cy - 10}
                                            className="fill-white text-3xl md:text-5xl font-black font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                        >
                                            {formatDisplayTime(isRunning && isToday ? currentElapsedSeconds : totalToday)}
                                        </text>
                                        <text
                                            x={cx}
                                            y={cy + 20}
                                            className="fill-white/80 text-xs md:text-base font-semibold tracking-wide"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                        >
                                            {isRunning && isToday
                                                ? `本日合計: ${formatDisplayTime(totalToday)}`
                                                : isToday ? '今日の合計時間' : `${format(displayDate, 'M/d')} の合計時間`}
                                        </text>
                                        {isRunning && isToday && (
                                            <text
                                                x={cx}
                                                y={cy + 55}
                                                className="fill-primary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse"
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                            >
                                                {currentTaskName} 計測中
                                            </text>
                                        )}
                                    </g>
                                );
                            }}
                        />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
