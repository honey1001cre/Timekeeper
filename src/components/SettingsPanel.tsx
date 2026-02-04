"use client";

import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppSettings } from '@/hooks/useSettings';

interface SettingsPanelProps {
    settings: AppSettings;
    onChartColorPreset: (preset: string) => void;
    onBackgroundTheme: (theme: AppSettings['backgroundTheme']) => void;
    colorPresets: Record<string, string[]>;
}

const PRESET_LABELS: Record<string, string> = {
    default: 'デフォルト',
    ocean: 'オーシャン',
    sunset: 'サンセット',
    forest: 'フォレスト',
    candy: 'キャンディ',
};

const THEME_LABELS: Record<string, string> = {
    purple: 'パープル',
    blue: 'ブルー',
    green: 'グリーン',
    orange: 'オレンジ',
    pink: 'ピンク',
};

const THEME_COLORS: Record<string, string> = {
    purple: 'bg-violet-600',
    blue: 'bg-blue-600',
    green: 'bg-emerald-600',
    orange: 'bg-orange-600',
    pink: 'bg-pink-600',
};

export const SettingsPanel = ({
    settings,
    onChartColorPreset,
    onBackgroundTheme,
    colorPresets,
}: SettingsPanelProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const getCurrentPresetName = () => {
        for (const [name, colors] of Object.entries(colorPresets)) {
            if (JSON.stringify(colors) === JSON.stringify(settings.chartColors)) {
                return name;
            }
        }
        return 'default';
    };

    return (
        <>
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full transition-all hover:scale-110 active:scale-95 shadow-2xl"
                aria-label="設定を開く"
            >
                <Settings className="w-5 h-5 text-white/70" />
            </button>

            {/* Panel Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 z-50 h-full w-80 bg-[#0a0a15]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h2 className="text-lg font-bold text-white">設定</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/70" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-8">
                                {/* Chart Colors */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                                        円グラフのカラー
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(colorPresets).map(([name, colors]) => (
                                            <button
                                                key={name}
                                                onClick={() => onChartColorPreset(name)}
                                                className={`w-full p-3 rounded-lg border transition-all ${getCurrentPresetName() === name
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-white/90">
                                                        {PRESET_LABELS[name] || name}
                                                    </span>
                                                    {getCurrentPresetName() === name && (
                                                        <span className="text-xs text-primary">選択中</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    {colors.map((color, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-6 h-6 rounded-full"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Background Theme */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                                        背景カラー
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {Object.keys(THEME_LABELS).map((theme) => (
                                            <button
                                                key={theme}
                                                onClick={() => onBackgroundTheme(theme as AppSettings['backgroundTheme'])}
                                                className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${settings.backgroundTheme === theme
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full ${THEME_COLORS[theme]}`} />
                                                <span className="text-xs text-white/70">
                                                    {THEME_LABELS[theme]}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
