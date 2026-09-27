'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DailyEntry, InternshipDetails, InternshipProject, StudentProfile } from '@/types';
import { seedEntries, seedInternship, seedProfile, seedProjects } from '@/lib/mockData';
import { parse, today, workdays } from '@/lib/dates';

type State = {
  onboarded: boolean;
  profile: StudentProfile;
  internship: InternshipDetails;
  entries: DailyEntry[];
  projects: InternshipProject[];
  final: Record<string, string>;
};

const empty: State = {
  onboarded: false,
  profile: seedProfile,
  internship: seedInternship,
  entries: [],
  projects: [],
  final: {},
};

const KEY = 'logbook-v1';

type Ctx = {
  state: State;
  ready: boolean;
  finishOnboarding: (p: StudentProfile, i: InternshipDetails, demo: boolean) => void;
  saveEntry: (e: DailyEntry) => void;
  setFinal: (k: string, v: string) => void;
  reset: () => void;
};

const C = createContext<Ctx | null>(null);

export const useLogbook = () => {
  const context = useContext(C);
  if (!context) {
    throw new Error('useLogbook must be used within a LogbookProvider');
  }
  return context;
};

export function LogbookProvider({ children }: { children: ReactNode }) {
  const [state, set] = useState<State>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) set(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state, ready]);

  const value: Ctx = {
    state,
    ready,
    finishOnboarding: (profile, internship, demo) =>
      set({
        onboarded: true,
        profile,
        internship,
        entries: demo ? seedEntries() : [],
        projects: demo ? seedProjects : [],
        final: {},
      }),
    saveEntry: e =>
      set(s => ({
        ...s,
        entries: [...s.entries.filter(x => x.date !== e.date), e],
      })),
    setFinal: (k, v) =>
      set(s => ({
        ...s,
        final: { ...s.final, [k]: v },
      })),
    reset: () => set(empty),
  };

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useDerived() {
  const { state: s } = useLogbook();
  const t = today();
  const { startDate: a, endDate: b, workingDays: w } = s.internship;
  const all = workdays(a, b, w);
  const past = all.filter(d => d < t);
  const done = (d: string) => s.entries.some(e => e.date === d && e.status === 'COMPLETED');
  const missing = past.filter(d => !done(d));

  let streak = 0;
  for (const d of all.filter(d => d <= t).reverse()) {
    if (done(d)) streak++;
    else if (d !== t) break;
  }

  const days = Math.max(0, Math.round((+parse(t) - +parse(a)) / 864e5));
  const total = Math.round((+parse(b) - +parse(a)) / 864e5) || 1;
  const weeks = Math.ceil(total / 7);

  return {
    missing,
    streak,
    week: Math.min(Math.floor(days / 7) + 1, weeks),
    weeks,
    pct: Math.min(100, Math.round((days / total) * 100)),
    daysLeft: Math.max(0, total - days),
    days,
    completed: s.entries.filter(e => e.status === 'COMPLETED').length,
    rate: past.length ? Math.round(((past.length - missing.length) / past.length) * 100) : 100,
    projects: s.projects.filter(p => p.status === 'IN_PROGRESS').length,
  };
}

