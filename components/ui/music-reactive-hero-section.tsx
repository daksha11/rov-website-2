'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

// CTRL-A audio strip — a slim "now playing" band that lives inline in the
// cream editorial page. No dark box: transparent ground, a reactive frequency
// waveform drawn in the sector accent, seated between hairlines like editorial
// furniture. Plays the Fold loop; bass/mid/treble drive the bars.
export const Component = ({ accent = '#A56A67' }: { accent?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const accentRef = useRef(accent);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { accentRef.current = accent; }, [accent]);
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = isMuted ? 0 : 1;
  }, [isMuted]);

  const initAudio = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.78;
      analyserRef.current = analyser;

      // Gain controls audibility so muting never starves the analyser — the
      // waveform keeps reacting even while silent.
      const gain = audioContext.createGain();
      gain.gain.value = isMuted ? 0 : 1;
      gainRef.current = gain;

      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(gain);
      gain.connect(audioContext.destination);
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }, [isMuted]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PLANET_COUNT = 26;
    // Smoothed per-planet energy so the motion glides and decays naturally.
    const energy = new Array(PLANET_COUNT).fill(0);
    let time = 0;

    // Parse the accent hex once per frame into rgb for gradient stops.
    const hexToRgb = (hex: string) => {
      const h = hex.replace('#', '');
      const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      // Crisp on HiDPI without distorting the layout box.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      time++;

      let freq: Uint8Array | null = null;
      if (analyserRef.current && isPlayingRef.current) {
        const buf = analyserRef.current.frequencyBinCount;
        freq = new Uint8Array(buf);
        analyserRef.current.getByteFrequencyData(freq);
      }

      const [ar, ag, ab] = hexToRgb(accentRef.current);
      const mid = h / 2;
      const spacing = w / PLANET_COUNT;
      // Planets grow within their lane, capped by strip height for the thin band.
      const maxR = Math.min(spacing * 0.42, h * 0.4);
      const baseR = Math.max(1.5, maxR * 0.22);

      for (let i = 0; i < PLANET_COUNT; i++) {
        let target: number;
        if (freq) {
          // Sample across the spectrum, weighted toward the musical low-mids.
          const idx = Math.floor(Math.pow(i / PLANET_COUNT, 1.35) * (freq.length * 0.7));
          target = freq[idx] / 255;
        } else {
          // Idle: a soft travelling swell so the planets breathe when paused.
          target = 0.1 + (Math.sin(i * 0.45 - time * 0.05) * 0.5 + 0.5) * 0.18;
        }
        // Fast attack, slower release — reads like a real meter.
        const cur = energy[i];
        energy[i] = target > cur ? cur + (target - cur) * 0.5 : cur + (target - cur) * 0.14;

        const norm = Math.min(1, energy[i]);
        const r = baseR + norm * (maxR - baseR);
        const x = i * spacing + spacing / 2;
        // Planets rise a touch on the beat, plus a gentle idle bob.
        const y = mid - norm * (h * 0.14) + Math.sin(time * 0.03 + i) * 1.5;

        // A few planets wear Saturn rings — draw behind the body.
        const ringed = i % 5 === 2;
        if (ringed) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-0.42);
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.95, r * 0.66, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${0.4 + norm * 0.45})`;
          ctx.lineWidth = Math.max(1, r * 0.16);
          ctx.stroke();
          ctx.restore();
        }

        // Dark planet body — a lit plum edge to a near-black core so it reads
        // strong on the cream page.
        const g = ctx.createRadialGradient(x - r * 0.32, y - r * 0.36, r * 0.1, x, y, r);
        g.addColorStop(0, `rgba(78, 61, 115, ${0.9 + norm * 0.1})`);
        g.addColorStop(0.55, 'rgba(34, 18, 54, 0.98)');
        g.addColorStop(1, '#120826');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Tiny accent rim-light on the brightest planets.
        if (norm > 0.55) {
          ctx.beginPath();
          ctx.arc(x - r * 0.34, y - r * 0.38, r * 0.16, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${(norm - 0.55) * 0.9})`;
          ctx.fill();
        }
      }
    };

    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) initAudio();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
      audioRef.current.play().catch((e) => console.error('Error playing audio:', e));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, initAudio]);

  useEffect(() => {
    const cleanup = initCanvas();
    return cleanup;
  }, [initCanvas]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleReady = () => setIsLoading(false);
    const handleError = (e: Event) => { console.error('Audio error:', e); setIsLoading(false); };
    if (audio.readyState >= 2) setIsLoading(false);
    audio.addEventListener('loadeddata', handleReady);
    audio.addEventListener('canplay', handleReady);
    audio.addEventListener('canplaythrough', handleReady);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('loadeddata', handleReady);
      audio.removeEventListener('canplay', handleReady);
      audio.removeEventListener('canplaythrough', handleReady);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="ctrla-strip-wrap">
      <div className="ctrla-strip" style={{ ['--acc' as string]: accent }}>
        {/* Play / pause */}
        <button
          className={`ctrla-strip-play ${isPlaying ? 'is-active' : ''}`}
          onClick={togglePlayback}
          disabled={isLoading}
          aria-label={isLoading ? 'Loading' : isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? '○' : isPlaying ? '❚❚' : '▶'}
        </button>

        {/* Track label */}
        <div className="ctrla-strip-meta">
          <span className="ctrla-strip-kicker">
            <span
              className="ctrla-strip-dot"
              style={{ background: accent, boxShadow: isPlaying ? `0 0 8px ${accent}` : 'none' }}
              aria-hidden
            />
            {isPlaying ? 'Now playing' : 'Listen'}
          </span>
          <span className="ctrla-strip-title">The Fold · ambient loop</span>
        </div>

        {/* Reactive waveform fills the remaining width */}
        <canvas ref={canvasRef} className="ctrla-strip-canvas" />

        {/* Mute */}
        <button
          className={`ctrla-strip-mute ${isMuted ? 'is-muted' : ''}`}
          onClick={() => setIsMuted(!isMuted)}
          disabled={!isPlaying}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '◯' : '●'}
        </button>
      </div>

      <audio ref={audioRef} src="/ctrla/scloop.mp3" crossOrigin="anonymous" preload="auto" loop />
    </div>
  );
};
