"use client";

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeEntry } from '@/hooks/useStorage';
import { formatDuration } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';

interface HistoryCalendarProps {
    entries: TimeEntry[];
    selectedDate: Date | undefined;
    onDateSelect: (date: Date | undefined) => void;
}

export const HistoryCalendar = ({ entries, selectedDate, onDateSelect }: HistoryCalendarProps) => {
    const getDayTotal = (day: Date) => {
        return entries
            .filter((e) => e.endTime && isSameDay(new Date(e.startTime), day))
            .reduce((acc, curr) => acc + curr.durationSeconds, 0);
    };

    // ヒートマップの色の濃さを決定する関数
    const getIntensity = (seconds: number) => {
        if (seconds === 0) return '';
        if (seconds < 3600) return 'bg-primary/20 text-primary-foreground'; // 1時間未満
        if (seconds < 3600 * 3) return 'bg-primary/40 text-primary-foreground'; // 3時間未満
        if (seconds < 3600 * 5) return 'bg-primary/60 text-primary-foreground'; // 5時間未満
        return 'bg-primary/80 text-primary-foreground'; // 5時間以上
    };

    return (
        <Card className="w-full bg-white/[0.02] backdrop-blur-xl border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.01] p-8">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <span>履歴カレンダー</span>
                    {selectedDate && (
                        <span className="text-sm font-normal text-muted-foreground">
                            - {format(selectedDate, 'yyyy年MM月dd日', { locale: ja })}: {formatDuration(getDayTotal(selectedDate))}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onDateSelect}
                    locale={ja}
                    className="rounded-md border-none shadow-none p-0 mx-auto w-full"
                    classNames={{
                        day: "h-10 w-10 md:h-14 md:w-14 p-0 font-normal aria-selected:opacity-100 flex flex-col items-center justify-start py-1 relative",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground border-2 border-primary/20",
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-2 w-full",
                        table: "w-full border-collapse",
                        head_row: "flex w-full",
                        head_cell: "text-muted-foreground rounded-md w-10 md:w-14 font-normal text-[0.7rem] md:text-[0.8rem]",
                        row: "flex w-full mt-1",
                    }}
                    components={{
                        Day: (props) => {
                            const { day, modifiers } = props;
                            const dayDate = day.date;
                            const total = getDayTotal(dayDate);
                            const intensity = getIntensity(total);
                            const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
                            const isOutside = modifiers.outside;

                            return (
                                <div
                                    onClick={() => onDateSelect(dayDate)}
                                    className={`h-10 w-10 md:h-14 md:w-14 flex flex-col items-center justify-between py-1 md:py-2 cursor-pointer transition-colors border border-primary/10 ${intensity} ${isSelected ? 'ring-2 ring-primary ring-inset' : ''} ${isOutside ? 'opacity-10 grayscale pointer-events-none' : 'hover:bg-white/10'}`}
                                >
                                    <span className={`text-xs md:text-sm font-bold ${isOutside ? 'text-white/20' : 'text-white'}`}>
                                        {format(dayDate, 'd')}
                                    </span>
                                    {total > 0 && (
                                        <span className={`text-[8px] md:text-[11px] font-black drop-shadow-md ${isOutside ? 'text-white/10' : 'text-white'}`}>
                                            {formatDuration(total)}
                                        </span>
                                    )}
                                </div>
                            );
                        },
                    }}
                />
            </CardContent>
        </Card>
    );
};
