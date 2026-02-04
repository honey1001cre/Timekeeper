"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Square, Timer } from 'lucide-react';

interface TaskInputProps {
    isRunning: boolean;
    onStart: (name: string) => void;
    onStop: () => void;
    currentTaskName: string;
    elapsedSeconds: number;
}

export const TaskInput = ({ isRunning, onStart, onStop, currentTaskName, elapsedSeconds }: TaskInputProps) => {
    const [name, setName] = useState('');

    const handleAction = () => {
        if (isRunning) {
            onStop();
        } else {
            onStart(name);
            setName('');
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div className="relative group">
                <Input
                    placeholder="今日は何をしますか？"
                    value={isRunning ? currentTaskName : name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isRunning}
                    className="pr-12 h-16 text-lg bg-white/[0.03] border-white/10 focus:border-primary/50 transition-all shadow-2xl rounded-2xl"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Timer className="w-6 h-6" />
                </div>
            </div>

            <Button
                onClick={handleAction}
                className={`h-24 text-xl font-black shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center gap-1 border-b-4 rounded-3xl ${isRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-800'
                    : 'bg-primary hover:bg-primary/90 text-white border-primary-foreground/10'
                    }`}
            >
                {isRunning ? (
                    <div className="flex items-center gap-3">
                        <Square className="w-7 h-7 fill-current" />
                        <span>計測を終了</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Play className="w-7 h-7 fill-current" />
                        <span>計測を開始</span>
                    </div>
                )}
            </Button>

            {isRunning && (
                <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700 bg-white/5 py-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-2">LIVE TIMER</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                        <p className="text-5xl font-black font-mono text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            {formatTime(elapsedSeconds)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
