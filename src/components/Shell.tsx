'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  BookMarked,
  FileText,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  BookOpen
} from 'lucide-react';
import { useLogbook } from '@/context/LogbookContext';
import Assistant from './Assistant';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/logbook', label: 'Logbook', icon: BookMarked },
  { href: '/reports', label: 'Reports', icon: FileText },
];

type ThemeMode = 'light' | 'dark';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Shell({ children }: { children: React.ReactNode }) {
  const { ready, state } = useLogbook();
  const router = useRouter();
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [rotating, setRotating] = useState(false);

  const navRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [navPill, setNavPill] = useState<{ top: number; height: number; ready: boolean }>({
    top: 0,
    height: 0,
    ready: false,
  });

  const isItemActive = (href: string) => {
    if (!pathname) return false;
    if (pathname === href) return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    if (pathname === '/' && href === '/dashboard') return true;
    return false;
  };

  useIsomorphicLayoutEffect(() => {
    const activeItem = nav.find(item => isItemActive(item.href));
    if (activeItem) {
      const activeEl = navRefs.current[activeItem.href];
      if (activeEl) {
        setNavPill({
          top: activeEl.offsetTop,
          height: activeEl.offsetHeight,
          ready: true,
        });
      }
    }
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (ready && !state.onboarded) {
      router.replace('/onboarding');
    }
  }, [ready, state.onboarded, router]);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    if (saved) {
      document.documentElement.dataset.theme = saved;
      setTheme(saved);
    }
  }, []);

  if (!ready || !state.onboarded) return null;

  const toggleTheme = () => {
    setRotating(true);
    setTimeout(() => setRotating(false), 400);
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  };

  const initials = state.profile.name
    ? state.profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'IN';

  return (
    <div className="app">
      {/* Mobile Sticky Top Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <img src="/storylogo.png" alt="WorkStory Logo" style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />
          <span className="brand-title" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap' }}>WorkStory</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          <button
            onClick={() => setChatOpen(true)}
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              color: '#ffffff',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            title="Ask AI Copilot"
            aria-label="Ask AI Copilot"
          >
            <Sparkles size={16} />
          </button>

          <button
            onClick={toggleTheme}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <span
              style={{
                display: 'inline-flex',
                transform: rotating ? 'rotate(360deg) scale(1.15)' : 'rotate(0deg)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width: 36,
              height: 36,
              background: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Off-canvas Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <nav className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="brand" style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>
              <img src="/storylogo.png" alt="WorkStory Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="brand-title" style={{ fontSize: '1.25rem' }}>WorkStory</span>
                <span className="brand-badge">Enterprise</span>
              </div>
            </div>

            <div className="nav-section">
              {nav.map(item => {
                const Icon = item.icon;
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`nav-item ${active ? 'on' : ''}`}
                    style={{
                      borderRadius: 99,
                      background: active ? 'var(--sidebar-active-bg)' : 'transparent',
                      color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text-muted)',
                      fontWeight: active ? 800 : 600,
                    }}
                  >
                    <Icon size={18} color={active ? 'var(--sidebar-active-text)' : 'currentColor'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setChatOpen(true);
                }}
                className="nav-item ai-btn"
                style={{ border: 'none', marginTop: '0.5rem' }}
              >
                <Sparkles size={18} />
                <span>Ask AI Copilot</span>
              </button>
            </div>

            <div className="side-footer" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <button
                onClick={toggleTheme}
                className="nav-item"
                style={{ background: 'transparent', border: 'none', width: '100%', justifyContent: 'flex-start' }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    transform: rotating ? 'rotate(360deg) scale(1.2)' : 'rotate(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </span>
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <div className="user-chip">
                <div className="avatar">{initials}</div>
                <div className="user-info">
                  <span className="user-name">{state.profile.name || 'Intern'}</span>
                  <span className="user-role">{state.internship.companyName || 'Workspace'}</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <nav className="side">
        <div className="brand">
          <img src="/storylogo.png" alt="WorkStory Logo" style={{ width: 46, height: 46, objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="brand-title">WorkStory</span>
            <span className="brand-badge">Enterprise</span>
          </div>
        </div>

        <div className="nav-section" style={{ position: 'relative' }}>
          {/* Smooth Sliding Background Pill */}
          {navPill.ready && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: navPill.top,
                height: navPill.height,
                background: 'var(--sidebar-active-bg)',
                borderRadius: 99,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                transition: 'top 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}

          {nav.map(item => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={el => {
                  navRefs.current[item.href] = el;
                }}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  borderRadius: 99,
                  background: active && !navPill.ready ? 'var(--sidebar-active-bg)' : 'transparent',
                  color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text-muted)',
                  fontWeight: active ? 800 : 600,
                  boxShadow: active && !navPill.ready ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                }}
                className={`nav-item ${active ? 'on' : ''}`}
              >
                <Icon size={18} color={active ? 'var(--sidebar-active-text)' : 'currentColor'} />
                <span style={{ color: active ? 'var(--sidebar-active-text)' : 'inherit' }}>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setChatOpen(true)}
            className="nav-item ai-btn"
            style={{ border: 'none', position: 'relative', zIndex: 2 }}
          >
            <Sparkles size={18} />
            <span>Ask AI Copilot</span>
          </button>
        </div>

        <div className="side-footer">
          <button
            onClick={toggleTheme}
            className="nav-item"
            style={{ background: 'transparent', border: 'none', width: '100%', justifyContent: 'flex-start' }}
          >
            <span
              style={{
                display: 'inline-flex',
                transform: rotating ? 'rotate(360deg) scale(1.2)' : 'rotate(0deg)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className="user-chip">
            <div className="avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{state.profile.name || 'Intern'}</span>
              <span className="user-role">{state.internship.companyName || 'Workspace'}</span>
            </div>
          </div>
        </div>
      </nav>

      <main key={pathname} className="main page-enter">{children}</main>

      {chatOpen && <Assistant onClose={() => setChatOpen(false)} />}
    </div>
  );
}

