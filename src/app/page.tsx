'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  CheckCircle2,
  BookOpen,
  Layers,
  FileText,
  Lock,
  Building2,
  Check,
  UserCheck,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

export default function Landing() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', overflowX: 'hidden' }}>
      {/* Top Enterprise Navigation Header */}
      <header
        className="landing-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            <img src="/storylogo.png" alt="WorkStory Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-title" style={{ fontSize: '1.25rem' }}>
                WorkStory
              </span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Enterprise Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="landing-desktop-nav">
            <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)' }}>
              <a href="#features" style={{ transition: 'color 0.2s ease' }}>Features</a>
              <a href="#workflow" style={{ transition: 'color 0.2s ease' }}>Workflow</a>
              <a href="#compliance" style={{ transition: 'color 0.2s ease' }}>Compliance</a>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                className="landing-signin-btn"
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: 99,
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                href="/onboarding?mode=login"
              >
                Sign In
              </Link>
              <Link
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  border: 'none',
                  padding: '0.55rem 1.35rem',
                  borderRadius: 99,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                href="/onboarding?mode=signup"
              >
                <Sparkles size={14} color="#0f172a" /> Launch Platform
              </Link>
            </div>
          </div>

          {/* Mobile Action Controls (Sign In + Hamburger) */}
          <div className="landing-mobile-controls">
            <Link
              className="landing-signin-btn"
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 99,
                fontWeight: 600,
                fontSize: '0.82rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              href="/onboarding?mode=login"
            >
              Sign In
            </Link>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.45rem',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle Landing Menu"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Smooth Animated Mobile Dropdown Menu Overlay */}
        <div className={`landing-mobile-dropdown ${mobileNavOpen ? 'open' : ''}`}>
          <a
            href="#features"
            className="landing-mobile-dropdown-item"
            onClick={() => setMobileNavOpen(false)}
            style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.95rem' }}
          >
            Features
          </a>
          <a
            href="#workflow"
            className="landing-mobile-dropdown-item"
            onClick={() => setMobileNavOpen(false)}
            style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.95rem' }}
          >
            Workflow
          </a>
          <a
            href="#compliance"
            className="landing-mobile-dropdown-item"
            onClick={() => setMobileNavOpen(false)}
            style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.95rem' }}
          >
            Compliance
          </a>

          <div
            className="landing-mobile-dropdown-item"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Link
              style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '0.7rem 1.25rem',
                borderRadius: 99,
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              }}
              href="/onboarding?mode=signup"
              onClick={() => setMobileNavOpen(false)}
            >
              <Sparkles size={16} color="#0f172a" /> Launch Platform
            </Link>
          </div>
        </div>

      </header>


      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '5rem 1.5rem 6rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0 0 40px 40px',
        }}
      >
        <div style={{ maxWidth: 940, margin: '0 auto', position: 'relative', zIndex: 2 }} className="page-enter">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.45rem 1.15rem',
              borderRadius: 99,
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <ShieldCheck size={16} color="#3b82f6" /> Enterprise Internship Documentation & Audit System
          </div>

          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2.5rem, 5.8vw, 4.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              marginBottom: '1.5rem',
              lineHeight: 1.12,
            }}
          >
            Streamline Internship Management & Automated University Reports
          </h1>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.82)',
              fontSize: '1.15rem',
              maxWidth: 720,
              margin: '0 auto 2.75rem',
              lineHeight: 1.65,
            }}
          >
            Empower engineering interns to record daily activities in 60 seconds. Automatically compile structured logs, track project milestones, and generate academic compliance PDFs.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '0.9rem 2.25rem',
                borderRadius: 99,
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              href="/onboarding?mode=signup"
            >
              <Sparkles size={18} /> Get Started Free
            </Link>
            <Link
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.9rem 2rem',
                borderRadius: 99,
                fontWeight: 700,
                fontSize: '1rem',
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              href="/dashboard"
            >
              Explore Live Workspace <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise Metrics Bar */}
      <section className="reveal" style={{ maxWidth: 1100, margin: '-3rem auto 4rem', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 24,
            padding: '2rem 2.5rem',
            boxShadow: 'var(--shadow-md)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Daily Log Time
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
              60 Seconds
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Zero administrative overhead</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Report Readiness
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
              Instant PDF
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>University format compliant</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Missed Log Recovery
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>
              100% Backed Up
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Never miss a missing workday</span>
          </div>
        </div>
      </section>

      {/* Value Pillars / Features Grid */}
      <section id="features" className="reveal" style={{ maxWidth: 1100, margin: '0 auto 5rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
            Built for Interns, Trusted by Supervisors
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 620, margin: '0 auto' }}>
            An enterprise system engineered to capture engineering contributions, maintain university compliance, and track career growth.
          </p>
        </div>

        <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          <div className="card" style={{ padding: '2rem', borderRadius: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.25rem' }}>
              <Clock size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Rapid Daily Drafts</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Jot a single line about your daily tasks. The system structures your entries, tags technologies used, and records key engineering challenges.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderRadius: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '1.25rem' }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Automated PDF Exports</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Export clean, formatted weekly summaries, monthly audits, or complete final internship reports formatted for academic submission.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderRadius: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.25rem' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Compliance & Audit Hub</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Stay on top of unlogged workdays with automated compliance tracking, missing day recovery prompts, and supervisor review states.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="workflow" className="reveal" style={{ maxWidth: 1100, margin: '0 auto 6rem', padding: '0 1.5rem' }}>
        <div className="landing-card-padding" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 24, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
            Why Leading Engineering Interns Choose WorkStory Platform
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: 16, background: 'var(--danger-light)', border: '1px solid rgba(225, 29, 72, 0.2)' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--danger)', display: 'block', marginBottom: '1rem' }}>
                Traditional Manual Logging
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ flexShrink: 0 }}>❌</span> <span>Forgotten project details when university reports are due</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ flexShrink: 0 }}>❌</span> <span>Hours spent formatting Word documents & weekly tables</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ flexShrink: 0 }}>❌</span> <span>Missing days resulting in academic compliance penalties</span></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: 16, background: 'var(--success-light)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)', display: 'block', marginBottom: '1rem' }}>
                WorkStory Enterprise Platform
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><Check size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 3 }} /> <span>Structured daily logging in under 60 seconds</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><Check size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 3 }} /> <span>Automated tech stack tagging & challenge recording</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><Check size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 3 }} /> <span>One-click university report generation & export</span></li>
              </ul>
            </div>
          </div>
        </div>

      </section>

      {/* Enterprise Call-to-Action Footer Banner */}
      <section className="reveal" style={{ maxWidth: 1100, margin: '0 auto 4rem', padding: '0 1.5rem' }}>
        <div
          style={{
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: 28,
            padding: '3.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.25)',
          }}
        >
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Ready to Streamline Your Internship Documentation?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto 2rem' }}>
            Join thousands of interns documenting daily progress with effortless structured logging.
          </p>
          <Link
            style={{
              background: '#ffffff',
              color: '#0f172a',
              padding: '0.9rem 2.25rem',
              borderRadius: 99,
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
            href="/onboarding?mode=signup"
          >
            <Sparkles size={18} /> Launch Your Enterprise Logbook
          </Link>
        </div>
      </section>

      {/* Enterprise Level Footer */}
      <footer
        className="reveal"
        style={{
          background: '#060a12',
          color: '#ffffff',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4.5rem 1.5rem 2.5rem',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '2.5rem',
              paddingBottom: '3.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Brand Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src="/storylogo.png" alt="WorkStory Logo" style={{ width: 46, height: 46, objectFit: 'contain' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    WorkStory
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Enterprise Platform
                  </span>
                </div>
              </div>

              <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
                Enterprise platform for automated daily internship logging, AI structuring, and official academic report generation.
              </p>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                System Status: All Systems Operational
              </div>
            </div>

            {/* Product Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Product
              </span>
              <Link href="/dashboard" style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s ease' }}>
                Daily Logbook
              </Link>
              <Link href="/logbook" style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s ease' }}>
                Timeline & Calendar
              </Link>
              <Link href="/logbook?tab=missing" style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s ease' }}>
                Missing Days Recovery
              </Link>
              <Link href="/reports" style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s ease' }}>
                Academic PDF Reports
              </Link>
            </div>

            {/* Compliance & Security */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Compliance
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem' }}>Academic PDF/A Standard</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem' }}>University Audit Trails</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem' }}>Supervisor Sign-Off</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem' }}>Role-Based Access</span>
            </div>

            {/* Legal & Enterprise */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Enterprise
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem' }}>Privacy Policy</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem' }}>Terms of Service</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem' }}>Security Whitepaper</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem' }}>Contact Support</span>
            </div>
          </div>

          {/* Bottom Copyright & Security Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.82rem',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <span>© 2026 WorkStory Enterprise Platform. All rights reserved.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} color="#34d399" /> Certified Academic Compliance
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={14} color="#3b82f6" /> 256-Bit SSL Encryption
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
