'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function ClientPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
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
              <style>{`
                @keyframes portalMenuIn {
                  0% { opacity: 0; transform: translateY(-6px) scale(0.97); }
                  100% { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>
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

      <div style={{ padding: 'clamp(30px, 6vw, 60px) clamp(20px, 5vw, 60px)' }}>
        <p style={{ color: 'rgba(255,244,227,0.5)', fontSize: '16px' }}>
          Welcome to ROV Studios. Here is where you review deliverables and check timelines.
        </p>
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
          <style>{`
            @keyframes confirmFadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes confirmCardIn {
              0% { opacity: 0; transform: scale(0.95) translateY(10px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
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
