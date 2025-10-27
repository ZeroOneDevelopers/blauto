'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

type Props = { src: string };

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function LuxAudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrent(el.currentTime);
      setDuration(el.duration || 0);
      if (el.duration) setProgress((el.currentTime / el.duration) * 100);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrent(0);
    };

    el.addEventListener('play', handlePlay);
    el.addEventListener('pause', handlePause);
    el.addEventListener('timeupdate', handleTimeUpdate);
    el.addEventListener('ended', handleEnded);
    el.addEventListener('loadedmetadata', handleTimeUpdate);

    return () => {
      el.removeEventListener('play', handlePlay);
      el.removeEventListener('pause', handlePause);
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('ended', handleEnded);
      el.removeEventListener('loadedmetadata', handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrent(0);
  }, [src]);

  const timeSummary = useMemo(() => `${formatTime(current)} / ${formatTime(duration)}`, [current, duration]);

  function togglePlayback() {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.pause();
    else el.play().catch(() => {});
  }

  function handleSeek(event: React.MouseEvent<HTMLDivElement>) {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    el.currentTime = Math.max(0, Math.min(el.duration * ratio, el.duration));
  }

  return (
    <div className="group flex items-center gap-5 surface-panel rounded-3xl p-4 transition duration-300 hover:border-white/30 hover:shadow-glow">
      <button
        type="button"
        onClick={togglePlayback}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-label={isPlaying ? 'Pause engine audio' : 'Play engine audio'}
      >
        {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
      </button>

      <div className="flex-1 space-y-2">
        <div className="relative h-2 cursor-pointer overflow-hidden rounded-full bg-white/10" onClick={handleSeek} role="presentation">
          <div className="absolute inset-y-0 left-0 rounded-full bg-white/80 transition-[width] duration-300" style={{ width: `${progress}%` }} />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-silver/60">
          <span>Engine Audio Preview</span>
          <span>{timeSummary}</span>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
