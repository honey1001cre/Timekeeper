"use client";

import { useState, useEffect } from 'react';

export interface AppSettings {
    chartColors: string[];
    backgroundTheme: 'purple' | 'blue' | 'green' | 'orange' | 'pink';
}

const SETTINGS_KEY = 'chronos_settings';

const COLOR_PRESETS = {
    default: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    ocean: ['#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e', '#84cc16', '#eab308'],
    sunset: ['#f97316', '#ef4444', '#ec4899', '#a855f7', '#6366f1', '#3b82f6'],
    forest: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'],
    candy: ['#f472b6', '#c084fc', '#818cf8', '#60a5fa', '#38bdf8', '#22d3ee'],
};

const BACKGROUND_THEMES = {
    purple: { primary: 'violet-600', secondary: 'primary', accent1: 'blue-500', accent2: 'fuchsia-500' },
    blue: { primary: 'blue-600', secondary: 'cyan-500', accent1: 'indigo-500', accent2: 'sky-500' },
    green: { primary: 'emerald-600', secondary: 'teal-500', accent1: 'green-500', accent2: 'lime-500' },
    orange: { primary: 'orange-600', secondary: 'amber-500', accent1: 'yellow-500', accent2: 'red-500' },
    pink: { primary: 'pink-600', secondary: 'rose-500', accent1: 'fuchsia-500', accent2: 'purple-500' },
};

const defaultSettings: AppSettings = {
    chartColors: COLOR_PRESETS.default,
    backgroundTheme: 'purple',
};

export const useSettings = () => {
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem(SETTINGS_KEY);
                if (saved) {
                    setSettings({ ...defaultSettings, ...JSON.parse(saved) });
                }
            }
        } catch (e) {
            console.error('Failed to load settings', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        }
    };

    const setChartColorPreset = (preset: string) => {
        if (preset in COLOR_PRESETS) {
            updateSettings({ chartColors: COLOR_PRESETS[preset as keyof typeof COLOR_PRESETS] });
        }
    };

    const setBackgroundTheme = (theme: AppSettings['backgroundTheme']) => {
        updateSettings({ backgroundTheme: theme });
    };

    return {
        settings,
        isLoaded,
        updateSettings,
        setChartColorPreset,
        setBackgroundTheme,
        COLOR_PRESETS,
        BACKGROUND_THEMES,
    };
};
