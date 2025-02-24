"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  url: string;
}

interface OrbProps {
  hue?: number;
  rotateOnHover?: boolean;
  isPlaying: boolean;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Come Thru",
    artist: "Basu",
    duration: "2:17",
    cover: "cover2.png",
    url: "/tracks/come thru master(go first).wav"
  },
  {
    id: 2,
    title: "LAST TIME",
    artist: "Adil Hasan",
    duration: "2:40",
    cover: "cover4.png",
    url: "/tracks/last time master.wav"
  },
  {
    id: 3,
    title: "Martyr",
    artist: "DDK",
    duration: "2:40",
    cover: "cover7.png",
    url: "/tracks/martry new new master.wav"
  },
  {
    id: 4,
    title: "Kiss Of Death",
    artist: "DDK",
    duration: "2:36",
    cover: "cover8.png",
    url: "/tracks/master kod.wav"
  },
  {
    id: 5,
    title: "up late, up early",
    artist: "DDK",
    duration: "3:12",
    cover: "cover5.png",
    url: "/tracks/master up late final.wav"
  },
  {
    id: 6,
    title: "ruin my life",
    artist: "mttw, Basu",
    duration: "2:10",
    cover: "cover6.png",
    url: "/tracks/ruin my life master.wav"
  },
  {
    id: 7,
    title: "you could be my woman",
    artist: "Basu",
    duration: "2:46",
    cover: "cover1.png",
    url: "/tracks/you could be my woman.wav"
  }
];

function Orb({
  hue = 0,
  rotateOnHover = true,
  isPlaying,
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const currentStateRef = useRef(0);

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float rot;
    uniform float state;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }
    
    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }
    
    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }
    
    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }
    
    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;
    
    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }
    
    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;
      
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);
      v0 *= smoothstep(r0 * 1.05, r0, len);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 col = mix(color1, color2, cl);
      col = mix(color3, col, v0);
      col = (col + v1) * v2 * v3;
      col = clamp(col, 0.0, 1.0);
      
      return extractAlpha(col);
    }
    
    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      uv.x += state * 0.05 * sin(uv.y * 10.0 + iTime);
      uv.y += state * 0.05 * sin(uv.x * 10.0 + iTime);
      
      return draw(uv);
    }
    
    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Vec3(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        hue: { value: hue },
        rot: { value: 0 },
        state: { value: isPlaying ? 1.0 : 0.0 },
      },
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    let lastTime = performance.now();
    let currentRot = 0;
    const rotationSpeed = 0.3;

    function resize() {
      if (!container || !rendererRef.current || !programRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      rendererRef.current.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = width + "px";
      gl.canvas.style.height = height + "px";
      programRef.current.uniforms.iResolution.value.set(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
      rendererRef.current.render({ scene: mesh });
    }
    window.addEventListener("resize", resize);
    resize();

    const update = (t: number) => {
      rafIdRef.current = requestAnimationFrame(update);
      if (!programRef.current || !rendererRef.current || !meshRef.current) return;

      const dt = (t - lastTime) * 0.001;
      lastTime = t;

      const targetState = isPlaying ? 1.0 : 0.0;
      currentStateRef.current += (targetState - currentStateRef.current) * 0.1;
      programRef.current.uniforms.state.value = currentStateRef.current;

      if (isPlaying) {
        programRef.current.uniforms.iTime.value = t * 0.001;
        programRef.current.uniforms.hue.value = hue;

        if (rotateOnHover) {
          currentRot += dt * rotationSpeed;
        }
        programRef.current.uniforms.rot.value = currentRot;
      }

      rendererRef.current.render({ scene: meshRef.current });
    };

    rafIdRef.current = requestAnimationFrame(update);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("resize", resize);
      if (container && gl.canvas.parentNode) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [hue, rotateOnHover, isPlaying]);

  return <div ref={ctnDom} className="w-32 h-32" />;
}

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const startPlayback = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setTimeout(startPlayback, 0);
  };

  const playPrevious = () => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[previousIndex]);
    setTimeout(startPlayback, 0);
  };

  const handleTrackSelect = (track: Track) => {
    if (track.id === currentTrack.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setTimeout(startPlayback, 0);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* TUNE IN Heading - Moved outside the card */}
      <div
        className="text-white text-4xl font-bold text-center mb-8"
        style={{ fontFamily: "Flight Maybe Maj, sans-serif" }}
      >
        <span>
          <em>TUNE</em> 
        </span>
        <span className="text-transparent [-webkit-text-stroke:1px_white]">
          IN
        </span>
      </div>

      <div className="bg-zinc-800/50 rounded-lg p-6 backdrop-blur-lg shadow-xl">
        {/* Now Playing */}
        <div className="flex items-center justify-between space-x-6">
          <div className="flex items-center space-x-6">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-20 h-20 md:w-32 md:h-32 rounded-lg shadow-lg"
            />
            <div>
              <h2 className="text-lg md:text-2xl font-bold" style={{ fontFamily: 'Flight Maybe Maj, sans-serif' }}>
                {currentTrack.title}
              </h2>
              <p className="text-zinc-400 text-sm md:text-base" style={{ fontFamily: 'Proxima Nova, sans-serif' }}>
                {currentTrack.artist}
              </p>
            </div>
          </div>
          <Orb isPlaying={isPlaying} />
        </div>

        {/* Progress Bar */}
        <div 
          ref={progressBarRef}
          className="mt-6 h-1 bg-zinc-600 rounded-full cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm mt-1 text-zinc-400">
          <span>{ formatTime(currentTime) }</span>
          <span>{ formatTime(duration) }</span>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <button 
            onClick={() => setIsShuffled(!isShuffled)}
            className={cn(
              "p-2 rounded-full hover:bg-zinc-700 transition",
              isShuffled && "text-green-500"
            )}
          >
            <Shuffle size={20} />
          </button>
          <button 
            onClick={playPrevious}
            className="p-2 rounded-full hover:bg-zinc-700 transition"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="p-4 bg-white text-black rounded-full hover:bg-zinc-200 transition"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button 
            onClick={playNext}
            className="p-2 rounded-full hover:bg-zinc-700 transition"
          >
            <SkipForward size={24} />
          </button>
          <button 
            onClick={() => setIsRepeating(!isRepeating)}
            className={cn(
              "p-2 rounded-full hover:bg-zinc-700 transition",
              isRepeating && "text-green-500"
            )}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="mt-6 flex items-center space-x-2">
          <button onClick={toggleMute} className="p-2 hover:bg-zinc-700 rounded-full transition">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-white"
          />
        </div>

        {/* Playlist */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Up Next</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tracks.map((track) => (
              <div 
                key={track.id}
                onClick={() => handleTrackSelect(track)}
                className={cn(
                  "flex items-center p-2 rounded-lg hover:bg-zinc-700/50 cursor-pointer transition",
                  currentTrack.id === track.id && "bg-zinc-700/50"
                )}
              >
                <img 
                  src={track.cover} 
                  alt={track.title}
                  className="w-12 h-12 rounded"
                />
                <div className="ml-4">
                  <p className="font-medium" style={{ fontFamily: 'Flight Maybe Maj, sans-serif' }}>
                    {track.title}
                  </p>
                  <p className="text-sm text-zinc-400" style={{ fontFamily: 'Proxima Nova, sans-serif' }}>
                    {track.artist}
                  </p>
                </div>
                <span className="ml-auto text-sm text-zinc-400" style={{ fontFamily: 'Proxima Nova, sans-serif' }}>
                  {track.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          loop={isRepeating}
        />
      </div>
    </div>
  );
}