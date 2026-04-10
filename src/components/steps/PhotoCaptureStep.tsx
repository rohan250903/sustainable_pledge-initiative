import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle, ArrowRight, ArrowLeft, X } from 'lucide-react';

interface PhotoCaptureStepProps {
  photoUrl: string | null;
  onNext: (photoUrl: string) => void;
  onBack: () => void;
}

export default function PhotoCaptureStep({ photoUrl: initialPhoto, onNext, onBack }: PhotoCaptureStepProps) {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      setCameraError('Could not access camera. Please allow camera permissions or upload a photo instead.');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhoto(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!photo) {
      setError('Please provide a photo to proceed.');
      return;
    }
    onNext(photo);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Add Your Photo</h2>
        <p className="text-gray-500 mt-1 text-sm">Upload a photo or take a selfie for your certificate</p>
      </div>

      {isCameraOpen ? (
        <div className="relative rounded-xl overflow-hidden bg-black shadow-lg">
          <video ref={videoRef} className="w-full h-72 object-cover" playsInline muted />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={stopCamera}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-4 border-green-400"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full" />
            </button>
          </div>
        </div>
      ) : photo ? (
        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center" style={{ height: 280 }}>
            <img src={photo} alt="Your selfie" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5 shadow-md">
            <CheckCircle className="w-4 h-4" />
          </div>
          <button
            onClick={() => setPhoto(null)}
            className="mt-3 w-full border-2 border-gray-300 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Change Photo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {cameraError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-lg">
              {cameraError}
            </div>
          )}
          <button
            onClick={startCamera}
            className="w-full border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-6 rounded-xl flex flex-col items-center gap-2 transition-colors"
          >
            <Camera className="w-8 h-8" />
            <span>Take a Selfie</span>
            <span className="text-xs text-green-500 font-normal">Use your device's camera</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-6 rounded-xl flex flex-col items-center gap-2 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-500" />
            <span>Upload a Photo</span>
            <span className="text-xs text-gray-400 font-normal">JPG, PNG up to 5MB</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-green-600 text-green-700 font-semibold py-3 rounded-lg hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          Generate Certificate
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
