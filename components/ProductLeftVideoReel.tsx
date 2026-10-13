'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Film, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';

export interface ProductVideoClip {
  videoUrl: string;
  title: string;
  desc: string;
  badge?: string;
}

interface ProductLeftVideoReelProps {
  productSlug: string;
  categorySlug?: string;
  productName: string;
  posterImage: string;
  clips: ProductVideoClip[];
}

export default function ProductLeftVideoReel({
  productName,
  posterImage,
  clips,
}: ProductLeftVideoReelProps) {
  const [activeClipIdx, setActiveClipIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!clips || clips.length === 0) return null;

  const currentClip = clips[activeClipIdx] || clips[0];

  const handleTogglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (vid) {
      vid.muted = nextMuted;
    }
  };

  const handleSelectClip = (idx: number) => {
    setActiveClipIdx(idx);
    setIsPlaying(false);
    setTimeout(() => {
      const vid = videoRef.current;
      if (vid) {
        vid.load();
        vid.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 60);
  };

  return (
    <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#FAF8F5] via-white to-[#F3EFE6] border border-stone-200/90 p-5 sm:p-6 shadow-sm">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A6B35] text-white text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Film className="w-3.5 h-3.5 text-[#EBC164]" />
            <span>Product Video Reel</span>
          </span>
          {clips.length > 1 && (
            <span className="text-xs font-semibold text-stone-500">
              ({clips.length} Videos Available)
            </span>
          )}
        </div>

        {/* Selectable Clip Pills when multiple clips exist */}
        {clips.length > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {clips.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectClip(idx)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  idx === activeClipIdx
                    ? 'bg-[#1A3826] text-[#EBC164] shadow-2xs scale-105'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/70'
                }`}
              >
                Reel #{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Grid inside Left Column */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* Vertical 9:16 Video Player */}
        <div className="sm:col-span-5 flex justify-center">
          <div
            onClick={handleTogglePlay}
            className="relative w-full max-w-[230px] aspect-[9/16] rounded-2xl overflow-hidden bg-stone-950 border-2 border-[#3A6B35]/25 shadow-lg cursor-pointer group select-none"
          >
            <video
              ref={videoRef}
              key={currentClip.videoUrl}
              src={currentClip.videoUrl}
              poster={posterImage}
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {/* Top Audio Toggle Button */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleMute}
                className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-transform active:scale-95 shadow-md"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                title={isMuted ? 'Tap for sound' : 'Mute audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#EBC164]" />}
              </button>
            </div>

            {/* Top-left Live Badge */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {currentClip.badge || `Clip ${activeClipIdx + 1}/${clips.length}`}
              </span>
            </div>

            {/* Center Play/Pause Overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-200 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white/90 text-[#1A3826] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-[#1A3826]" />
                ) : (
                  <Play className="w-5 h-5 fill-[#1A3826] ml-0.5" />
                )}
              </div>
            </div>

            {/* Bottom Caption Overlay inside Video */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none">
              <p className="text-[11px] font-bold text-white line-clamp-1">{productName}</p>
              <p className="text-[10px] text-white/80">
                {isPlaying ? 'Click to pause' : 'Click to play reel'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Details & Clip Switcher */}
        <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#3A6B35]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Product &amp; Kitchen Footage</span>
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-stone-900 leading-snug">
              {currentClip.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {currentClip.desc}
            </p>
          </div>

          {/* Interactive Video Playlist Selector */}
          {clips.length > 1 && (
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Select Video Reel ({clips.length}):
              </p>
              <div className="space-y-1.5">
                {clips.map((clip, idx) => {
                  const active = idx === activeClipIdx;
                  return (
                    <button
                      key={clip.videoUrl + idx}
                      type="button"
                      onClick={() => handleSelectClip(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        active
                          ? 'bg-[#3A6B35]/10 border-[#3A6B35] text-[#1A3826] font-bold shadow-2xs'
                          : 'bg-white border-stone-200/80 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span className="truncate">
                        {idx + 1}. {clip.title}
                      </span>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          active ? 'bg-[#3A6B35] text-white' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {active && isPlaying ? 'Playing' : 'Watch'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Purity & Quality Checkpoints */}
          <div className="bg-white/90 rounded-2xl p-3.5 border border-stone-200/80 space-y-1.5 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3A6B35] shrink-0" />
              <span>100% Pure Whole-Food Ingredient · 0% Additives</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3A6B35] shrink-0" />
              <span>Hygienically Packed in Nepal with Batch &amp; Expiry Label</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <a
              href="https://www.facebook.com/profile.php?id=61589084257990"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#1877F2] hover:underline"
            >
              <span>Watch More on NaturesMud Facebook Reels</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
