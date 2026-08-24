'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Crop,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Trash2,
  Smartphone,
  Tv,
  Square,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/admin/api-client';
import ImageCropModal, { AspectRatioType, ASPECT_RATIOS } from './ImageCropModal';
import { toast } from 'sonner';

export interface MediaUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  defaultAspectRatio?: AspectRatioType;
  label?: string;
  hint?: string;
  allowAspectSelector?: boolean;
  className?: string;
}

export default function MediaUploader({
  value,
  onChange,
  folder = 'products',
  defaultAspectRatio = '1:1',
  label = 'Upload Image',
  hint = 'Supports JPG, PNG, WEBP, GIF, SVG, AVIF. Max 30MB.',
  allowAspectSelector = true,
  className = '',
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(defaultAspectRatio);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Check size (30MB)
    if (file.size > 30 * 1024 * 1024) {
      toast.error('File size exceeds 30MB limit.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setRawImageSrc(objectUrl);
    setCropModalOpen(true);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadBlob = async (blob: Blob) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      const filename = `img-${selectedRatio.replace(':', '-')}-${Date.now()}.jpg`;
      formData.append('file', blob, filename);
      formData.append('folder', folder);

      const res = await api.upload<{
        url: string;
        publicId: string;
        width: number;
        height: number;
      }>('/upload/image', formData);

      if (res?.url) {
        onChange(res.url);
        toast.success('Image uploaded and optimized successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-700">{label}</label>
          {allowAspectSelector && (
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
              {ASPECT_RATIOS.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRatio(r.id)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    selectedRatio === r.id
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title={r.desc}
                >
                  {r.id}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif,.svg,.avif,.webp,.png,.jpg,.jpeg"
        onChange={onInputChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <div
            className={`w-full relative flex items-center justify-center bg-gray-900/5 ${
              selectedRatio === '9:16'
                ? 'aspect-[9/16] max-h-[360px]'
                : selectedRatio === '16:9'
                ? 'aspect-video'
                : selectedRatio === '4:3'
                ? 'aspect-[4/3]'
                : 'aspect-square'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => {
                setRawImageSrc(value);
                setCropModalOpen(true);
              }}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Adjust / Crop</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md cursor-pointer transition-all"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-200 hover:border-[#2D5A27] hover:bg-[#2D5A27]/5 transition-all rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group bg-gray-50/50 ${
            selectedRatio === '9:16'
              ? 'aspect-[9/12] max-h-[300px]'
              : selectedRatio === '16:9'
              ? 'aspect-video max-h-[220px]'
              : 'aspect-square max-h-[240px]'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-[#2D5A27]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold">Uploading & Optimizing...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-gray-200 group-hover:border-[#2D5A27] flex items-center justify-center text-gray-400 group-hover:text-[#2D5A27] transition-all mb-2.5">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-[#2D5A27] transition-colors">
                Click to browse or drag & drop
              </p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">{hint}</p>
              <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                <span>Preset Ratio: {selectedRatio}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Interactive Crop Modal */}
      {cropModalOpen && rawImageSrc && (
        <ImageCropModal
          isOpen={cropModalOpen}
          imageSrc={rawImageSrc}
          defaultAspectRatio={selectedRatio}
          onClose={() => {
            setCropModalOpen(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          onCropComplete={(blob) => {
            uploadBlob(blob);
          }}
        />
      )}
    </div>
  );
}
