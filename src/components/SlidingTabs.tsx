'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

interface SlidingTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function SlidingTabs({ tabs, activeTab, onChange }: SlidingTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  useIsomorphicLayoutEffect(() => {
    const updatePill = () => {
      const activeEl = tabsRef.current[activeTab];
      if (activeEl) {
        setPillStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          ready: true,
        });
      }
    };

    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [activeTab, tabs]);

  return (
    <div
      ref={containerRef}
      className="tabs"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px',
        background: 'var(--tab-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 99,
        marginBottom: '1.5rem',
        userSelect: 'none',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Smooth Sliding Active Background Pill */}
      {pillStyle.ready && (
        <div
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: pillStyle.left,
            width: pillStyle.width,
            background: 'var(--tab-pill-bg)',
            borderRadius: 99,
            boxShadow: 'var(--shadow-sm)',
            transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {tabs.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className="tab-btn"
            ref={el => {
              tabsRef.current[item.id] = el;
            }}
            onClick={() => onChange(item.id)}
            style={{
              position: 'relative',
              zIndex: 2,
              background: isActive && !pillStyle.ready ? 'var(--tab-pill-bg)' : 'transparent',
              border: 'none',
              outline: 'none',
              padding: '0.55rem 1.15rem',
              borderRadius: 99,
              fontSize: '0.88rem',
              fontWeight: 700,
              color: isActive ? 'var(--tab-pill-text)' : 'var(--tab-text)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s ease, transform 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {item.icon}
            <span className={item.shortLabel ? 'tab-btn-label desktop-only' : 'tab-btn-label'}>
              {item.label}
            </span>
            {item.shortLabel && (
              <span className="tab-btn-label mobile-only">
                {item.shortLabel}
              </span>
            )}
            {item.badge !== undefined && item.badge !== null && (
              <span
                className="tab-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 18,
                  height: 18,
                  padding: '0 5px',
                  borderRadius: 99,
                  background: isActive ? 'var(--primary, #2563eb)' : 'var(--warning, #f59e0b)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginLeft: 2,
                  transition: 'background 0.2s ease',
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
