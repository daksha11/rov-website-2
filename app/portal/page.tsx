'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
import { useRouter } from 'next/navigation';
import { Play, Pause, Trash2, UploadCloud, X, FileAudio, Music2, ChevronDown, MessageSquare } from 'lucide-react';

interface Project {
  id: string;
  project_name: string;
  status: string;
  agreements_signed: boolean;
  invoice_link: string | null;
  invoice_paid: boolean;
  requirements_met: boolean;
  deliverables_needed: string[] | null;
  final_project_url?: string | null;
  delivery_date?: string | null;
  folder_link?: string | null;
}

interface AudioTrack {
  id: string;
  title: string;
  file_url: string;
  notes: string | null;
  created_at: string;
}

interface Revision {
  id: string;
  revision_number: number;
  notes: string;
  status: 'pending' | 'resolved';
  created_at: string;
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
  
  // Audio Upload States
  const [userId, setUserId] = useState<string | null>(null);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackNotes, setTrackNotes] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isConfirmingUpload, setIsConfirmingUpload] = useState(false);
  const [mixedAudioTracks, setMixedAudioTracks] = useState<AudioTrack[]>([]);
  const [isAudioTracksExpanded, setIsAudioTracksExpanded] = useState(true);
  const [isMixedTracksExpanded, setIsMixedTracksExpanded] = useState(true);

  // Revision States
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  // Audio Player State
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/'); return; }
      
      setUserId(session.user.id);

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
      await fetchAudioTracks(session.user.id);
      await fetchMixedAudioTracks(session.user.id);
      if (proj) await fetchRevisions(proj.id);
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

  const fetchAudioTracks = async (uid: string) => {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .eq('client_id', uid)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setAudioTracks(data);
    }
  };

  const fetchMixedAudioTracks = async (uid: string) => {
    const { data, error } = await supabase
      .from('mixed_audio_tracks')
      .select('*')
      .eq('client_id', uid)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setMixedAudioTracks(data);
    }
  };

  const fetchRevisions = async (projectId: string) => {
    const { data, error } = await supabase
      .from('mixed_track_revisions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setRevisions(data);
    }
  };

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



  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      if (!trackTitle) {
        // Default title to filename without extension
        setTrackTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // thumbnail upload removed
    void e;
  };

  const resetUploadModal = () => {
    setIsUploadModalOpen(false);
    setAudioFile(null);
    setTrackTitle('');
    setTrackNotes('');
    setUploadProgress(0);
    setIsUploading(false);
    setIsConfirmingUpload(false);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !trackTitle || !userId) return;
    
    if (audioTracks.length >= 6) {
      alert("Maximum limit of 6 tracks reached.");
      return;
    }

    if (!isConfirmingUpload) {
      setIsConfirmingUpload(true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(10); // Fake initial progress

    try {
      const timestamp = Date.now();
      const audioFileName = `${timestamp}_${audioFile.name.replace(/\s+/g, '_')}`;
      
      // 1. Upload Audio
      const { data: audioData, error: audioError } = await supabase.storage
        .from('audio-tracks')
        .upload(audioFileName, audioFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (audioError) throw audioError;
      setUploadProgress(50);
      
      const { data: { publicUrl: audioUrl } } = supabase.storage
          .from('audio-tracks')
          .getPublicUrl(audioFileName);

      // 3. Save to database
      const { error: dbError } = await supabase
        .from('audio_tracks')
        .insert([
          {
            client_id: userId,
            title: trackTitle,
            notes: trackNotes.trim() || null,
            file_path: audioData.path,
            file_url: audioUrl
          }
        ]);

      if (dbError) throw dbError;
      
      setUploadProgress(100);
      await fetchAudioTracks(userId);
      setTimeout(resetUploadModal, 500);

    } catch (error) {
      console.error("Error uploading track:", error);
      alert("Failed to upload track. Please try again.");
      setIsUploading(false);
      setIsConfirmingUpload(false);
    }
  };

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim() || !project || !userId || isSubmittingRevision) return;

    if (revisions.length >= 2) {
      alert("Maximum of 2 revisions allowed.");
      return;
    }

    setIsSubmittingRevision(true);
    try {
      const { error } = await supabase
        .from('mixed_track_revisions')
        .insert([{
          project_id: project.id,
          client_id: userId,
          notes: revisionNotes.trim(),
          revision_number: revisions.length + 1,
          status: 'pending'
        }]);

      if (error) throw error;

      await fetchRevisions(project.id);
      setIsRevisionModalOpen(false);
      setRevisionNotes('');
      alert("Revision request submitted successfully.");
    } catch (error) {
      console.error("Error submitting revision:", error);
      alert("Failed to submit revision request.");
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  const handleDeleteTrack = async (trackId: string, filePath: string) => {
    // Clients are no longer allowed to delete tracks
    console.warn("Manual deletion not allowed for clients.");
    return;
  };

  const togglePlay = (trackId: string) => {
    const audio = audioRefs.current[trackId];
    if (!audio) return;

    if (currentlyPlaying && currentlyPlaying !== trackId) {
        const prevAudio = audioRefs.current[currentlyPlaying];
        if (prevAudio) {
            prevAudio.pause();
        }
    }

    if (audio.paused) {
        audio.play();
        setCurrentlyPlaying(trackId);
    } else {
        audio.pause();
        setCurrentlyPlaying(null);
    }
  };

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,244,227,0.1)',
    background: 'rgba(0,0,0,0.3)',
    color: '#FFF4E3',
    fontFamily: "'Roboto', sans-serif",
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
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
        @keyframes modalSlideUp {
          0% { opacity: 0; transform: translateY(30px); }
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
            <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.4)', margin: '0 0 32px 0' }}>
              We’ll set up your project workspace once we’ve connected. Reach out to get started.
            </p>
            <a
              href="/contact"
              style={{
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
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(234,154,97,0.22)';
                e.currentTarget.style.borderColor = 'rgba(234,154,97,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(234,154,97,0.12)';
                e.currentTarget.style.borderColor = 'rgba(234,154,97,0.3)';
              }}
            >
              Contact Us
            </a>
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
                {project.folder_link && (
                  <div style={{ marginTop: '16px' }}>
                    <a 
                      href={project.folder_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '13px', color: '#EA9A61', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span style={{ fontSize: '16px' }}>📄</span>
                      View Signed Agreement
                    </a>
                  </div>
                )}
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
        
        {/* Audio Tracks Section (Always Visible) */}
        <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out 0.25s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div 
              onClick={() => setIsAudioTracksExpanded(!isAudioTracksExpanded)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '20px' }}>🎵</span>
              <h3 style={{
                fontSize: '18px',
                fontFamily: 'Norwige, sans-serif',
                fontWeight: 700,
                fontStyle: 'italic',
                margin: 0,
                color: '#FFF4E3',
              }}>
               Audio Tracks
               <span style={{ 
                 fontSize: '11px', 
                 color: audioTracks.length >= 6 ? '#EA9A61' : 'rgba(255,244,227,0.35)',
                 marginLeft: '8px',
                 fontWeight: 400,
                 fontStyle: 'normal',
                 fontFamily: "'Roboto', sans-serif"
               }}>
                 ({audioTracks.length}/6 used)
               </span>
              </h3>
              <div style={{ color: 'rgba(255,244,227,0.25)', transition: 'transform 0.3s ease', transform: isAudioTracksExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                <ChevronDown size={18} />
              </div>
            </div>
            <button
                onClick={() => setIsUploadModalOpen(true)}
                disabled={audioTracks.length >= 6}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: audioTracks.length >= 6 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  border: '1px solid rgba(255,244,227,0.15)',
                  color: audioTracks.length >= 6 ? 'rgba(255,244,227,0.2)' : '#FFF4E3',
                  fontSize: '12px',
                  fontFamily: "'Roboto', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: audioTracks.length >= 6 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: audioTracks.length >= 6 ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                    if (audioTracks.length < 6) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,244,227,0.3)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (audioTracks.length < 6) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255,244,227,0.15)';
                    }
                }}
            >
                <UploadCloud size={14} /> {audioTracks.length >= 6 ? 'Limit Reached' : 'Upload'}
            </button>
          </div>

          {isAudioTracksExpanded && (
            <div style={{ animation: 'confirmFadeIn 0.3s ease-out forwards' }}>
              {audioTracks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', border: '1px dashed rgba(255,244,227,0.1)', borderRadius: '12px' }}>
                    <FileAudio size={32} strokeWidth={1.5} style={{ margin: '0 auto 12px auto', color: 'rgba(255,244,227,0.2)'}} />
                    <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.4)', margin: 0 }}>No tracks uploaded yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {audioTracks.map((track) => (
                      <div key={track.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '12px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,244,227,0.05)',
                          borderRadius: '12px',
                          position: 'relative'
                      }}>
                          {/* Album art icon */}
                          <div style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '8px',
                              background: 'rgba(0,0,0,0.4)',
                              border: '1px solid rgba(255,244,227,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                          }}>
                              <FileAudio size={24} style={{ color: 'rgba(255,244,227,0.3)' }} />
                          </div>
                          
                          {/* Info & Player */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#FFF4E3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {track.title}
                            </h4>
                            <span style={{ fontSize: '11px', color: 'rgba(255,244,227,0.3)' }}>
                                {new Date(track.created_at).toLocaleDateString()}
                            </span>
                             {/* Audio Element (Hidden technically, using custom controls) */}
                             <audio 
                                 ref={(el) => { if (el) audioRefs.current[track.id] = el; }}
                                 src={track.file_url} 
                                 onEnded={() => setCurrentlyPlaying(null)}
                             />
                           </div>
      
                           {/* Controls */}
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '4px' }}>
                               <button 
                                 onClick={() => togglePlay(track.id)}
                                 style={{
                                     width: '40px',
                                     height: '40px',
                                     borderRadius: '50%',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                     background: 'rgba(234,154,97,0.1)',
                                     border: '1px solid rgba(234,154,97,0.3)',
                                     color: '#EA9A61',
                                     cursor: 'pointer',
                                     transition: 'all 0.2s'
                                 }}
                                 onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(234,154,97,0.2)'}
                                 onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(234,154,97,0.1)'}
                               >
                                 {currentlyPlaying === track.id ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }}/>}
                               </button>
                           </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mixed Audio Tracks Section (Uploaded by Admin) */}
        {mixedAudioTracks.length > 0 && (
          <div style={{ ...cardStyle, animation: 'cardFadeIn 0.4s ease-out 0.3s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div 
                onClick={() => setIsMixedTracksExpanded(!isMixedTracksExpanded)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '20px' }}>⭐</span>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontFamily: 'Norwige, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    margin: '0 0 2px 0',
                    color: '#FFF4E3',
                  }}>
                    Mixed Audio Tracks
                  </h3>
                  <p style={{ fontSize: '11px', color: 'rgba(255,244,227,0.35)', margin: 0 }}>
                    Mastered tracks uploaded by Admin
                  </p>
                </div>
                <div style={{ color: 'rgba(255,244,227,0.25)', transition: 'transform 0.3s ease', transform: isMixedTracksExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                  <ChevronDown size={18} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {revisions.some(r => r.status === 'pending') ? (
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    background: 'rgba(234,154,97,0.1)',
                    border: '1px solid rgba(234,154,97,0.2)',
                    color: '#EA9A61',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EA9A61', animation: 'subtlePulse 1.5s infinite' }} />
                    Review Pending
                  </div>
                ) : revisions.length < 2 ? (
                  <button
                    onClick={() => setIsRevisionModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      background: 'transparent',
                      border: '1px solid rgba(255,244,227,0.15)',
                      color: '#FFF4E3',
                      fontSize: '12px',
                      fontFamily: "'Roboto', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255,244,227,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255,244,227,0.15)';
                    }}
                  >
                    <MessageSquare size={14} /> Request Review ({revisions.length}/2)
                  </button>
                ) : (
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,244,227,0.1)',
                    color: 'rgba(255,244,227,0.4)',
                    fontSize: '11px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    No Revisions Left
                  </div>
                )}
              </div>
            </div>

            {isMixedTracksExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'confirmFadeIn 0.3s ease-out forwards' }}>
                {mixedAudioTracks.map((track) => (
                  <div key={track.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px',
                    background: 'rgba(234,154,97,0.03)',
                    border: '1px solid rgba(234,154,97,0.1)',
                    borderRadius: '12px',
                  }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '8px',
                      background: 'rgba(234,154,97,0.1)',
                      border: '1px solid rgba(234,154,97,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Music2 size={24} style={{ color: '#EA9A61' }} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#FFF4E3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.title}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'rgba(255,244,227,0.3)' }}>
                        Available since {new Date(track.created_at).toLocaleDateString()}
                      </span>
                      <audio 
                        ref={(el) => { if (el) audioRefs.current[track.id] = el; }}
                        src={track.file_url} 
                        onEnded={() => setCurrentlyPlaying(null)}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button 
                        onClick={() => togglePlay(track.id)}
                        style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: '#EA9A61', color: '#0A0A0A',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(234,154,97,0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        {currentlyPlaying === track.id ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }}/>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

       {/* Upload Modal */}
       {isUploadModalOpen && (
         <div
           style={{
             position: 'fixed',
             inset: 0,
             zIndex: 9999,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             background: 'rgba(0,0,0,0.85)',
             backdropFilter: 'blur(16px)',
             WebkitBackdropFilter: 'blur(16px)',
             animation: 'confirmFadeIn 0.25s ease-out forwards',
           }}
           onClick={!isUploading ? resetUploadModal : undefined}
         >
           <div
             onClick={(e) => e.stopPropagation()}
             style={{
               background: 'rgba(15,15,15,0.95)',
               border: '1px solid rgba(255,244,227,0.08)',
               borderRadius: '24px',
               padding: '40px',
               width: '90%',
               maxWidth: '480px',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
               animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
               position: 'relative'
             }}
           >
             {!isUploading && (
                <button
                   onClick={resetUploadModal}
                   style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,244,227,0.4)',
                      cursor: 'pointer',
                      padding: '4px'
                   }}
                >
                   <X size={20} />
                </button>
             )}

             <h2 style={{
               fontSize: '24px',
               fontFamily: 'Norwige, sans-serif',
               fontWeight: 700,
               fontStyle: 'italic',
               color: '#FFF4E3',
               margin: '0 0 24px 0',
             }}>
               Upload Audio Track
             </h2>

             <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {isConfirmingUpload ? (
                   <div style={{
                      padding: '24px',
                      background: 'rgba(234,154,97,0.05)',
                      border: '1px solid rgba(234,154,97,0.2)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      animation: 'confirmCardIn 0.3s ease-out'
                   }}>
                      <UploadCloud size={32} style={{ color: '#EA9A61', marginBottom: '16px' }} />
                      <h3 style={{ fontSize: '18px', color: '#FFF4E3', margin: '0 0 8px 0', fontFamily: 'Norwige, sans-serif', fontStyle: 'italic' }}>Confirm Upload</h3>
                      <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.5)', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                         Are you sure you want to upload <strong style={{ color: '#FFF4E3' }}>{trackTitle}</strong>? 
                         Once uploaded, audio tracks <span style={{ color: '#EA9A61' }}>cannot be deleted</span> from your portal.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                         <button
                           type="button"
                           onClick={() => setIsConfirmingUpload(false)}
                           style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '9999px',
                              border: '1px solid rgba(255,244,227,0.1)',
                              background: 'transparent',
                              color: 'rgba(255,244,227,0.5)',
                              fontSize: '13px',
                              cursor: 'pointer'
                           }}
                         >
                            Back
                         </button>
                         <button
                           type="submit"
                           disabled={isUploading}
                           style={{
                              flex: 2,
                              padding: '12px',
                              borderRadius: '9999px',
                              background: '#EA9A61',
                              color: '#0A0A0A',
                              border: 'none',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: 'pointer'
                           }}
                         >
                            {isUploading ? 'Uploading...' : 'Confirm & Upload'}
                         </button>
                      </div>
                   </div>
                 ) : (
                   <>
                    {/* Audio File Picker */}
                    <div>
                       <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,244,227,0.6)', marginBottom: '8px' }}>Audio File (Required)</label>
                       <div style={{ position: 'relative' }}>
                          <input 
                             type="file" 
                             accept="audio/*" 
                             onChange={handleAudioFileChange}
                             disabled={isUploading}
                             required
                             style={{
                                 position: 'absolute',
                                 inset: 0,
                                 width: '100%',
                                 height: '100%',
                                 opacity: 0,
                                 cursor: isUploading ? 'not-allowed' : 'pointer',
                                 zIndex: 2
                             }}
                          />
                          <div style={{
                             padding: '24px',
                             border: '1px dashed rgba(255,244,227,0.2)',
                             borderRadius: '12px',
                             background: audioFile ? 'rgba(234,154,97,0.05)' : 'rgba(0,0,0,0.3)',
                             borderColor: audioFile ? 'rgba(234,154,97,0.3)' : 'rgba(255,244,227,0.2)',
                             textAlign: 'center',
                             transition: 'all 0.2s',
                          }}>
                              {audioFile ? (
                                 <>
                                    <FileAudio size={28} style={{ margin: '0 auto 8px auto', color: '#EA9A61' }} />
                                    <p style={{ fontSize: '14px', color: '#FFF4E3', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{audioFile.name}</p>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,244,227,0.4)', margin: 0 }}>Click to change file</p>
                                 </>
                              ) : (
                                 <>
                                    <UploadCloud size={28} style={{ margin: '0 auto 8px auto', color: 'rgba(255,244,227,0.3)' }} />
                                    <p style={{ fontSize: '14px', color: 'rgba(255,244,227,0.6)', margin: '0 0 4px 0' }}>Drag & drop or browse</p>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,244,227,0.3)', margin: 0 }}>MP3, WAV, FLAC</p>
                                 </>
                              )}
                          </div>
                       </div>
                    </div>
    
                    {/* Title Input */}
                    <div>
                       <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,244,227,0.6)', marginBottom: '8px' }}>Track Title</label>
                       <input 
                          type="text" 
                          value={trackTitle}
                          onChange={(e) => setTrackTitle(e.target.value)}
                          placeholder="e.g. My Awesome Mix"
                          required
                          disabled={isUploading}
                          style={{...inputStyle, ...((isUploading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) as any)}}
                       />
                    </div>
    
                    {/* Notes Input */}
                    <div>
                       <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,244,227,0.6)', marginBottom: '8px' }}>Notes</label>
                       <textarea 
                          value={trackNotes}
                          onChange={(e) => setTrackNotes(e.target.value)}
                          placeholder="Add some notes for the admin..."
                          disabled={isUploading}
                          style={{
                             ...inputStyle, 
                             height: '80px',
                             resize: 'none',
                             ...((isUploading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) as any)
                          }}
                       />
                    </div>
    
    
                    {/* Progress / Actions */}
                    <div style={{ marginTop: '12px' }}>
                        {isUploading ? (
                           <div>
                               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,244,227,0.5)', marginBottom: '8px' }}>
                                  <span>Uploading...</span>
                                  <span>{uploadProgress}%</span>
                               </div>
                               <div style={{ height: '6px', background: 'rgba(255,244,227,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                                   <div style={{ 
                                      height: '100%', 
                                      background: '#EA9A61', 
                                      width: `${uploadProgress}%`,
                                      transition: 'width 0.3s ease'
                                   }} />
                               </div>
                           </div>
                        ) : (
                           <button
                              type="submit"
                              disabled={!audioFile || !trackTitle || audioTracks.length >= 6}
                              style={{
                                 width: '100%',
                                 padding: '16px',
                                 borderRadius: '12px',
                                 background: (!audioFile || !trackTitle || audioTracks.length >= 6) ? 'rgba(234,154,97,0.1)' : '#EA9A61',
                                 color: (!audioFile || !trackTitle || audioTracks.length >= 6) ? 'rgba(234,154,97,0.3)' : '#0A0A0A',
                                 border: 'none',
                                 fontSize: '15px',
                                 fontFamily: "'Roboto', sans-serif",
                                 fontWeight: 600,
                                 cursor: (!audioFile || !trackTitle || audioTracks.length >= 6) ? 'not-allowed' : 'pointer',
                                 transition: 'all 0.2s',
                              }}
                           >
                              {audioTracks.length >= 6 ? 'Limit Reached' : 'Upload Track'}
                           </button>
                        )}
                    </div>
                   </>
                 )}
              </form>
           </div>
         </div>
       )}

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

      {/* Revision Request Modal */}
      {isRevisionModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            animation: 'confirmFadeIn 0.25s ease-out forwards',
          }}
          onClick={() => !isSubmittingRevision && setIsRevisionModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(15,15,15,0.95)',
              border: '1px solid rgba(255,244,227,0.08)',
              borderRadius: '24px',
              padding: '40px',
              width: '90%',
              maxWidth: '480px',
              animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsRevisionModalOpen(false)}
              disabled={isSubmittingRevision}
              style={{
                position: 'absolute', top: '24px', right: '24px',
                background: 'transparent', border: 'none', color: 'rgba(255,244,227,0.4)',
                cursor: 'pointer', padding: '4px'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(254,154,97,0.6)', marginBottom: '8px' }}>
                Revision {revisions.length + 1} of 2
              </p>
              <h2 style={{
                fontSize: '24px',
                fontFamily: 'Norwige, sans-serif',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#FFF4E3',
                margin: 0,
              }}>
                Request a Review
              </h2>
            </div>

            <form onSubmit={handleRevisionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,244,227,0.6)', marginBottom: '12px' }}>
                  What would you like us to change? Please be specific.
                </label>
                <textarea 
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="e.g. Can we bring up the vocals in the chorus? Also, the bass feels a bit heavy in the second verse."
                  required
                  disabled={isSubmittingRevision}
                  style={{
                    ...inputStyle, 
                    height: '160px',
                    resize: 'none',
                    lineHeight: '1.6',
                    padding: '16px',
                    ...((isSubmittingRevision ? { opacity: 0.5, cursor: 'not-allowed' } : {}) as any)
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!revisionNotes.trim() || isSubmittingRevision}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  background: (!revisionNotes.trim() || isSubmittingRevision) ? 'rgba(234,154,97,0.1)' : '#EA9A61',
                  color: (!revisionNotes.trim() || isSubmittingRevision) ? 'rgba(234,154,97,0.3)' : '#0A0A0A',
                  border: 'none',
                  fontSize: '15px',
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 600,
                  cursor: (!revisionNotes.trim() || isSubmittingRevision) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isSubmittingRevision ? 'Submitting...' : 'Submit Revision Request'}
              </button>
              
              <p style={{ fontSize: '12px', color: 'rgba(255,244,227,0.3)', textAlign: 'center', margin: 0 }}>
                This will count as revision {revisions.length + 1} out of 2.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
