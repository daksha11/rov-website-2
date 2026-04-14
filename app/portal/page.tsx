'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  project_name: string;
  status: string;
  agreements_signed: boolean;
  invoice_link: string | null;
  invoice_paid: boolean;
  requirements_met: boolean;
  deliverables_needed: string[] | null;
  final_project_url: string | null;
}

export default function ClientPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingFading, setGreetingFading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', session.user.id)
        .single();

      setFullName(profile?.full_name || session.user.user_metadata?.full_name || 'Client');

      const { data: proj } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', session.user.id)
        .in('status', ['Discovery', 'In Progress', 'Review', 'Completed'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setProject(proj);
      setLoading(false);

      // Show greeting animation on fresh login
      const greeted = sessionStorage.getItem('rov-portal-greeted');
      if (!greeted) {
        setShowGreeting(true);
        sessionStorage.setItem('rov-portal-greeted', 'true');
        setTimeout(() => setGreetingFading(true), 2000);
        setTimeout(() => setShowGreeting(false), 2600);
      }
    };
    checkAccess();
  }, [router]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-portal-menu]')) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  async function handleSignOut() {
    sessionStorage.removeItem('rov-portal-greeted');
    await supabase.auth.signOut();
    router.push('/');
  }

  async function toggleAgreement() {
    if (!project || updating) return;
    setUpdating(true);
    await supabase
      .from('projects')
      .update({ agreements_signed: !project.agreements_signed })
      .eq('id', project.id);

    // Re-fetch
    const { data: proj } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project.id)
      .single();

    if (proj) setProject(proj);
    setUpdating(false);
  }

  const firstName = fullName.split(' ')[0];

  function getStepIndex(): number {
    if (!project) return 0;
    if (!project.agreements_signed) return 0;
    if (!project.invoice_paid) return 1;
    if (project.status === 'Completed') return 3;
    return 2;
  }

  function getSubtitle(): string {
    if (!project) return '';
    const step = getStepIndex();
    if (step === 0) return "Let\u2019s get your agreements signed to kick things off.";
    if (step === 1) return 'Agreements signed. Next up \u2014 your invoice.';
    if (step === 3) return 'Your project is complete!';
    return 'Your project is in progress. Here\u2019s what we need from you.';
  }

  const stepLabels = ['Agreements', 'Invoice', 'Deliverables', 'Complete'];
  const currentStep = getStepIndex();

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,244,227,0.08)',
    borderRadius: '16px',
    padding: '32px',
  };

  const ctaStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    borderRadius: '9999px',
    border: '1px solid rgba(234,154,97,0.3)',
    background: 'rgba(234,154,97,0.12)',
    color: '#EA9A61',
    fontSize: '14px',
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 600,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', background: '#0A0A0A', color: '#FFF4E3', minHeight: '100vh', fontFamily: "'Roboto', sans-serif" }}>
        <p style={{ color: 'rgba(255,244,227,0.5)' }}>Loading your project workspace...</p>
      </div>
    );
  }

  return (
    <main style={{ background: '#0A0A0A', color: '#FFF4E3', minHeight: '100vh', fontFamily: "'Roboto', sans-serif" }}>
      {/* Welcome greeting overlay */}
      {showGreeting && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10,10,10,0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            opacity: greetingFading ? 0 : 1,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              animation: 'portalGreetIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <p style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'rgba(255,244,227,0.4)',
              marginBottom: '16px',
            }}>
              Welcome back
            </p>
            <h1 style={{
              fontSize: 'clamp(36px, 8vw, 72px)',
              fontFamily: 'Norwige, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              margin: 0,
              color: '#FFF4E3',
            }}>
              {fullName}
            </h1>
          </div>
        </div>
      )}

      <style>{`
        @keyframes portalGreetIn {
          0% { opacity: 0; transform: scale(0.92) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes portalMenuIn {
          0% { opacity: 0; transform: translateY(-6px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes confirmFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes confirmCardIn {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes cardFadeIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px clamp(20px, 5vw, 60px)',
          borderBottom: '1px solid rgba(255,244,227,0.08)',
          background: 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,244,227,0.35)', margin: '0 0 6px 0' }}>
            Client Portal
          </p>
        </div>

        <div data-portal-menu="" style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
            style={{
              padding: '10px 28px',
              borderRadius: '9999px',
              border: menuOpen ? '1px solid rgba(255,244,227,0.25)' : '1px solid rgba(255,244,227,0.12)',
              background: menuOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              color: '#FFF4E3',
              fontSize: '12px',
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,244,227,0.25)';
            }}
            onMouseLeave={(e) => {
              if (!menuOpen) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,244,227,0.12)';
              }
            }}
          >
            {fullName}
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: '180px',
                background: 'rgba(15,15,15,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,244,227,0.1)',
                borderRadius: '12px',
                padding: '6px',
                animation: 'portalMenuIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <button
                onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                type="button"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,244,227,0.5)',
                  fontSize: '13px',
                  fontFamily: "'Roboto', sans-serif",
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#FFF4E3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,244,227,0.5)';
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Dashboard Content */}
      <div style={{
        padding: 'clamp(30px, 6vw, 60px) clamp(20px, 5vw, 60px)',
        maxWidth: '640px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>

        {!project ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 32px' }}>
            <p style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'rgba(255,244,227,0.35)',
              marginBottom: '16px',
            }}>
              No Active Project
            </p>
            <h2 style={{
              fontSize: '24px',
              fontFamily: 'Norwige, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              margin: '0 0 12px 0',
              color: '#FFF4E3',
            }}>
              Nothing here yet
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.4)', margin: 0 }}>
              Once your project is set up, everything you need will appear right here.
            </p>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '8px' }}>
              {stepLabels.map((label, i) => (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {i > 0 && (
                      <div style={{
                        flex: 1,
                        height: '2px',
                        background: i <= currentStep ? '#EA9A61' : 'rgba(255,244,227,0.08)',
                        transition: 'background 0.4s ease',
                      }} />
                    )}
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: i <= currentStep ? '#EA9A61' : 'rgba(255,244,227,0.12)',
                      border: i === currentStep ? '2px solid #EA9A61' : '2px solid transparent',
                      boxShadow: i === currentStep ? '0 0 0 4px rgba(234,154,97,0.15)' : 'none',
                      transition: 'all 0.4s ease',
                    }} />
                    {i < stepLabels.length - 1 && (
                      <div style={{
                        flex: 1,
                        height: '2px',
                        background: i < currentStep ? '#EA9A61' : 'rgba(255,244,227,0.08)',
                        transition: 'background 0.4s ease',
                      }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: i <= currentStep ? 'rgba(234,154,97,0.8)' : 'rgba(255,244,227,0.25)',
                    fontWeight: i === currentStep ? 600 : 400,
                    transition: 'all 0.4s ease',
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Card 1 — Start Here (always visible) */}
            <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out forwards' }}>
              <p style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'rgba(255,244,227,0.35)',
                margin: '0 0 12px 0',
              }}>
                Start Here
              </p>
              <h2 style={{
                fontSize: 'clamp(24px, 5vw, 32px)',
                fontFamily: 'Norwige, sans-serif',
                fontWeight: 700,
                fontStyle: 'italic',
                margin: '0 0 8px 0',
                color: '#FFF4E3',
              }}>
                Welcome, {firstName}
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,244,227,0.5)', margin: 0, lineHeight: 1.6 }}>
                {getSubtitle()}
              </p>
            </div>

            {/* Card 2 — Documents (visible when agreements not signed) */}
            {!project.agreements_signed && (
              <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out 0.1s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>📑</span>
                  <h3 style={{
                    fontSize: '18px',
                    fontFamily: 'Norwige, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    margin: 0,
                    color: '#FFF4E3',
                  }}>
                    Review &amp; Sign Agreements
                  </h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,244,227,0.4)',
                  margin: '0 0 24px 0',
                  lineHeight: 1.6,
                }}>
                  Before we begin, please review and sign the project agreement. This covers scope, timeline, and deliverables.
                </p>
                <button
                  onClick={toggleAgreement}
                  disabled={updating}
                  type="button"
                  style={{
                    ...ctaStyle,
                    opacity: updating ? 0.5 : 1,
                    cursor: updating ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!updating) {
                      e.currentTarget.style.background = 'rgba(234,154,97,0.2)';
                      e.currentTarget.style.borderColor = 'rgba(234,154,97,0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(234,154,97,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(234,154,97,0.3)';
                  }}
                >
                  {updating ? 'Updating...' : 'Review & Sign'}
                </button>
              </div>
            )}

            {/* Card 3 — Invoice (visible when agreements signed but not paid) */}
            {project.agreements_signed && !project.invoice_paid && (
              <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out 0.1s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>💳</span>
                  <h3 style={{
                    fontSize: '18px',
                    fontFamily: 'Norwige, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    margin: 0,
                    color: '#FFF4E3',
                  }}>
                    Invoice &amp; Payment
                  </h3>
                </div>
                {project.invoice_link ? (
                  <>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255,244,227,0.4)',
                      margin: '0 0 24px 0',
                      lineHeight: 1.6,
                    }}>
                      Your invoice is ready. Click below to pay securely through Stripe.
                    </p>
                    <a
                      href={project.invoice_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={ctaStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(234,154,97,0.2)';
                        e.currentTarget.style.borderColor = 'rgba(234,154,97,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(234,154,97,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(234,154,97,0.3)';
                      }}
                    >
                      Pay Securely via Stripe
                    </a>
                  </>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255,244,227,0.4)',
                    margin: 0,
                    lineHeight: 1.6,
                    animation: 'subtlePulse 2s ease-in-out infinite',
                  }}>
                    Generating your secure invoice...
                  </p>
                )}
              </div>
            )}

            {/* Card 4 — Client Deliverables (visible when invoice paid) */}
            {project.invoice_paid && (
              <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out 0.15s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>📄</span>
                  <h3 style={{
                    fontSize: '18px',
                    fontFamily: 'Norwige, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    margin: 0,
                    color: '#FFF4E3',
                  }}>
                    What We Need From You
                  </h3>
                </div>
                {project.deliverables_needed && project.deliverables_needed.length > 0 ? (
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}>
                    {project.deliverables_needed.map((item, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontSize: '14px',
                        color: 'rgba(255,244,227,0.6)',
                        lineHeight: 1.6,
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#EA9A61',
                          flexShrink: 0,
                          marginTop: '7px',
                        }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.4)', margin: 0, lineHeight: 1.6 }}>
                    No deliverables needed &mdash; we&apos;re all set.
                  </p>
                )}
              </div>
            )}

            {/* Card 5 — Your Finished Project (visible only when Completed) */}
            {project.status === 'Completed' && (
              <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out 0.2s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>🚀</span>
                  <h3 style={{
                    fontSize: '18px',
                    fontFamily: 'Norwige, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    margin: 0,
                    color: '#FFF4E3',
                  }}>
                    Your Finished Project
                  </h3>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,244,227,0.4)',
                  margin: '0 0 24px 0',
                  lineHeight: 1.6,
                }}>
                  Your project is live. Click below to view the final result.
                </p>
                {project.final_project_url && (
                  <a
                    href={project.final_project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={ctaStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(234,154,97,0.2)';
                      e.currentTarget.style.borderColor = 'rgba(234,154,97,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(234,154,97,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(234,154,97,0.3)';
                    }}
                  >
                    View Your Project
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sign out confirmation modal */}
      {confirmOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            animation: 'confirmFadeIn 0.25s ease-out forwards',
          }}
          onClick={() => setConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(18,18,18,0.95)',
              border: '1px solid rgba(255,244,227,0.1)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '380px',
              width: '90%',
              textAlign: 'center',
              animation: 'confirmCardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <p style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'rgba(255,244,227,0.35)',
              marginBottom: '12px',
            }}>
              Confirm
            </p>
            <h2 style={{
              fontSize: '22px',
              fontFamily: 'Norwige, sans-serif',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#FFF4E3',
              margin: '0 0 8px 0',
            }}>
              Sign out?
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,244,227,0.4)',
              marginBottom: '32px',
              fontFamily: "'Roboto', sans-serif",
            }}>
              You will need to sign in again to access your portal.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmOpen(false)}
                type="button"
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,244,227,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#FFF4E3',
                  fontSize: '13px',
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,244,227,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,244,227,0.12)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                type="button"
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(234,154,97,0.3)',
                  background: 'rgba(234,154,97,0.12)',
                  color: '#EA9A61',
                  fontSize: '13px',
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(234,154,97,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(234,154,97,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(234,154,97,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(234,154,97,0.3)';
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
