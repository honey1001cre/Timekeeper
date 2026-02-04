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
import { motion, AnimatePresence } from "framer-motion";

const BACKGROUND_COLOR_MAP: Record<string, { primary: string; secondary: string; accent1: string; accent2: string }> = {
  purple: { primary: 'bg-primary/25', secondary: 'bg-violet-600/25', accent1: 'bg-blue-500/20', accent2: 'bg-fuchsia-500/20' },
  blue: { primary: 'bg-blue-600/25', secondary: 'bg-cyan-500/25', accent1: 'bg-indigo-500/20', accent2: 'bg-sky-500/20' },
  green: { primary: 'bg-emerald-600/25', secondary: 'bg-teal-500/25', accent1: 'bg-green-500/20', accent2: 'bg-lime-500/20' },
  orange: { primary: 'bg-orange-600/25', secondary: 'bg-amber-500/25', accent1: 'bg-yellow-500/20', accent2: 'bg-red-500/20' },
  pink: { primary: 'bg-pink-600/25', secondary: 'bg-rose-500/25', accent1: 'bg-fuchsia-500/20', accent2: 'bg-purple-500/20' },
};

// Pre-generated particle positions (generated once at module load, not during render)
const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 13) % 100}%`,
  delay: `${(i * 0.12) % 3}s`,
  duration: `${2 + (i % 5)}s`,
}));

export default function Home() {
  const { entries, addEntry, isLoaded } = useStorage();
  const { settings, isLoaded: settingsLoaded, setChartColorPreset, setBackgroundTheme, COLOR_PRESETS } = useSettings();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  const {
    isRunning,
    taskName,
    elapsedSeconds,
    startTimer,
    stopTimer
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
      {/* Premium Liquid Background Layers - Enhanced for Visibility */}
      <div className="fixed inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020205] via-[#08081a] to-[#020205]"></div>

        {/* Animated Liquid Orbs - Fixed at Corners to prevent central light bleed */}
        <AnimatePresence>
          {/* Top Left Corner */}
          <motion.div
            animate={{
              x: [-20, 30, -20],
              y: [-20, 20, -20],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute -top-[15%] -left-[15%] w-[45%] h-[45%] ${bgColors.primary} rounded-full blur-[180px]`}
          />

          {/* Bottom Right Corner */}
          <motion.div
            animate={{
              x: [20, -30, 20],
              y: [20, -20, 20],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className={`absolute -bottom-[15%] -right-[15%] w-[45%] h-[45%] ${bgColors.secondary} rounded-full blur-[200px]`}
          />

          {/* Top Right Corner */}
          <motion.div
            animate={{
              x: [10, -20, 10],
              y: [-10, 20, -10],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className={`absolute -top-[10%] -right-[10%] w-[40%] h-[40%] ${bgColors.accent1} rounded-full blur-[160px]`}
          />

          {/* Bottom Left Corner */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.18, 0.1],
              x: [-15, 25, -15],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] ${bgColors.accent2} rounded-full blur-[160px]`}
          />
        </AnimatePresence>

        {/* Noise Overlay for organic feel */}
        <div className="absolute inset-0 bg-noise pointer-events-none opacity-[0.02]"></div>

        {/* Deep Vignette - Increased central dark area to 35% */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]"></div>

        {/* Particle Field (Stars effect) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute w-[2px] h-[2px] bg-white/40 rounded-full animate-twinkle"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-scan" />
        </div>

        {/* Edge Glow (Frame effect) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top edge */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          {/* Bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
          {/* Left edge */}
          <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/15 to-transparent" />
          {/* Right edge */}
          <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-fuchsia-500/15 to-transparent" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center gap-20">
        {/* Header */}
        <header className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl">
            <Timer className="w-5 h-5 text-primary animate-spin-slow" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-90">Chronos</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-center tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent drop-shadow-sm">
            時間を、<br className="md:hidden" />美しく刻む
          </h1>
        </header>

        {/* Main Visual: Donut Chart */}
        <section className="w-full flex flex-col items-center gap-12">
          <div className="w-full flex flex-col items-center gap-8">
            {!isSameDay(selectedDate, new Date()) && (
              <button
                onClick={() => setSelectedDate(new Date())}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-md transition-all group shadow-xl active:scale-95"
              >
                <ArrowLeftCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold tracking-wider">今日に戻る</span>
              </button>
            )}

            <VisualTimer
              entries={entries}
              currentTaskName={taskName}
              currentElapsedSeconds={elapsedSeconds}
              isRunning={isRunning}
              displayDate={selectedDate}
              chartColors={settings.chartColors}
            />
          </div>
          <TaskInput
            isRunning={isRunning}
            onStart={startTimer}
            onStop={stopTimer}
            currentTaskName={taskName}
            elapsedSeconds={elapsedSeconds}
          />
        </section>

        {/* Stats Section */}
        <section className="w-full flex flex-col gap-6">
          <h2 className="text-xl font-bold border-l-4 border-primary pl-4">ダッシュボード</h2>
          <StatsDashboard entries={entries} />
        </section>

        {/* Calendar Section */}
        <section className="w-full flex flex-col gap-6">
          <h2 className="text-xl font-bold border-l-4 border-primary pl-4">履歴</h2>
          <HistoryCalendar
            entries={entries}
            selectedDate={selectedDate}
            onDateSelect={(d) => d && setSelectedDate(d)}
          />
        </section>

        {/* Footer */}
        <footer className="w-full text-center py-10 opacity-40 text-sm">
          <p>© 2026 Chronos. All data is stored locally in your browser.</p>
        </footer>
      </div>
    </main>
  );
}
