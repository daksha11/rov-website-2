'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Play, Pause, Trash2, FileAudio, Music2 } from 'lucide-react';

const supabase = createClient();

interface AudioSubmission {
  id: string;
  title: string;
  file_url: string;
  file_path: string;
  created_at: string;
  client_id: string;
  uploader_name: string;
  uploader_email: string;
}

interface ClientProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
}

interface ClientProject {
  id: string;
  status: string;
  project_name: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingFading, setGreetingFading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Audio submissions state
  const [submissions, setSubmissions] = useState<AudioSubmission[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Client management state
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [clientProjects, setClientProjects] = useState<Record<string, ClientProject>>({});
  const [loadingClients, setLoadingClients] = useState(true);
  const [startingProjectFor, setStartingProjectFor] = useState<string | null>(null);

  // Launch project modal state
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [launchTarget, setLaunchTarget] = useState<ClientProfile | null>(null);
  const [launchProjectName, setLaunchProjectName] = useState('');
  const [launchDeliveryDate, setLaunchDeliveryDate] = useState('');
  const [launchDeliverables, setLaunchDeliverables] = useState<string[]>([]);
  const [launchDeliverableInput, setLaunchDeliverableInput] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/portal');
        return;
      }

      setFullName(profile.full_name || session.user.user_metadata?.full_name || 'Admin');
      setLoading(false);

      const greeted = sessionStorage.getItem('rov-admin-greeted');
      if (!greeted) {
        setShowGreeting(true);
        sessionStorage.setItem('rov-admin-greeted', 'true');
        setTimeout(() => setGreetingFading(true), 2000);
        setTimeout(() => setShowGreeting(false), 2600);
      }

      // Fetch all audio tracks + all profiles, merge client-side
      await fetchAllSubmissions();
      await fetchClientsAndProjects();
    };
    checkAccess();
  }, [router]);

  const fetchAllSubmissions = async () => {
    setLoadingTracks(true);
    try {
      // Fetch all tracks (admin RLS allows this)
      const { data: tracks, error: tracksError } = await supabase
        .from('audio_tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tracksError) throw tracksError;

      // Fetch all profiles (name + email)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email');

      if (profilesError) throw profilesError;

      // Merge
      const merged: AudioSubmission[] = (tracks || []).map((track) => {
        const profile = (profiles || []).find((p) => p.id === track.client_id);
        return {
          ...track,
          uploader_name: profile?.full_name || 'Unknown User',
          uploader_email: profile?.email || '—',
        };
      });

      setSubmissions(merged);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoadingTracks(false);
    }
  };

  const fetchClientsAndProjects = async () => {
    setLoadingClients(true);
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .neq('role', 'admin')
        .order('full_name', { ascending: true });

      const { data: projects } = await supabase
        .from('projects')
        .select('id, client_id, project_name, status');

      const projMap: Record<string, ClientProject> = {};
      (projects || []).forEach((p) => {
        if (p.client_id) projMap[p.client_id] = { id: p.id, status: p.status, project_name: p.project_name };
      });

      setClients(profiles || []);
      setClientProjects(projMap);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoadingClients(false);
    }
  };

  const openLaunchModal = (client: ClientProfile) => {
    setLaunchTarget(client);
    setLaunchProjectName('');
    setLaunchDeliveryDate('');
    setLaunchDeliverables([]);
    setLaunchDeliverableInput('');
    setLaunchModalOpen(true);
  };

  const addDeliverable = () => {
    const trimmed = launchDeliverableInput.trim();
    if (!trimmed) return;
    setLaunchDeliverables((prev) => [...prev, trimmed]);
    setLaunchDeliverableInput('');
  };

  const removeDeliverable = (i: number) => {
    setLaunchDeliverables((prev) => prev.filter((_, idx) => idx !== i));
  };

  const confirmLaunchProject = async () => {
    if (!launchTarget) return;
    setStartingProjectFor(launchTarget.id);
    try {
      const { data: proj, error } = await supabase
        .from('projects')
        .insert([{
          client_id: launchTarget.id,
          project_name: launchProjectName.trim() || 'New Project',
          status: 'Discovery',
          agreements_signed: false,
          invoice_paid: false,
          requirements_met: false,
          delivery_date: launchDeliveryDate || null,
          deliverables_needed: launchDeliverables.length > 0 ? launchDeliverables : null,
        }])
        .select('id, client_id, project_name, status')
        .single();

      if (!error && proj) {
        setClientProjects((prev) => ({
          ...prev,
          [launchTarget.id]: { id: proj.id, status: proj.status, project_name: proj.project_name },
        }));
        setLaunchModalOpen(false);
      } else {
        console.error(error);
        alert('Failed to start project. Check your RLS policies.');
      }
    } finally {
      setStartingProjectFor(null);
    }
  };

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
    sessionStorage.removeItem('rov-admin-greeted');
    await supabase.auth.signOut();
    router.push('/');
  }

  const togglePlay = (trackId: string) => {
    const audio = audioRefs.current[trackId];
    if (!audio) return;

    if (currentlyPlaying && currentlyPlaying !== trackId) {
      audioRefs.current[currentlyPlaying]?.pause();
    }

    if (audio.paused) {
      audio.play();
      setCurrentlyPlaying(trackId);
    } else {
      audio.pause();
      setCurrentlyPlaying(null);
    }
  };

  const handleDeleteTrack = async (submission: AudioSubmission) => {
    if (!confirm(`Delete "${submission.title}" by ${submission.uploader_name}?`)) return;

    try {
      await supabase.from('audio_tracks').delete().eq('id', submission.id);
      await supabase.storage.from('audio-tracks').remove([submission.file_path]);
      setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
    } catch (err) {
      console.error('Error deleting track:', err);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,244,227,0.08)',
    borderRadius: '16px',
    padding: '32px',
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', background: '#0A0A0A', color: '#FFF4E3', minHeight: '100vh', fontFamily: "'Roboto', sans-serif" }}>
        <p style={{ color: 'rgba(255,244,227,0.5)' }}>Loading the command center...</p>
      </div>
    );
  }

  return (
    <main style={{ background: '#0A0A0A', color: '#FFF4E3', minHeight: '100vh', fontFamily: "'Roboto', sans-serif" }}>

      {/* Welcome greeting overlay */}
      {showGreeting && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          opacity: greetingFading ? 0 : 1, transition: 'opacity 0.6s ease-out',
        }}>
          <div style={{ textAlign: 'center', animation: 'portalGreetIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,244,227,0.4)', marginBottom: '16px' }}>
              Welcome back
            </p>
            <h1 style={{ fontSize: 'clamp(36px, 8vw, 72px)', fontFamily: 'Norwige, sans-serif', fontWeight: 700, fontStyle: 'italic', margin: 0, color: '#FFF4E3' }}>
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
        @keyframes cardFadeIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px clamp(20px, 5vw, 60px)',
        borderBottom: '1px solid rgba(255,244,227,0.08)',
        background: 'rgba(10,10,10,0.6)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,244,227,0.35)', margin: 0 }}>
            Admin Command Center
          </p>
        </div>

        <div data-portal-menu="" style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
            style={{
              padding: '10px 28px', borderRadius: '9999px',
              border: menuOpen ? '1px solid rgba(255,244,227,0.25)' : '1px solid rgba(255,244,227,0.12)',
              background: menuOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              color: '#FFF4E3', fontSize: '12px', fontFamily: "'Roboto', sans-serif",
              fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,244,227,0.25)'; }}
            onMouseLeave={(e) => { if (!menuOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,244,227,0.12)'; } }}
          >
            {fullName}
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              minWidth: '180px', background: 'rgba(15,15,15,0.95)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,244,227,0.1)', borderRadius: '12px',
              padding: '6px', animation: 'portalMenuIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}>
              <button
                onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                type="button"
                style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', color: 'rgba(255,244,227,0.5)', fontSize: '13px', fontFamily: "'Roboto', sans-serif", textAlign: 'left', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#FFF4E3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,244,227,0.5)'; }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        padding: 'clamp(30px, 6vw, 60px) clamp(20px, 5vw, 60px)',
        maxWidth: '860px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>

        {/* Welcome */}
        <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out forwards' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,244,227,0.35)', margin: '0 0 10px 0' }}>
            Command Center
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontFamily: 'Norwige, sans-serif', fontWeight: 700, fontStyle: 'italic', margin: '0 0 6px 0', color: '#FFF4E3' }}>
            Welcome back, {fullName.split(' ')[0]}
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.4)', margin: 0 }}>
            Here is where you manage all client submissions and projects.
          </p>
        </div>

        {/* Audio Submissions */}
        <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out 0.1s both' }}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🎵</span>
              <div>
                <h3 style={{ fontSize: '18px', fontFamily: 'Norwige, sans-serif', fontWeight: 700, fontStyle: 'italic', margin: '0 0 2px 0', color: '#FFF4E3' }}>
                  Audio Submissions
                </h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,244,227,0.35)', margin: 0 }}>All client-uploaded tracks</p>
              </div>
            </div>
            {/* Count badge */}
            {!loadingTracks && (
              <div style={{
                padding: '4px 14px',
                borderRadius: '9999px',
                background: 'rgba(234,154,97,0.1)',
                border: '1px solid rgba(234,154,97,0.2)',
                color: '#EA9A61',
                fontSize: '13px',
                fontWeight: 600,
              }}>
                {submissions.length} {submissions.length === 1 ? 'track' : 'tracks'}
              </div>
            )}
          </div>

          {/* Loading spinner */}
          {loadingTracks ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                border: '2px solid rgba(255,244,227,0.08)',
                borderTop: '2px solid rgba(234,154,97,0.6)',
                margin: '0 auto 12px auto',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontSize: '13px', color: 'rgba(255,244,227,0.3)', margin: 0 }}>Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed rgba(255,244,227,0.08)', borderRadius: '12px' }}>
              <Music2 size={36} strokeWidth={1.5} style={{ margin: '0 auto 12px auto', color: 'rgba(255,244,227,0.15)' }} />
              <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.4)', margin: '0 0 4px 0' }}>No audio tracks uploaded yet.</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,244,227,0.2)', margin: 0 }}>Client submissions will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 180px 1fr 100px',
                gap: '12px',
                padding: '0 12px 10px 12px',
                borderBottom: '1px solid rgba(255,244,227,0.06)',
              }}>
                {['Track', 'Uploaded', 'Client', ''].map((h) => (
                  <span key={h} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,244,227,0.25)', fontWeight: 500 }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Track rows */}
              {submissions.map((sub) => (
                <div key={sub.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 180px 1fr 100px',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,244,227,0.05)',
                  borderRadius: '12px',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,244,227,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,244,227,0.05)'}
                >
                  {/* Track info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,244,227,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <FileAudio size={20} style={{ color: 'rgba(255,244,227,0.25)' }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#FFF4E3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                      {sub.title}
                    </span>
                  </div>

                  {/* Upload date */}
                  <span style={{ fontSize: '13px', color: 'rgba(255,244,227,0.4)' }}>
                    {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  {/* Client info */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#FFF4E3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sub.uploader_name}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,244,227,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sub.uploader_email}
                    </p>
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                    <audio
                      ref={(el) => { if (el) audioRefs.current[sub.id] = el; }}
                      src={sub.file_url}
                      onEnded={() => setCurrentlyPlaying(null)}
                    />
                    <button
                      onClick={() => togglePlay(sub.id)}
                      title="Play / Pause"
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(234,154,97,0.1)',
                        border: '1px solid rgba(234,154,97,0.3)',
                        color: '#EA9A61', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(234,154,97,0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(234,154,97,0.1)'}
                    >
                      {currentlyPlaying === sub.id
                        ? <Pause size={16} fill="currentColor" />
                        : <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />
                      }
                    </button>
                    <button
                      onClick={() => handleDeleteTrack(sub)}
                      title="Delete Track"
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'transparent', border: '1px solid rgba(255,100,100,0.15)',
                        color: 'rgba(255,100,100,0.4)', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,80,80,0.1)'; e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,100,100,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,100,100,0.15)'; }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Client Projects ── */}
        <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out 0.2s both' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🎯</span>
              <div>
                <h3 style={{ fontSize: '18px', fontFamily: 'Norwige, sans-serif', fontWeight: 700, fontStyle: 'italic', margin: '0 0 2px 0', color: '#FFF4E3' }}>
                  Client Projects
                </h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,244,227,0.35)', margin: 0 }}>Launch & track project roadmaps per user</p>
              </div>
            </div>
            {!loadingClients && (
              <div style={{
                padding: '4px 14px', borderRadius: '9999px',
                background: 'rgba(234,154,97,0.1)', border: '1px solid rgba(234,154,97,0.2)',
                color: '#EA9A61', fontSize: '13px', fontWeight: 600,
              }}>
                {clients.length} {clients.length === 1 ? 'client' : 'clients'}
              </div>
            )}
          </div>

          {loadingClients ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                border: '2px solid rgba(255,244,227,0.08)',
                borderTop: '2px solid rgba(234,154,97,0.6)',
                margin: '0 auto 12px auto',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontSize: '13px', color: 'rgba(255,244,227,0.3)', margin: 0 }}>Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed rgba(255,244,227,0.08)', borderRadius: '12px' }}>
              <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.4)', margin: '0 0 4px 0' }}>No clients found.</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,244,227,0.2)', margin: 0 }}>Users who sign up will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 160px 140px',
                gap: '12px',
                padding: '0 14px 10px 14px',
                borderBottom: '1px solid rgba(255,244,227,0.06)',
              }}>
                {['Client', 'Email', 'Status', ''].map((h) => (
                  <span key={h} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,244,227,0.25)', fontWeight: 500 }}>{h}</span>
                ))}
              </div>

              {clients.map((client) => {
                const proj = clientProjects[client.id];
                const isLaunching = startingProjectFor === client.id;

                const statusColor: Record<string, string> = {
                  Discovery: 'rgba(130,100,255,0.7)',
                  'In Progress': '#EA9A61',
                  Review: 'rgba(255,210,80,0.8)',
                  Completed: 'rgba(80,210,130,0.8)',
                };

                return (
                  <div
                    key={client.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 160px 140px',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '14px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,244,227,0.05)',
                      borderRadius: '12px',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,244,227,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,244,227,0.05)'}
                  >
                    {/* Name + ID */}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px 0', fontSize: '14px', color: '#FFF4E3', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {client.full_name || 'Unnamed User'}
                      </p>
                      <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,244,227,0.25)', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {client.id}
                      </p>
                    </div>

                    {/* Email */}
                    <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,244,227,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {client.email || '—'}
                    </p>

                    {/* Status badge */}
                    <div>
                      {proj ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '4px 12px', borderRadius: '9999px',
                          fontSize: '11px', fontWeight: 600,
                          background: `${(statusColor[proj.status] || 'rgba(255,244,227,0.2)')}22`,
                          border: `1px solid ${(statusColor[proj.status] || 'rgba(255,244,227,0.2)')}55`,
                          color: statusColor[proj.status] || 'rgba(255,244,227,0.5)',
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                          {proj.status}
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '4px 12px', borderRadius: '9999px',
                          fontSize: '11px', fontWeight: 500,
                          background: 'rgba(255,244,227,0.04)',
                          border: '1px solid rgba(255,244,227,0.08)',
                          color: 'rgba(255,244,227,0.3)',
                        }}>
                          No Project
                        </span>
                      )}
                    </div>

                    {/* Action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {proj ? (
                        <span style={{ fontSize: '12px', color: 'rgba(255,244,227,0.25)', fontStyle: 'italic' }}>Active</span>
                      ) : (
                        <button
                          onClick={() => openLaunchModal(client)}
                          disabled={isLaunching}
                          type="button"
                          style={{
                            padding: '8px 18px', borderRadius: '9999px',
                            border: '1px solid rgba(234,154,97,0.3)',
                            background: 'rgba(234,154,97,0.1)',
                            color: '#EA9A61', fontSize: '12px',
                            fontFamily: "'Roboto', sans-serif",
                            fontWeight: 600, letterSpacing: '0.04em',
                            cursor: isLaunching ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: isLaunching ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => { if (!isLaunching) { e.currentTarget.style.background = 'rgba(234,154,97,0.2)'; e.currentTarget.style.borderColor = 'rgba(234,154,97,0.5)'; } }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(234,154,97,0.1)'; e.currentTarget.style.borderColor = 'rgba(234,154,97,0.3)'; }}
                        >
                          {isLaunching ? 'Launching...' : '✦ Launch'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Sign out confirmation modal */}
      {confirmOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            animation: 'confirmFadeIn 0.25s ease-out forwards',
          }}
          onClick={() => setConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(18,18,18,0.95)',
              border: '1px solid rgba(255,244,227,0.1)',
              borderRadius: '20px', padding: '40px',
              maxWidth: '380px', width: '90%',
              textAlign: 'center',
              animation: 'confirmCardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,244,227,0.35)', marginBottom: '12px' }}>
              Confirm
            </p>
            <h2 style={{ fontSize: '22px', fontFamily: 'Norwige, sans-serif', fontWeight: 700, fontStyle: 'italic', color: '#FFF4E3', margin: '0 0 8px 0' }}>
              Sign out?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.4)', marginBottom: '32px', fontFamily: "'Roboto', sans-serif" }}>
              You will need to sign in again to access the command center.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmOpen(false)}
                type="button"
                style={{ flex: 1, padding: '12px 20px', borderRadius: '9999px', border: '1px solid rgba(255,244,227,0.12)', background: 'rgba(255,255,255,0.04)', color: '#FFF4E3', fontSize: '13px', fontFamily: "'Roboto', sans-serif", fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                type="button"
                style={{ flex: 1, padding: '12px 20px', borderRadius: '9999px', border: '1px solid rgba(234,154,97,0.3)', background: 'rgba(234,154,97,0.12)', color: '#EA9A61', fontSize: '13px', fontFamily: "'Roboto', sans-serif", fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(234,154,97,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(234,154,97,0.12)'; }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Launch Project Modal ── */}
      {launchModalOpen && launchTarget && (
        <div
          onClick={() => setLaunchModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            animation: 'confirmFadeIn 0.25s ease-out forwards',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(14,14,14,0.98)',
              border: '1px solid rgba(255,244,227,0.1)',
              borderRadius: '24px',
              padding: '40px',
              width: '90%',
              maxWidth: '480px',
              animation: 'confirmCardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Header */}
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,244,227,0.35)', margin: '0 0 6px 0' }}>
              New Project
            </p>
            <h2 style={{ fontSize: '22px', fontFamily: 'Norwige, sans-serif', fontWeight: 700, fontStyle: 'italic', color: '#FFF4E3', margin: '0 0 4px 0' }}>
              Launch for {launchTarget.full_name || 'User'}
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,244,227,0.35)', margin: '0 0 28px 0' }}>
              {launchTarget.email}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Project Name */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,244,227,0.4)', marginBottom: '8px' }}>
                  Project Name <span style={{ color: 'rgba(255,244,227,0.2)' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brand Identity Redesign"
                  value={launchProjectName}
                  onChange={(e) => setLaunchProjectName(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                    borderRadius: '10px', border: '1px solid rgba(255,244,227,0.1)',
                    background: 'rgba(255,255,255,0.04)', color: '#FFF4E3',
                    fontFamily: "'Roboto', sans-serif", fontSize: '14px', outline: 'none',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(234,154,97,0.4)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,244,227,0.1)'}
                />
              </div>

              {/* Delivery Date */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,244,227,0.4)', marginBottom: '8px' }}>
                  Delivery Date <span style={{ color: 'rgba(255,244,227,0.2)' }}>(optional)</span>
                </label>
                <input
                  type="date"
                  value={launchDeliveryDate}
                  onChange={(e) => setLaunchDeliveryDate(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                    borderRadius: '10px', border: '1px solid rgba(255,244,227,0.1)',
                    background: 'rgba(255,255,255,0.04)', color: launchDeliveryDate ? '#FFF4E3' : 'rgba(255,244,227,0.3)',
                    fontFamily: "'Roboto', sans-serif", fontSize: '14px', outline: 'none',
                    colorScheme: 'dark',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(234,154,97,0.4)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,244,227,0.1)'}
                />
              </div>

              {/* Deliverables */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,244,227,0.4)', marginBottom: '8px' }}>
                  Deliverables Needed <span style={{ color: 'rgba(255,244,227,0.2)' }}>(optional)</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. Logo files, Brand guide..."
                    value={launchDeliverableInput}
                    onChange={(e) => setLaunchDeliverableInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDeliverable(); } }}
                    style={{
                      flex: 1, padding: '10px 14px',
                      borderRadius: '10px', border: '1px solid rgba(255,244,227,0.1)',
                      background: 'rgba(255,255,255,0.04)', color: '#FFF4E3',
                      fontFamily: "'Roboto', sans-serif", fontSize: '14px', outline: 'none',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(234,154,97,0.4)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,244,227,0.1)'}
                  />
                  <button
                    type="button"
                    onClick={addDeliverable}
                    style={{
                      padding: '10px 16px', borderRadius: '10px',
                      border: '1px solid rgba(234,154,97,0.3)',
                      background: 'rgba(234,154,97,0.1)', color: '#EA9A61',
                      fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s', lineHeight: 1,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(234,154,97,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(234,154,97,0.1)'}
                  >+</button>
                </div>

                {/* Deliverable tags */}
                {launchDeliverables.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {launchDeliverables.map((d, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '5px 12px', borderRadius: '9999px',
                          background: 'rgba(234,154,97,0.1)', border: '1px solid rgba(234,154,97,0.25)',
                          color: '#EA9A61', fontSize: '12px', fontWeight: 500,
                        }}
                      >
                        {d}
                        <button
                          type="button"
                          onClick={() => removeDeliverable(i)}
                          style={{ background: 'none', border: 'none', color: 'rgba(234,154,97,0.5)', cursor: 'pointer', padding: '0', fontSize: '14px', lineHeight: 1 }}
                        >&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                type="button"
                onClick={() => setLaunchModalOpen(false)}
                style={{
                  flex: 1, padding: '13px 20px', borderRadius: '9999px',
                  border: '1px solid rgba(255,244,227,0.12)',
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,244,227,0.7)',
                  fontSize: '13px', fontFamily: "'Roboto', sans-serif",
                  fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLaunchProject}
                disabled={startingProjectFor === launchTarget?.id}
                style={{
                  flex: 2, padding: '13px 20px', borderRadius: '9999px',
                  border: '1px solid rgba(234,154,97,0.4)',
                  background: 'rgba(234,154,97,0.15)', color: '#EA9A61',
                  fontSize: '13px', fontFamily: "'Roboto', sans-serif",
                  fontWeight: 600, letterSpacing: '0.04em',
                  cursor: startingProjectFor ? 'not-allowed' : 'pointer',
                  opacity: startingProjectFor ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { if (!startingProjectFor) e.currentTarget.style.background = 'rgba(234,154,97,0.25)'; }}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(234,154,97,0.15)'}
              >
                {startingProjectFor ? 'Launching...' : '✦ Launch Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
