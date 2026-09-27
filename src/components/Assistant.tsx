'use client';

import { useState } from 'react';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';
import { useLogbook } from '@/context/LogbookContext';
import { answer } from '@/lib/aiSimulator';

type ChatMessage = { sender: 'user' | 'ai'; text: string };

export default function Assistant({ onClose }: { onClose: () => void }) {
  const { state } = useLogbook();
  const [q, setQ] = useState('');
  const [m, setM] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Logbook Copilot. Ask me about your work summary, monthly achievements, technologies used, or missing logs.',
    },
  ]);


  const ask = () => {
    if (!q.trim()) return;
    const userMsg = q.trim();
    const aiResponse = answer(userMsg, state.entries, state.projects);
    setM(prev => [...prev, { sender: 'user', text: userMsg }, { sender: 'ai', text: aiResponse }]);
    setQ('');
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--ai-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>AI Assistant</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enterprise Copilot</span>
            </div>
          </div>
          <button onClick={onClose} className="btn outline sm" style={{ padding: '0.35rem', borderRadius: '50%', flexShrink: 0 }} aria-label="Close Assistant">
            <X size={16} />
          </button>
        </div>

        <div className="chat-msgs">
          {m.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.sender}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 600, opacity: 0.8 }}>
                {msg.sender === 'user' ? (
                  <>
                    <User size={12} /> You
                  </>
                ) : (
                  <>
                    <Bot size={12} /> Logbook AI
                  </>
                )}
              </div>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask()}
            placeholder="Ask a question..."
          />
          <button className="btn pri" onClick={ask} style={{ padding: '0.65rem 0.9rem' }}>
            <Send size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
}

