'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  Tag,
  CheckCircle2,
  BookMarked
} from 'lucide-react';
import Shell from '@/components/Shell';
import AIModal from '@/components/AIModal';
import SlidingTabs from '@/components/SlidingTabs';
import { useDerived, useLogbook } from '@/context/LogbookContext';
import { addDays, fmt, pretty, today } from '@/lib/dates';

type ModalState = { date: string; recover: boolean } | null;

function Logbook() {
  const { state } = useLogbook();
  const d = useDerived();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'timeline');
  const [q, setQ] = useState('');
  const [month, setMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [modal, setModal] = useState<ModalState>(null);

  const logbookTabs = [
    { id: 'timeline', label: 'Timeline', shortLabel: 'Timeline', icon: <Clock size={15} /> },
    { id: 'calendar', label: 'Calendar View', shortLabel: 'Calendar', icon: <CalendarIcon size={15} /> },
    { 
      id: 'missing', 
      label: 'Missing Logs', 
      shortLabel: 'Missing', 
      icon: <AlertTriangle size={15} />,
      badge: d.missing.length > 0 ? d.missing.length : undefined
    },
  ];

  const list = [...state.entries]
    .filter(
      e =>
        e.status !== 'MISSING' &&
        (e.quickNote + e.activities.join() + e.tags.join() + e.date).toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const first = fmt(month);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const t = today();

  const cls = (x: string) => {
    const e = state.entries.find(entry => entry.date === x);
    return e?.status === 'COMPLETED' ? 'c' : e?.status === 'DRAFT' ? 'd' : d.missing.includes(x) ? 'm' : '';
  };

  return (
    <Shell>
      <div className="page-header">
        <div>
          <h1 className="page-title">Internship Logbook</h1>
          <p className="page-subtitle">Track, filter, and review your daily engineering records</p>
        </div>
      </div>

      {/* Smooth Sliding Tabs */}
      <SlidingTabs
        tabs={logbookTabs}
        activeTab={tab}
        onChange={setTab}
      />

      {/* Timeline Tab */}
      {tab === 'timeline' && (
        <div key="timeline" className="tab-content-enter">
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              placeholder="Search entries by keyword, activity, or technology tag..."
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {list.map(e => (
              <div className="card card-hover" key={e.id}>
                <div className="entry-card-header">
                  <div className="entry-card-title-group">
                    <span className="entry-date">{pretty(e.date)}</span>
                    <div className="entry-badges">
                      <span className={`status-badge ${e.status === 'COMPLETED' ? 'ok' : 'draft'}`}>
                        {e.status === 'COMPLETED' ? <CheckCircle2 size={13} /> : null}
                        <span className="desktop-only-inline">{e.status === 'COMPLETED' ? 'Completed' : 'Draft'}</span>
                        <span className="mobile-only-inline">{e.status === 'COMPLETED' ? 'Done' : 'Draft'}</span>
                      </span>
                      {e.aiGenerated && (
                        <span className="status-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                          <Sparkles size={12} /> <span className="desktop-only-inline">AI Assisted</span><span className="mobile-only-inline">AI</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="btn outline sm edit-btn" onClick={() => setModal({ date: e.date, recover: false })}>
                    <Edit3 size={14} /> <span className="desktop-only-inline">Edit Entry</span><span className="mobile-only-inline">Edit</span>
                  </button>
                </div>

                {e.quickNote && (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    "{e.quickNote}"
                  </p>
                )}

                {e.activities.length > 0 && (
                  <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0.75rem', color: 'var(--text-main)' }}>
                    {e.activities.map((a, i) => (
                      <li key={i} style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>{a}</li>
                    ))}
                  </ul>
                )}

                {e.technologies.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {e.technologies.map(x => (
                      <span className="tag" key={x}>
                        <Tag size={11} /> {x}
                      </span>
                    ))}
                  </div>
                )}

                {(e.challenges || e.learning) && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                    {e.challenges && (
                      <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)' }}>
                        <span style={{ fontWeight: 700, color: 'var(--warning)', display: 'block', marginBottom: 2 }}>Challenge:</span>
                        <span className="mut">{e.challenges}</span>
                      </div>
                    )}
                    {e.learning && (
                      <div style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: 2 }}>Key Learning:</span>
                        <span className="mut">{e.learning}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {!list.length && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <BookMarked size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No entries match your search</h3>
                <p className="mut" style={{ fontSize: '0.88rem' }}>Try clearing search keywords or adding new entries.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {tab === 'calendar' && (
        <div key="calendar" className="card tab-content-enter">
          <div className="month-picker-header">
            <button
              className="btn outline sm"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              title="Previous Month"
              style={{ padding: '0.45rem 0.65rem' }}
            >
              <ChevronLeft size={16} /> <span className="desktop-only-inline">Prev Month</span>
            </button>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, textAlign: 'center', flex: 1, whiteSpace: 'nowrap' }}>
              {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </span>
            <button
              className="btn outline sm"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              title="Next Month"
              style={{ padding: '0.45rem 0.65rem' }}
            >
              <span className="desktop-only-inline">Next Month</span> <ChevronRight size={16} />
            </button>
          </div>


          <div className="cal" style={{ marginTop: '1rem' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="cal-day-name">{day}</div>
            ))}
            {Array.from({ length: month.getDay() }).map((_, i) => (
              <span key={'b' + i} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => addDays(first, i)).map(x => (
              <button
                key={x}
                className={cls(x)}
                onClick={() => setModal({ date: x, recover: cls(x) === 'm' })}
                disabled={x > t}
                title={cls(x) === 'c' ? 'Completed' : cls(x) === 'm' ? 'Missing Log' : 'Draft'}
              >
                <span style={{ fontSize: '0.95rem' }}>{+x.slice(8)}</span>
              </button>
            ))}
          </div>

          <div className="row" style={{ marginTop: '1.25rem', justifyContent: 'center', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--success-light)', border: '1px solid var(--success)' }} /> Completed
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--warning-light)', border: '1px solid var(--warning)' }} /> Missing Workday
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--bg-base)', border: '1px solid var(--border-color)' }} /> Draft / Future
            </span>
          </div>
        </div>
      )}

      {/* Missing Days Tab */}
      {tab === 'missing' && (
        <div key="missing" className="card tab-content-enter">
          <div className="missing-hub-header">
            <span className="card-title" style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Unlogged Workdays Hub
            </span>
            <span className="mut" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
              {d.missing.length} remaining
            </span>
          </div>

          {d.missing.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[...d.missing].reverse().map(x => (
                <div key={x} className="missing-item-row">
                  <div className="missing-item-date">
                    <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                    <span>{pretty(x)}</span>
                  </div>
                  <button className="btn ai sm" style={{ whiteSpace: 'nowrap' }} onClick={() => setModal({ date: x, recover: true })}>
                    <Sparkles size={14} /> <span className="desktop-only-inline">Help Me Remember</span><span className="mobile-only-inline">AI Fill</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--success)' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Great job! Every workday has a logbook entry.</h3>
              <p className="mut" style={{ fontSize: '0.88rem' }}>Your logbook compliance rate is 100%.</p>
            </div>
          )}
        </div>
      )}

      {modal && (
        <AIModal
          key={modal.date}
          date={modal.date}
          recover={modal.recover}
          initialNote={state.entries.find(e => e.date === modal.date)?.quickNote || ''}
          onClose={() => setModal(null)}
        />
      )}
    </Shell>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Logbook />
    </Suspense>
  );
}

