'use client';

import { useMemo, useState } from 'react';
import { 
  FileText, 
  Printer, 
  Calendar as CalendarIcon, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import Shell from '@/components/Shell';
import SlidingTabs from '@/components/SlidingTabs';
import { CustomDatePicker, CustomMonthPicker } from '@/components/CustomDatePicker';
import { useLogbook } from '@/context/LogbookContext';
import { addDays, pretty, today } from '@/lib/dates';

export default function Reports() {
  const { state: s, setFinal } = useLogbook();
  const [tab, setTab] = useState('weekly');
  const [from, setFrom] = useState(addDays(today(), -6));
  const [mon, setMon] = useState(today().slice(0, 7));

  const reportTabs = [
    { id: 'weekly', label: 'Weekly Summary', shortLabel: 'Weekly', icon: <Clock size={15} /> },
    { id: 'monthly', label: 'Monthly Summary', shortLabel: 'Monthly', icon: <CalendarIcon size={15} /> },
    { id: 'final', label: 'Final Report (PDF)', shortLabel: 'Final PDF', icon: <FileText size={15} /> },
  ];

  const done = s.entries
    .filter(e => e.status === 'COMPLETED')
    .sort((a, b) => a.date.localeCompare(b.date));

  const range =
    tab === 'weekly'
      ? done.filter(e => e.date >= from && e.date <= addDays(from, 6))
      : done.filter(e => e.date.startsWith(mon));

  const techs = Array.from(new Set(done.flatMap(e => e.technologies)));

  const def: Record<string, string> = useMemo(
    () => ({
      '1. Student & Company Information': `${s.profile.name} (${s.profile.studentId}), ${s.profile.degree}, ${s.profile.university}.\nInternship Placement: ${s.internship.position} in ${s.internship.department} at ${s.internship.companyName} (${s.internship.startDate} to ${s.internship.endDate}).`,
      '2. Objectives & Company Background':
        'Add your key internship objectives, department scope, and company background.',
      '3. Weekly Timeline Summary': Object.entries(
        done.reduce((a: any, e) => {
          const w = addDays(e.date, -((new Date(e.date + 'T00:00').getDay() + 6) % 7));
          (a[w] = a[w] || []).push(e.activities[0]);
          return a;
        }, {})
      )
        .map(([w, x]: any) => `Week of ${w}: ${x.slice(0, 3).join('; ')}`)
        .join('\n'),
      '4. Core Responsibilities & Projects': s.projects
        .map(p => `${p.name}: ${p.description}`)
        .join('\n'),
      '5. Technology Stack & Key Skills': techs.join(', '),
      '6. Key Engineering Challenges & Solutions': done
        .filter(e => e.challenges)
        .map(e => `${e.challenges}${e.solutions ? ' → ' + e.solutions : ''}`)
        .join('\n'),
      '7. Professional Reflection & Retrospective':
        'Summarize your primary learning outcomes and professional development during this internship.',
    }),
    [s, done, techs]
  );

  return (
    <Shell>
      <div className="noprint">
        <div className="page-header">
          <div>
            <h1 className="page-title">Internship Reports</h1>
            <p className="page-subtitle">Generate weekly, monthly, or official final university reports</p>
          </div>
        </div>

        {/* Smooth Sliding Tabs */}
        <SlidingTabs
          tabs={reportTabs}
          activeTab={tab}
          onChange={setTab}
        />
      </div>

      <div key={tab} className="tab-content-enter">
        {tab !== 'final' ? (
          <div className="card">
            <div className="noprint card-header" style={{ marginBottom: '1.25rem' }}>
              <div className="row">
                <span className="card-title">Select Date Period:</span>
                {tab === 'weekly' ? (
                  <CustomDatePicker
                    value={from}
                    onChange={setFrom}
                  />
                ) : (
                  <CustomMonthPicker
                    value={mon}
                    onChange={setMon}
                  />
                )}
              </div>
              <span className="status-badge ok">
                <CheckCircle2 size={13} /> {range.length} Completed Log Entries
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {range.map(e => (
                <div
                  key={e.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                    {pretty(e.date)}
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', margin: '0.25rem 0 0.5rem', fontSize: '0.9rem' }}>
                    {e.activities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {range.length > 0 && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Wrench size={16} />
                  <span>Technologies Used: {Array.from(new Set(range.flatMap(e => e.technologies))).join(', ') || 'N/A'}</span>
                </div>
              )}

              {!range.length && (
                <p className="mut" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  No completed logs in this date range. Select a different period or complete logs first.
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="row noprint sp" style={{ marginBottom: '1.25rem' }}>
              <div className="row">
                <button className="btn pri" onClick={() => window.print()}>
                  <Printer size={16} /> Export PDF Report
                </button>
                <span className="mut" style={{ fontSize: '0.85rem' }}>
                  Opens standard print dialog. Select "Save as PDF".
                </span>
              </div>
            </div>

            <div className="doc">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ margin: 0, border: 0, padding: 0 }}>Internship Final Report</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
                    {s.profile.university} · {s.profile.faculty} · {s.profile.degree}
                  </p>
                </div>
                <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <div>Student ID: <strong style={{ color: 'var(--text-main)' }}>{s.profile.studentId}</strong></div>
                  <div>Company: <strong style={{ color: 'var(--text-main)' }}>{s.internship.companyName}</strong></div>
                </div>
              </div>

              {Object.entries(def).map(([k, v]) => (
                <div key={k} style={{ marginBottom: '1.5rem' }}>
                  <h3>{k}</h3>
                  <textarea
                    value={s.final[k] ?? v}
                    onChange={e => setFinal(k, e.target.value)}
                    rows={4}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}

