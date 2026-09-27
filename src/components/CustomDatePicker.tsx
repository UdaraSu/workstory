'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { fmt } from '@/lib/dates';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  label?: string;
}

export function CustomDatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected date object or current date
  const selectedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewDate, setViewDate] = useState(selectedDate);

  useEffect(() => {
    if (value) {
      setViewDate(new Date(value + 'T00:00:00'));
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSelectDay = (dayNum: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const isoStr = `${year}-${formattedMonth}-${formattedDay}`;
    onChange(isoStr);
    setOpen(false);
  };

  const todayStr = fmt(new Date());

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn outline sm"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.55rem 1.15rem',
          borderRadius: 99,
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-color)',
          color: 'var(--text-main)',
          fontSize: '0.88rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <CalendarIcon size={16} style={{ color: 'var(--primary)' }} />
        <span>{value ? value.replace(/-/g, '/') : 'Select Date'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 100,
            width: 290,
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(16px)',
            animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
              {monthNames[month]} {year}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={handlePrevMonth}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8, textAlign: 'center' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <span key={'empty-' + i} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const formattedMonth = String(month + 1).padStart(2, '0');
              const formattedDay = String(d).padStart(2, '0');
              const currentIso = `${year}-${formattedMonth}-${formattedDay}`;

              const isSelected = value === currentIso;
              const isToday = todayStr === currentIso;

              return (
                <button
                  key={currentIso}
                  type="button"
                  onClick={() => handleSelectDay(d)}
                  className={`datepicker-day-btn ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(todayStr);
                setOpen(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MonthPickerProps {
  value: string; // YYYY-MM
  onChange: (val: string) => void;
}

export function CustomMonthPicker({ value, onChange }: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = value ? parseInt(value.slice(0, 4), 10) : new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleSelectMonth = (monthIndex: number) => {
    const formattedMonth = String(monthIndex + 1).padStart(2, '0');
    onChange(`${year}-${formattedMonth}`);
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn outline sm"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.55rem 1.15rem',
          borderRadius: 99,
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-color)',
          color: 'var(--text-main)',
          fontSize: '0.88rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <CalendarIcon size={16} style={{ color: 'var(--primary)' }} />
        <span>{value ? value.replace('-', '/') : 'Select Month'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 100,
            width: 260,
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(16px)',
            animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
              {year}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setYear(year - 1)}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setYear(year + 1)}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {monthNames.map((m, i) => {
              const formattedMonth = String(i + 1).padStart(2, '0');
              const itemVal = `${year}-${formattedMonth}`;
              const isSelected = value === itemVal;

              return (
                <button
                  key={itemVal}
                  type="button"
                  onClick={() => handleSelectMonth(i)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid transparent',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-base)',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
