'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Flame,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FolderGit2,
  FileText,
  Save,
  Clock,
  ArrowRight,
  Building
} from 'lucide-react';
import Shell from '@/components/Shell';
import AIModal from '@/components/AIModal';
import { useDerived, useLogbook } from '@/context/LogbookContext';
import { pretty, today } from '@/lib/dates';

export default function Dashboard() {
  const { state, saveEntry } = useLogbook();
  const d = useDerived();
  const t = today();
  const cur = state.entries.find(e => e.date === t);
  const [note, setNote] = useState(cur?.quickNote ?? '');
  const [open, setOpen] = useState(false);

  const draft = () => {
    if (note.trim()) {
      saveEntry({
        id: cur?.id || t,
        date: t,
        activities: cur?.activities || [],
        technologies: cur?.technologies || [],
        challenges: cur?.challenges || '',
        solutions: cur?.solutions || '',
        learning: cur?.learning || '',
        meetings: cur?.meetings || '',
        tags: cur?.tags || [],
        quickNote: note,
        status: cur?.status === 'COMPLETED' ? 'COMPLETED' : 'DRAFT',
      });
    }
  };

  const recent = [...state.entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);


  return (
    <Shell>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {state.profile.name.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">
            <Building size={14} style={{ display: 'inline', marginRight: 4 }} />
            {state.internship.companyName || 'Internship'} · {state.internship.position || 'Intern'}
          </p>
        </div>
        <div className="row">
          <span className="status-badge ok" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            <Flame size={15} /> {d.streak} Day Streak
          </span>
          <span className="status-badge draft" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            Week {d.week} of {d.weeks}
          </span>
        </div>
      </div>

      {d.missing.length > 0 && (
        <div className="banner">
          <div className="row">
            <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
            <span style={{ fontWeight: 600 }}>
              {d.missing.length} workday{d.missing.length > 1 ? 's' : ''} missing log entries.
            </span>
          </div>
          <Link className="btn sm outline" href="/logbook?tab=missing">
            <Sparkles size={14} /> Recover Missed Days
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Logged Entries</span>
            <div className="stat-icon"><FileText size={16} /></div>
          </div>
          <div className="stat-value">{d.completed}</div>
          <div className="stat-desc">Completed daily logbooks</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Missing Days</span>
            <div className="stat-icon"><AlertTriangle size={16} /></div>
          </div>
          <div className="stat-value">{d.missing.length}</div>
          <div className="stat-desc">Workdays pending log</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Completion Rate</span>
            <div className="stat-icon"><TrendingUp size={16} /></div>
          </div>
          <div className="stat-value">{d.rate}%</div>
          <div className="stat-desc">Target log consistency</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Projects</span>
            <div className="stat-icon"><FolderGit2 size={16} /></div>
          </div>
          <div className="stat-value">{d.projects}</div>
          <div className="stat-desc">Internship projects tracked</div>
        </div>
      </div>

      {/* Internship Progress */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <Clock size={18} style={{ color: 'var(--primary)' }} /> Internship Timeline Progress
          </span>
          <span className="mut" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {d.pct}% Complete · {d.daysLeft} days remaining
          </span>
        </div>
        <div className="bar-container">
          <div className="bar">
            <i style={{ width: `${d.pct}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Note Editor */}
      <div className="card">
        <div className="card-header">
          <div>
            <span className="card-title">
              <Calendar size={18} style={{ color: 'var(--primary)' }} /> Today's Logbook · {pretty(t)}
            </span>
            <p className="mut" style={{ fontSize: '0.82rem', marginTop: 2 }}>
              Jot a quick note of your daily work activities, code changes, or team syncs.
            </p>
          </div>
          {cur?.status === 'COMPLETED' && (
            <span className="status-badge ok">
              <CheckCircle2 size={13} /> Logged
            </span>
          )}
        </div>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Optimized SQL queries, fixed auth bug in backend, and participated in sprint demo."
          rows={3}
        />

        <div className="quick-draft-actions">
          <button className="btn outline sm" onClick={draft}>
            <Save size={14} /> <span className="desktop-only-inline">Save Quick Draft</span><span className="mobile-only-inline">Save Draft</span>
          </button>
          <button
            className="btn pri sm"
            disabled={!note.trim()}
            onClick={() => setOpen(true)}
          >
            <Sparkles size={14} /> <span className="desktop-only-inline">Auto-Generate Full Entry</span><span className="mobile-only-inline">Generate</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Activity</span>
          <Link href="/logbook" className="mut" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recent.map(e => (
            <div
              key={e.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                gap: '0.65rem',
                minWidth: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 }}>{pretty(e.date)}</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>
                  {e.activities[0] || e.quickNote || 'No summary'}
                </span>
              </div>
              <span className={`status-badge ${e.status === 'COMPLETED' ? 'ok' : 'draft'}`} style={{ flexShrink: 0, marginLeft: 'auto' }}>
                {e.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : null}
                {e.status === 'COMPLETED' ? 'Completed' : 'Draft'}
              </span>
            </div>
          ))}


          {!recent.length && (
            <p className="mut" style={{ textAlign: 'center', padding: '1rem' }}>
              No log entries recorded yet. Write today's note above to get started!
            </p>
          )}
        </div>
      </div>

      {open && <AIModal date={t} initialNote={note} onClose={() => setOpen(false)} />}
    </Shell>
  );
}

