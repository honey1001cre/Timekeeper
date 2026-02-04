"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeEntry } from '@/hooks/useStorage';
import { formatDuration } from '@/lib/utils';
import {
    startOfDay, endOfDay, subDays,
    startOfWeek, endOfWeek,
    startOfMonth, endOfMonth,
    isWithinInterval
} from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StatsDashboardProps {
    entries: TimeEntry[];
}

interface TaskAggregate {
    name: string;
    duration: number;
}

export const StatsDashboard = ({ entries }: StatsDashboardProps) => {
    const now = new Date();
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const getStatsWithTasks = (start: Date, end: Date) => {
        const filtered = entries.filter(
            (e) => e.endTime && isWithinInterval(new Date(e.startTime), { start, end })
        );

        const total = filtered.reduce((acc, curr) => acc + curr.durationSeconds, 0);

        // Aggregate by task name
        const taskMap: Record<string, number> = {};
        filtered.forEach((e) => {
            taskMap[e.taskName] = (taskMap[e.taskName] || 0) + e.durationSeconds;
        });

        // Convert to array and get top 10
        const topTasks: TaskAggregate[] = Object.entries(taskMap)
            .map(([name, duration]) => ({ name, duration }))
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 10);

        return { total, topTasks };
    };

    const getAllTimeStats = () => {
        const total = entries.reduce((acc, curr) => acc + curr.durationSeconds, 0);

        const taskMap: Record<string, number> = {};
        entries.forEach((e) => {
            taskMap[e.taskName] = (taskMap[e.taskName] || 0) + e.durationSeconds;
        });

        const topTasks: TaskAggregate[] = Object.entries(taskMap)
            .map(([name, duration]) => ({ name, duration }))
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 10);

        return { total, topTasks };
    };

    const stats = [
        {
            id: 'today',
            title: '今日の合計時間',
            ...getStatsWithTasks(startOfDay(now), endOfDay(now)),
        },
        {
            id: 'yesterday',
            title: '昨日の合計時間',
            ...getStatsWithTasks(startOfDay(subDays(now, 1)), endOfDay(subDays(now, 1))),
        },
        {
            id: 'lastweek',
            title: '先週の合計時間',
            ...getStatsWithTasks(startOfWeek(subDays(now, 7)), endOfWeek(subDays(now, 7))),
        },
        {
            id: 'lastmonth',
            title: '先月の合計時間',
            ...getStatsWithTasks(startOfMonth(subDays(now, 30)), endOfMonth(subDays(now, 30))),
        },
        {
            id: 'alltime',
            title: '全期間の総計時間',
            ...getAllTimeStats(),
        },
    ];

    const toggleExpand = (id: string) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            {stats.map((stat) => (
                <Card
                    key={stat.id}
                    className="bg-white/[0.02] backdrop-blur-xl border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] cursor-pointer transition-all hover:bg-white/[0.04]"
                    onClick={() => toggleExpand(stat.id)}
                >
                    <CardHeader className="p-3 md:p-4 pb-0">
                        <CardTitle className="text-[10px] md:text-xs font-semibold text-white/70 uppercase tracking-widest flex items-center justify-between">
                            <span>{stat.title}</span>
                            {stat.topTasks.length > 0 && (
                                expandedCard === stat.id ?
                                    <ChevronUp className="w-3 h-3 md:w-4 md:h-4" /> :
                                    <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-2">
                        <div className="text-lg md:text-xl font-bold text-primary font-mono tracking-tighter">
                            {formatDuration(stat.total)}
                        </div>

                        {/* Task breakdown - shown when expanded */}
                        {expandedCard === stat.id && stat.topTasks.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10 space-y-2 md:space-y-3">
                                {stat.topTasks.map((task, index) => (
                                    <div
                                        key={task.name}
                                        className="flex justify-between items-center md:flex-col md:items-start text-[10px] md:text-xs"
                                    >
                                        <span className="text-white/60 truncate max-w-[60%] md:max-w-full">
                                            {index + 1}. {task.name}
                                        </span>
                                        <span className="text-white/80 font-mono md:text-primary md:text-sm md:font-bold md:mt-0.5">
                                            {formatDuration(task.duration)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
