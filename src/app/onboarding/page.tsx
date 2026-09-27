'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ArrowRight, Eye, EyeOff, Globe } from 'lucide-react';
import { useLogbook } from '@/context/LogbookContext';

type AuthMode = 'signup' | 'login';

const slides = [
  {
    image: '/login-cat.jpeg',
    quote: '“I see blockers coming from 5 sprints away.”',
    description: 'Gain high-altitude clarity over system architectures, database migrations, deadlines, and project milestones.',
  },
  {
    image: '/login-dog.jpeg',
    quote: '“I fetched the requirements and delivered on time!”',
    description: 'Track momentum in real-time, celebrate daily wins, and keep your sprints moving forward.',
  },
  {
    image: '/login-bear.jpeg',
    quote: '“Unbearably efficient daily logbooks.”',
    description: 'Automate daily entry structuring, missing workday recovery, and final academic report exports.',
  },
];

function OnboardingForm() {
  const { state, finishOnboarding } = useLogbook();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get('mode') as AuthMode) || 'signup';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Form Fields (Empty initial state)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [company, setCompany] = useState('');
  const [demo, setDemo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || 'Alex Rivera';
    const profile = {
      ...state.profile,
      name: fullName,
      email: email.trim() || 'alex@company.com',
      university: university.trim() || 'Stanford University',
      studentId: state.profile.studentId || 'STU-98421',
      degree: state.profile.degree || 'B.S. Computer Science',
      faculty: state.profile.faculty || 'Engineering',
    };
    const internship = {
      ...state.internship,
      companyName: company.trim() || 'Acme Corp',
      position: state.internship.position || 'Software Engineering Intern',
      department: state.internship.department || 'Core Infrastructure',
      startDate: state.internship.startDate || '2026-06-01',
      endDate: state.internship.endDate || '2026-09-30',
      expectedHours: state.internship.expectedHours || 40,
      workingDays: state.internship.workingDays || ['1', '2', '3', '4', '5'],
      status: 'ACTIVE' as const,
    };


    setTimeout(() => {
      finishOnboarding(profile, internship, demo);
      router.push('/dashboard');
    }, 450);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Fixed Top Brand Header on Mobile View */}
      <div className="onboarding-mobile-brand">
        <div style={{ width: 38, height: 38, borderRadius: 10, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.18)', flexShrink: 0 }}>
          <img src="/storylogo.png" alt="WorkStory Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        </div>
        <span className="brand-title" style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>WorkStory</span>
      </div>

      {/* Left Visual Column */}

      <div
        style={{
          flex: 1.1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2.5rem',
          color: '#ffffff',
          overflow: 'hidden',
          background: '#0f172a',
        }}
        className="noprint onboarding-left-visual"
      >

        {/* Full Cover Background Images with Smooth Cross-Fade */}
        {slides.map((slide, idx) => (
          <img
            key={slide.image}
            src={slide.image}
            alt="Workspace Visual"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: activeSlide === idx ? 1 : 0,
              transform: activeSlide === idx ? 'scale(1)' : 'scale(1.04)',
              transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Gradient Overlay for Text Legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.8) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 10 }}>
          <img src="/storylogo.png" alt="WorkStory Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <span className="brand-title" style={{ fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            WorkStory
          </span>
        </div>

        {/* Testimonial Quote & Pagination */}
        <div style={{ zIndex: 10, maxWidth: 500, marginTop: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginBottom: '1.25rem' }}>
            {slides.map((slide, idx) => {
              const isActive = activeSlide === idx;
              return (
                <div
                  key={idx}
                  style={{
                    gridArea: '1 / 1',
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                    pointerEvents: isActive ? 'auto' : 'none',
                    transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.5rem', color: '#ffffff', textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                    {slide.quote}
                  </h2>
                  <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.45, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                    {slide.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Pagination Dots */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                style={{
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  width: activeSlide === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 99,
                  background: activeSlide === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                  boxShadow: activeSlide === idx ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div
        className="onboarding-form-col"
        style={{
          flex: 1,
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem 4rem',
          overflowY: 'auto',
        }}
      >
        <div className="onboarding-form-inner" style={{ width: '100%', maxWidth: 480, margin: 'auto' }}>





          {/* Header Title with Smooth Mode Switch */}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginBottom: '2rem' }}>
            <div
              style={{
                gridArea: '1 / 1',
                opacity: mode === 'signup' ? 1 : 0,
                transform: mode === 'signup' ? 'translateY(0)' : 'translateY(-6px)',
                pointerEvents: mode === 'signup' ? 'auto' : 'none',
                transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
                Create account
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                to setup your Internship Logbook workspace
              </p>
            </div>
            <div
              style={{
                gridArea: '1 / 1',
                opacity: mode === 'login' ? 1 : 0,
                transform: mode === 'login' ? 'translateY(0)' : 'translateY(6px)',
                pointerEvents: mode === 'login' ? 'auto' : 'none',
                transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
                Sign in
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                to continue to your Logbook Workspace
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Signup: First/Last Name Section */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: mode === 'signup' ? '1fr' : '0fr',
                opacity: mode === 'signup' ? 1 : 0,
                transform: mode === 'signup' ? 'translateY(0)' : 'translateY(-8px)',
                transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '4px 4px 1.1rem 4px', transition: 'padding 0.4s ease' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      First name
                    </label>
                    <input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Alex"
                      required={mode === 'signup'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      Last name
                    </label>
                    <input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Rivera"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Field (Always visible) */}
            <div style={{ marginBottom: '1.1rem', padding: '0 4px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>

            {/* Signup: Password + Confirm Password + University + Company + Checkbox */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: mode === 'signup' ? '1fr' : '0fr',
                opacity: mode === 'signup' ? 1 : 0,
                transform: mode === 'signup' ? 'translateY(0)' : 'translateY(8px)',
                transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', padding: '4px 4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                        Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required={mode === 'signup'}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                        Confirm
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required={mode === 'signup'}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                        University
                      </label>
                      <input
                        value={university}
                        onChange={e => setUniversity(e.target.value)}
                        placeholder="Stanford University"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                        Company
                      </label>
                      <input
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <input
                        type="checkbox"
                        id="showPass"
                        checked={showPassword}
                        onChange={e => setShowPassword(e.target.checked)}
                        style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                      />
                      <label htmlFor="showPass" style={{ fontSize: '0.88rem', color: 'var(--text-main)', cursor: 'pointer', margin: 0, textTransform: 'none', fontWeight: 500 }}>
                        Show password
                      </label>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      Use 6 or more characters with letters and numbers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Login: Password Field section */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: mode === 'login' ? '1fr' : '0fr',
                opacity: mode === 'login' ? 1 : 0,
                transform: mode === 'login' ? 'translateY(0)' : 'translateY(8px)',
                transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ padding: mode === 'login' ? '4px 4px 0.5rem 4px' : '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                      Password
                    </label>
                    <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Forgot password?
                    </a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required={mode === 'login'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn-switch-mode"
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                disabled={isSubmitting}
              >
                <span>
                  {mode === 'signup' ? 'Sign in instead' : 'Create account'}
                </span>
              </button>

              <button
                type="submit"
                className="btn-submit-smooth"
                disabled={isSubmitting}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.65rem',
                  borderRadius: 99,
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: isSubmitting ? 0.85 : 1,
                }}
              >
                <span>
                  {isSubmitting
                    ? mode === 'signup'
                      ? 'Creating account...'
                      : 'Signing in...'
                    : mode === 'signup'
                      ? 'Create account'
                      : 'Sign in'}
                </span>
                {isSubmitting ? (
                  <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <ArrowRight size={16} className="arrow-icon" style={{ transition: 'transform 0.2s ease' }} />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className="onboarding-footer-links" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-subtle)', paddingTop: '2rem', width: '100%', maxWidth: 480, margin: 'auto auto 0' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Globe size={14} />
            <span>English (United States)</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a href="#" onClick={e => e.preventDefault()}>Privacy</a>
            <a href="#" onClick={e => e.preventDefault()}>Terms</a>
            <a href="#" onClick={e => e.preventDefault()}>Security</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <Suspense>
      <OnboardingForm />
    </Suspense>
  );
}



