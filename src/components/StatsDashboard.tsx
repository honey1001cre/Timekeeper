"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeEntry } from '@/hooks/useStorage';
import { formatDuration } from '@/lib/utils';
import {
    startOfDay, endOfDay, subDays,
    startOfWeek, endOfWeek,
    startOfMonth, endOfMonth,
    isWithinInterval
} from 'date-fns';

interface StatsDashboardProps {
    entries: TimeEntry[];
}

export const StatsDashboard = ({ entries }: StatsDashboardProps) => {
    const now = new Date();

    const getStats = (start: Date, end: Date) => {
        return entries
            .filter((e) => e.endTime && isWithinInterval(new Date(e.startTime), { start, end }))
            .reduce((acc, curr) => acc + curr.durationSeconds, 0);
    };

    const stats = [
        {
            title: '今日の合計時間',
            value: getStats(startOfDay(now), endOfDay(now)),
        },
        {
            title: '昨日の合計時間',
            value: getStats(startOfDay(subDays(now, 1)), endOfDay(subDays(now, 1))),
        },
        {
            title: '先週の合計時間',
            value: getStats(startOfWeek(subDays(now, 7)), endOfWeek(subDays(now, 7))),
        },
        {
            title: '先月の合計時間',
            value: getStats(startOfMonth(subDays(now, 30)), endOfMonth(subDays(now, 30))),
        },
        {
            title: '全期間の総計時間',
            value: entries.reduce((acc, curr) => acc + curr.durationSeconds, 0),
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
            {stats.map((stat) => (
                <Card key={stat.title} className="bg-white/[0.02] backdrop-blur-xl border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                    <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                            {stat.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-xl font-bold text-primary font-mono tracking-tighter">
                            {formatDuration(stat.value)}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
