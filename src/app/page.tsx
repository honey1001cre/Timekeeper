"use client";

import { useStorage } from "@/hooks/useStorage";
import { useTimer } from "@/hooks/useTimer";
import { useSettings } from "@/hooks/useSettings";
import { VisualTimer } from "@/components/VisualTimer";
import { TaskInput } from "@/components/TaskInput";
import { StatsDashboard } from "@/components/StatsDashboard";
import { HistoryCalendar } from "@/components/HistoryCalendar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Timer, ArrowLeftCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { isSameDay } from "date-fns";

// Lightweight background color map (reduced opacity for performance)
const BACKGROUND_COLOR_MAP: Record<string, { primary: string; secondary: string }> = {
  purple: { primary: 'from-primary/15 to-violet-600/10', secondary: 'from-violet-600/10 to-primary/15' },
  blue: { primary: 'from-blue-600/15 to-cyan-500/10', secondary: 'from-cyan-500/10 to-blue-600/15' },
  green: { primary: 'from-emerald-600/15 to-teal-500/10', secondary: 'from-teal-500/10 to-emerald-600/15' },
  orange: { primary: 'from-orange-600/15 to-amber-500/10', secondary: 'from-amber-500/10 to-orange-600/15' },
  pink: { primary: 'from-pink-600/15 to-rose-500/10', secondary: 'from-rose-500/10 to-pink-600/15' },
};

// Reduced particles (50 -> 15)
const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 13) % 100}%`,
  delay: `${(i * 0.2) % 3}s`,
  duration: `${3 + (i % 3)}s`,
}));

export default function Home() {
  const { entries, addEntry, isLoaded } = useStorage();
  const { settings, isLoaded: settingsLoaded, setChartColorPreset, setBackgroundTheme, COLOR_PRESETS } = useSettings();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [mounted, setMounted] = useState(false);

  const {
    isRunning,
    taskName,
    elapsedSeconds,
    startTimer,
    stopTimer,
    setTaskName,
  } = useTimer(addEntry);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const bgColors = useMemo(() => {
    return BACKGROUND_COLOR_MAP[settings.backgroundTheme] || BACKGROUND_COLOR_MAP.purple;
  }, [settings.backgroundTheme]);

  if (!mounted || !isLoaded || !settingsLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050508] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium opacity-70">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020205] text-white selection:bg-primary/30 font-sans antialiased relative overflow-hidden">
      {/* Settings Panel */}
      <SettingsPanel
        settings={settings}
        onChartColorPreset={setChartColorPreset}
        onBackgroundTheme={setBackgroundTheme}
        colorPresets={COLOR_PRESETS}
      />

      {/* Ultra-lightweight Premium Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0a15] to-[#020205]"></div>

        {/* Simple corner gradients (no blur, no animation - pure CSS) */}
        <div className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial ${bgColors.primary} opacity-60`}></div>
        <div className={`absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial ${bgColors.secondary} opacity-60`}></div>

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]"></div>

        {/* Minimal particles (CSS only, no JS animation) */}
        <div className="absolute inset-0 pointer-events-none">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute w-[1px] h-[1px] bg-white/30 rounded-full animate-pulse"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        {/* Premium edge highlight (top only) */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-primary/90 to-white bg-clip-text text-transparent">
          時間を、美しく刻む
        </h1>
        <p className="text-muted-foreground/80 mt-2 text-sm md:text-base">
          Chronos Timekeeper
        </p>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pb-8 space-y-6">
        {/* Timer Section */}
        <div className="flex flex-col items-center gap-6">
          <VisualTimer
            entries={entries}
            isRunning={isRunning}
            currentElapsedSeconds={elapsedSeconds}
            displayDate={selectedDate}
            chartColors={settings.chartColors}
            currentTaskName={taskName}
          />

          {/* Task Input */}
          <TaskInput
            isRunning={isRunning}
            onStart={startTimer}
            onStop={stopTimer}
            currentTaskName={taskName}
            elapsedSeconds={elapsedSeconds}
          />
        </div>

        {/* Dashboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stats */}
          <StatsDashboard entries={entries} />

          {/* Calendar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {selectedDate && !isSameDay(selectedDate, new Date()) && (
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeftCircle className="w-4 h-4" />
                  今日に戻る
                </button>
              )}
            </div>
            <HistoryCalendar
              entries={entries}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 pb-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground/60 text-sm">
            <Timer className="w-4 h-4" />
            <span>Chronos Timekeeper</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
