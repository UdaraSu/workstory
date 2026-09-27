'use client';

import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, X, Loader2, Calendar, HelpCircle } from 'lucide-react';
import { useLogbook } from '@/context/LogbookContext';
import { generateEntry } from '@/lib/aiSimulator';
import { pretty } from '@/lib/dates';

type Step = 'ask' | 'load' | 'review';

export default function AIModal({
  date,
  initialNote = '',
  recover = false,
  onClose,
}: {
  date: string;
  initialNote?: string;
  recover?: boolean;
  onClose: () => void;
}) {
  const { saveEntry } = useLogbook();
  const [note, setNote] = useState(initialNote);
  const [hint, setHint] = useState('');
  const [step, setStep] = useState<Step>(recover && !initialNote ? 'ask' : 'load');
  const [f, setF] = useState({ activities: '', technologies: '', challenges: '', learning: '' });


  const run = async (n: string) => {
    setStep('load');
    const g = await generateEntry(n);
    setF({
      activities: (g.activities || []).join('\n'),
      technologies: (g.technologies || []).join(', '),
      challenges: g.challenges || '',
      learning: g.learning || '',
    });
    setStep('review');
  };

  useEffect(() => {
    if (step === 'load' && note) {
      run(note);
    } else if (step === 'load') {
      setStep('ask');
    }
  }, []);

  const save = () => {
    const t = f.technologies
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    saveEntry({
      id: date,
      date,
      quickNote: note,
      activities: f.activities.split('\n').filter(Boolean),
      technologies: t,
      tags: t,
      challenges: f.challenges,
      solutions: '',
      learning: f.learning,
      meetings: '',
      status: 'COMPLETED',
      aiGenerated: true,
    });
    onClose();
  };

  const up = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--ai-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {recover ? 'Recover Missed Workday' : 'AI Logbook Entry'}
              </h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={13} /> {pretty(date)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn outline sm"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {step === 'ask' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>What projects, tasks, or features did you work on?</label>
              <textarea
                value={hint}
                onChange={e => setHint(e.target.value)}
                placeholder="e.g. Worked on user authentication API and fixed PostgreSQL query bottleneck."
              />
            </div>
            <div>
              <label>Any extra context (meetings, tools used, key learning)?</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Standup with backend team, used Docker and Postman."
              />
            </div>
            <div className="quick-draft-actions" style={{ marginTop: '0.75rem' }}>
              <button className="btn outline sm" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn ai sm"
                onClick={() => {
                  const combined = [hint, note].filter(Boolean).join('. ');
                  setNote(combined);
                  if (combined) run(combined);
                }}
              >
                <Sparkles size={14} />
                <span className="desktop-only-inline">Build Structured Entry</span>
                <span className="mobile-only-inline">Build Entry</span>
              </button>
            </div>
          </div>
        )}

        {step === 'load' && (
          <div
            style={{
              padding: '3rem 1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Loader2 size={36} className="spin" style={{ color: 'var(--ai-primary)', animation: 'spin 1s linear infinite' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Structuring your note...</h3>
              <p className="mut" style={{ fontSize: '0.85rem' }}>
                Extracting activities, technologies, and lessons learned.
              </p>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="note-box">
              <Sparkles size={16} style={{ color: 'var(--ai-primary)', flexShrink: 0, marginTop: 2 }} />
              <span>
                AI structured this entry from your note. You can edit any field before finalizing.
              </span>
            </div>

            <div>
              <label>Activities (one per line)</label>
              <textarea value={f.activities} onChange={up('activities')} rows={3} />
            </div>

            <div>
              <label>Technologies / Tools (comma separated)</label>
              <input value={f.technologies} onChange={up('technologies')} placeholder="React, Node.js, Docker" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Challenges / Obstacles</label>
                <textarea value={f.challenges} onChange={up('challenges')} rows={3} />
              </div>
              <div>
                <label>Key Learnings</label>
                <textarea value={f.learning} onChange={up('learning')} rows={3} />
              </div>
            </div>

            <div className="quick-draft-actions" style={{ marginTop: '0.75rem' }}>
              <button className="btn outline sm" onClick={() => run(note)}>
                <RotateCcw size={14} /> <span className="desktop-only-inline">Regenerate</span><span className="mobile-only-inline">Retry</span>
              </button>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn outline sm" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn pri sm" onClick={save}>
                  <CheckCircle2 size={14} /> <span className="desktop-only-inline">Accept Entry</span><span className="mobile-only-inline">Save</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

