'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Crop,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Sparkles,
  Smartphone,
  Tv,
  Square,
  Image as ImageIcon,
} from 'lucide-react';

export type AspectRatioType = '9:16' | '16:9' | '1:1' | '4:3' | 'free';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  defaultAspectRatio?: AspectRatioType;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, croppedUrl: string) => void;
}

export const ASPECT_RATIOS: {
  id: AspectRatioType;
  label: string;
  desc: string;
  ratio: number | null; // width / height
  icon: React.ReactNode;
}[] = [
  {
    id: '9:16',
    label: '9:16 Portrait',
    desc: 'Reels / Stories / Mobile',
    ratio: 9 / 16,
    icon: <Smartphone className="w-4 h-4" />,
  },
  {
    id: '16:9',
    label: '16:9 Landscape',
    desc: 'Hero / Banners / Desktop',
    ratio: 16 / 9,
    icon: <Tv className="w-4 h-4" />,
  },
  {
    id: '1:1',
    label: '1:1 Square',
    desc: 'Products / Thumbnails',
    ratio: 1,
    icon: <Square className="w-4 h-4" />,
  },
  {
    id: '4:3',
    label: '4:3 Standard',
    desc: 'Blog / Recipes',
    ratio: 4 / 3,
    icon: <ImageIcon className="w-4 h-4" />,
  },
  {
    id: 'free',
    label: 'Free / Original',
    desc: 'No constraint',
    ratio: null,
    icon: <Maximize2 className="w-4 h-4" />,
  },
];

export default function ImageCropModal({
  isOpen,
  imageSrc,
  defaultAspectRatio = '1:1',
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(defaultAspectRatio);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset controls when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setAspectRatio(defaultAspectRatio);
      setZoom(1);
      setRotation(0);
      setIsFlipped(false);
      setOffset({ x: 0, y: 0 });
      setFitMode('cover');
    }
  }, [isOpen, defaultAspectRatio, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // Perform client-side high-quality canvas crop & export
  const handleApplyCrop = useCallback(async () => {
    if (!imgRef.current) return;
    setIsProcessing(true);

    try {
      const img = imgRef.current;
      const naturalWidth = img.naturalWidth || 1200;
      const naturalHeight = img.naturalHeight || 1200;

      // Determine output target dimensions based on selected aspect ratio
      const activeRatioConfig = ASPECT_RATIOS.find((r) => r.id === aspectRatio);
      let targetRatio = activeRatioConfig?.ratio;

      if (!targetRatio) {
        // Free / Original ratio
        targetRatio = naturalWidth / naturalHeight;
      }

      let outWidth = 1200;
      let outHeight = Math.round(1200 / targetRatio);

      if (aspectRatio === '9:16') {
        outWidth = 1080;
        outHeight = 1920;
      } else if (aspectRatio === '16:9') {
        outWidth = 1920;
        outHeight = 1080;
      } else if (aspectRatio === '1:1') {
        outWidth = 1200;
        outHeight = 1200;
      } else if (aspectRatio === '4:3') {
        outWidth = 1600;
        outHeight = 1200;
      }

      const canvas = document.createElement('canvas');
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not supported');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill background (for contain mode)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, outWidth, outHeight);

      ctx.save();
      // Move to center for rotation & scaling
      ctx.translate(outWidth / 2, outHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(isFlipped ? -1 : 1, 1);

      // Scaling calculation
      const scaleX = outWidth / naturalWidth;
      const scaleY = outHeight / naturalHeight;
      const baseScale = fitMode === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
      const totalScale = baseScale * zoom;

      const drawWidth = naturalWidth * totalScale;
      const drawHeight = naturalHeight * totalScale;

      // Offset normalized to target canvas size
      const drawX = -drawWidth / 2 + (offset.x * (outWidth / 400));
      const drawY = -drawHeight / 2 + (offset.y * (outHeight / 400));

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedUrl = URL.createObjectURL(blob);
            onCropComplete(blob, croppedUrl);
            onClose();
          }
          setIsProcessing(false);
        },
        'image/jpeg',
        0.92
      );
    } catch (e) {
      console.error('Crop failed:', e);
      setIsProcessing(false);
    }
  }, [aspectRatio, fitMode, zoom, rotation, isFlipped, offset, onCropComplete, onClose]);

  if (!isOpen) return null;

  const currentRatioConfig = ASPECT_RATIOS.find((r) => r.id === aspectRatio);
  const ratioValue = currentRatioConfig?.ratio || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2D5A27]/10 flex items-center justify-center text-[#2D5A27]">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Adjust & Format Image</h2>
              <p className="text-xs text-gray-500">
                Choose ratio (9:16, 16:9, 1:1), zoom, and crop to fit perfectly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto">
          {/* Left / Center: Interactive Preview Viewport */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-4 min-h-[380px] max-h-[460px] relative select-none overflow-hidden">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                aspectRatio: currentRatioConfig?.ratio ? `${currentRatioConfig.ratio}` : 'auto',
                maxHeight: '360px',
                maxWidth: '100%',
              }}
              className="relative border-2 border-dashed border-emerald-500/80 rounded-xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center bg-slate-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${isFlipped ? -zoom : zoom}, ${zoom})`,
                  objectFit: fitMode,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
                className="max-w-none w-full h-full pointer-events-none"
              />

              {/* Grid overlay for rule of thirds guide */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Ratio badge overlay */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                {currentRatioConfig?.label}
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
              <span>💡 Drag image to reposition inside frame</span>
            </p>
          </div>

          {/* Right: Aspect Ratio Presets & Fine Tuning */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Ratio Selectors */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Aspect Ratio Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ASPECT_RATIOS.map((item) => {
                    const isSelected = aspectRatio === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setAspectRatio(item.id);
                          setOffset({ x: 0, y: 0 });
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2D5A27] text-white border-[#2D5A27] shadow-sm font-bold'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 text-xs'
                        }`}
                      >
                        <span className={isSelected ? 'text-white' : 'text-gray-500'}>
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs leading-none truncate font-bold">{item.label}</p>
                          <p
                            className={`text-[10px] mt-0.5 truncate ${
                              isSelected ? 'text-emerald-100' : 'text-gray-400'
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fit Mode Toggle */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Fit Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFitMode('cover')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      fitMode === 'cover'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Cover (Fill)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitMode('contain')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      fitMode === 'contain'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Contain (Full Image)
                  </button>
                </div>
              </div>

              {/* Zoom Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Zoom Scale</span>
                  <span className="text-gray-400 font-mono">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="range"
                    min="0.8"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2D5A27]"
                  />
                  <ZoomIn className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              {/* Transform Actions */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Transform</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="flex-1 py-2 px-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-gray-500" />
                    <span>Rotate 90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="flex-1 py-2 px-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5 text-gray-500" />
                    <span>Flip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#2D5A27] hover:bg-[#23471e] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer transition-all"
              >
                {isProcessing ? (
                  <span>Applying...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Apply & Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
