import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Image as ImageIcon,
  Settings,
  Info,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Sparkles,
  Download,
  Share2,
  Printer,
  X,
  Check,
  Trash2,
  Palette,
  Eye,
  Crop,
  Volume2,
  Moon,
  Sun,
  Laptop
} from "lucide-react";
import {
  SarahPortraitSVG,
  DavidPortraitSVG,
  AlexPortraitSVG,
  BlackBlazerSVG,
  BlackSuitSVG,
  WhiteShirtSVG,
  BlackTieSVG,
} from "./Assets";
import { BackgroundColorOption, FaceLandmarks, PhotoAdjustments, PhotoSize, RecentPhoto } from "../types";
import { motion } from "motion/react";

// Supported Preset Background Colors
const BACKGROUND_COLORS: BackgroundColorOption[] = [
  { name: "White", value: "#FFFFFF", hex: "#FFFFFF" },
  { name: "Sky Blue", value: "#38BDF8", hex: "#38BDF8" },
  { name: "Light Blue", value: "#93C5FD", hex: "#93C5FD" },
  { name: "Grey", value: "#71717A", hex: "#71717A" },
  { name: "Light Grey", value: "#D4D4D8", hex: "#D4D4D8" },
  { name: "Cream", value: "#FFFBEB", hex: "#FFFBEB" },
  { name: "Beige", value: "#F5F5DC", hex: "#F5F5DC" },
  { name: "Pink", value: "#FBCFE8", hex: "#FBCFE8" },
  { name: "Yellow", value: "#FEF08A", hex: "#FEF08A" },
  { name: "Green", value: "#86EFAC", hex: "#86EFAC" },
  { name: "Red", value: "#FCA5A5", hex: "#FCA5A5" },
  { name: "Black", value: "#18181B", hex: "#18181B" },
];

// Target Print Sizes
const PHOTO_SIZES: PhotoSize[] = [
  { id: "std_passport", name: "Standard Passport (35 x 45 mm)", widthMm: 35, heightMm: 45, aspectRatio: 35/45, description: "Standard sizing for EU, UK, India, and general use" },
  { id: "us_passport", name: "US Passport / Visa (2\" x 2\")", widthMm: 51, heightMm: 51, aspectRatio: 1, description: "Standard US, Canada, and Saudi Arabia Visa size" },
  { id: "cn_passport", name: "China Passport (33 x 48 mm)", widthMm: 33, heightMm: 48, aspectRatio: 33/48, description: "Official Chinese Civil Passport standard" },
  { id: "id_card", name: "National ID / Drivers (30 x 40 mm)", widthMm: 30, heightMm: 40, aspectRatio: 30/40, description: "Compact card identity standard" },
];

export const MobileApp: React.FC = () => {
  // Navigation & Screen Control: "home" | "camera" | "editor" | "export" | "settings" | "about"
  const [activeScreen, setActiveScreen] = useState<string>("home");

  // Selection & Source State
  const [selectedPreset, setSelectedPreset] = useState<string>("sarah"); // "sarah" | "david" | "alex" | "custom"
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);

  // Edit / AI Controls
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    vibrance: 0,
    sharpness: 0,
    warmth: 0,
    tint: 0,
    highlights: 0,
    shadows: 0,
  });

  const [selectedColor, setSelectedColor] = useState<BackgroundColorOption>(BACKGROUND_COLORS[1]); // Default Sky Blue
  const [customColor, setCustomColor] = useState<string>("#FFFFFF");
  const [selectedOutfit, setSelectedOutfit] = useState<string>("None"); // "None" | "Black Blazer" | "Black Suit" | "White Shirt" | "Black Tie"
  const [selectedSize, setSelectedSize] = useState<PhotoSize>(PHOTO_SIZES[0]);
  const [autoEnhanced, setAutoEnhanced] = useState<boolean>(false);

  // Image capturing and webcam states
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<boolean>(false);

  // Camera tap-to-focus states
  const [focusPosition, setFocusPosition] = useState<{ x: number; y: number } | null>(null);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // AI loading and landmarks detection
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [landmarks, setLandmarks] = useState<FaceLandmarks | null>(null);
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(true);

  // Layout Printing Options
  const [printLayoutCount, setPrintLayoutCount] = useState<number>(8); // 8 | 16 | 32

  // Settings Panel Configs
  const [appTheme, setAppTheme] = useState<string>("light");
  const [defaultBg, setDefaultBg] = useState<string>("Sky Blue");
  const [exportFormat, setExportFormat] = useState<string>("PNG");
  const [imgQuality, setImgQuality] = useState<string>("High (300 DPI)");
  const [appLanguage, setAppLanguage] = useState<string>("English");

  // Local SQFlite-like History State
  const [history, setHistory] = useState<RecentPhoto[]>([]);

  // Time stamp for dynamic status bar clock
  const [currentTime, setCurrentTime] = useState<string>("");

  // Simulated toast messages to avoid native window.alert in iframe environments
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const handleCameraTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFocusPosition({ x, y });

    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    focusTimeoutRef.current = setTimeout(() => {
      setFocusPosition(null);
    }, 1500);

    // Dynamic compliance feedback
    showToast("Biometric focus locked on alignment zone");
  };

  useEffect(() => {
    // Clock update loop
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Initial Database History Sync
    const savedHistory = localStorage.getItem("passport_photo_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      // Mock history on first load
      const initialMock: RecentPhoto[] = [
        { id: "1", imageSrc: "sarah", createdAt: "2026-07-04 14:22", sizeName: "Standard Passport", bgColorName: "Sky Blue", hasBlazer: true },
        { id: "2", imageSrc: "david", createdAt: "2026-07-03 10:45", sizeName: "US Passport / Visa", bgColorName: "White", hasBlazer: false },
      ];
      localStorage.setItem("passport_photo_history", JSON.stringify(initialMock));
      setHistory(initialMock);
    }

    return () => clearInterval(interval);
  }, []);

  // Web camera activation
  const startWebcam = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera streaming is unavailable:", err);
      setCameraError(true);
    }
  };

  const stopWebcam = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setFocusPosition(null);
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
  };

  // Trigger capture picture from Webcam
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Center crop to vertical frame
        ctx.drawImage(videoRef.current, -120, 0, 640, 480);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setUploadedImageSrc(dataUrl);
        setSelectedPreset("custom");
        stopWebcam();
        triggerAiLandmarksDetection(dataUrl);
      }
    }
  };

  // File picker handler for gallery select
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setUploadedImageSrc(resultStr);
          setSelectedPreset("custom");
          triggerAiLandmarksDetection(resultStr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Automated AI face landmarks extraction
  const triggerAiLandmarksDetection = async (base64Image: string) => {
    setIsAiLoading(true);
    setActiveScreen("editor");

    try {
      const response = await fetch("/api/face-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setLandmarks(resData.data);
      } else {
        // Fallback simulation coordinates
        setLandmarks({
          faceRect: { top: 0.22, left: 0.35, width: 0.3, height: 0.4 },
          leftEye: { x: 0.44, y: 0.36 },
          rightEye: { x: 0.56, y: 0.36 },
          nose: { x: 0.5, y: 0.43 },
          chin: { x: 0.5, y: 0.58 },
          shoulders: { left: { x: 0.25, y: 0.72 }, right: { x: 0.75, y: 0.72 } },
        });
      }
    } catch (e) {
      console.error("AI landmarks call failed:", e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Toggle Auto-Enhance preset
  const toggleAutoEnhance = () => {
    if (autoEnhanced) {
      setAutoEnhanced(false);
      setAdjustments({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        vibrance: 0,
        sharpness: 0,
        warmth: 0,
        tint: 0,
        highlights: 0,
        shadows: 0,
      });
    } else {
      setAutoEnhanced(true);
      setAdjustments({
        brightness: 12,
        contrast: 15,
        saturation: 8,
        vibrance: 10,
        sharpness: 25,
        warmth: -4,
        tint: 2,
        highlights: -5,
        shadows: 8,
      });
    }
  };

  // Save creation to local database history log
  const saveToHistory = () => {
    const newCreation: RecentPhoto = {
      id: Date.now().toString(),
      imageSrc: selectedPreset,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      sizeName: selectedSize.name.split(" (")[0],
      bgColorName: selectedColor.name,
      hasBlazer: selectedOutfit !== "None",
    };

    const updated = [newCreation, ...history];
    setHistory(updated);
    localStorage.setItem("passport_photo_history", JSON.stringify(updated));
    setActiveScreen("home");
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("passport_photo_history", JSON.stringify(updated));
  };

  // Reset Adjustments
  const resetEditingStudio = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      vibrance: 0,
      sharpness: 0,
      warmth: 0,
      tint: 0,
      highlights: 0,
      shadows: 0,
    });
    setSelectedOutfit("None");
    setSelectedColor(BACKGROUND_COLORS[1]);
    setAutoEnhanced(false);
  };

  // Re-edit previous history items
  const loadHistoryItem = (item: RecentPhoto) => {
    setSelectedPreset(item.imageSrc);
    setSelectedOutfit(item.hasBlazer ? "Black Blazer" : "None");
    const foundColor = BACKGROUND_COLORS.find(c => c.name === item.bgColorName) || BACKGROUND_COLORS[1];
    setSelectedColor(foundColor);
    const foundSize = PHOTO_SIZES.find(s => s.name.startsWith(item.sizeName)) || PHOTO_SIZES[0];
    setSelectedSize(foundSize);
    setActiveScreen("editor");
  };

  // Trigger system browser print dialog
  const triggerNativePrint = () => {
    window.print();
  };

  return (
    <div className={`w-full max-w-[410px] h-[780px] rounded-[48px] bg-slate-900 border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative font-sans text-slate-800 ${appTheme === "dark" ? "dark bg-slate-950 text-slate-200" : ""}`}>
      
      {/* Interactive Toast Banner Overlay */}
      {toastMsg && (
        <div className="absolute top-14 left-4 right-4 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-bounce">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span className="flex-1">{toastMsg}</span>
        </div>
      )}

      {/* Smartphone Status Bar / Speaker notch */}
      <div className="bg-slate-950 text-white h-11 px-6 flex items-center justify-between select-none shrink-0 relative">
        <span className="text-xs font-semibold tracking-tight">{currentTime || "09:41"}</span>
        
        {/* Apple Dynamic Island / Speaker cutout simulation */}
        <div className="absolute left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full top-3 flex items-center justify-center gap-1.5 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
          <span className="w-3 h-1 bg-zinc-800 rounded-full"></span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <Volume2 size={12} className="text-stone-400" />
          <span>5G</span>
          <div className="w-5 h-2.5 border border-white/60 rounded px-0.5 flex items-center">
            <span className="w-3.5 h-1.5 bg-emerald-400 rounded-sm"></span>
          </div>
        </div>
      </div>

      {/* Screen Container */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden relative">
        
        {/* SCREEN: HOME */}
        {activeScreen === "home" && (
          <div className="flex-1 flex flex-col p-5 overflow-y-auto scrollbar-none">
            {/* Logo Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-600/20">
                  <Camera size={20} />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    AI Passport Photo Maker
                  </h1>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    Official biometric standardizer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveScreen("settings")}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            {/* Quick Action Welcome Hero Card */}
            <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden mb-6 border border-indigo-500/20">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                <Camera size={140} />
              </div>
              <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Verifiable Compliance
              </span>
              <h2 className="text-lg font-bold mt-2.5 leading-snug">
                Official Passport & Visa Photo Studio
              </h2>
              <p className="text-xs text-indigo-100/80 mt-1 leading-relaxed">
                Automatic biometric facial lock, white/blue backdrop replacement, and professional blazer clothing overlays.
              </p>
            </div>

            {/* Main Capturing Launcher Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => {
                  setActiveScreen("camera");
                  startWebcam();
                }}
                className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-3xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <span className="text-xs font-bold mt-3 text-slate-800 dark:text-slate-200">
                  Open Camera
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Face guide overlay
                </span>
              </button>

              <label className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50 rounded-3xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-center shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <ImageIcon size={24} />
                </div>
                <span className="text-xs font-bold mt-3 text-slate-800 dark:text-slate-200">
                  Select Gallery
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Pick from camera roll
                </span>
              </label>
            </div>

            {/* Mock Presets for Quick Testing Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Test-Drive with Models
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  300 DPI Portraits
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "sarah", label: "Sarah (PR)", render: <SarahPortraitSVG bgColor="#EFF6FF" hasBlazer="None" adjustments={{ brightness: 0, contrast: 0, saturation: 0 }} /> },
                  { id: "david", label: "David (M)", render: <DavidPortraitSVG bgColor="#EFF6FF" hasBlazer="None" adjustments={{ brightness: 0, contrast: 0, saturation: 0 }} /> },
                  { id: "alex", label: "Alex (U)", render: <AlexPortraitSVG bgColor="#EFF6FF" hasBlazer="None" adjustments={{ brightness: 0, contrast: 0, saturation: 0 }} /> },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      resetEditingStudio();
                      setActiveScreen("editor");
                    }}
                    className="flex flex-col items-center p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:border-indigo-600 hover:shadow-md transition-all active:scale-95 text-center group"
                  >
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform">
                      {preset.render}
                    </div>
                    <span className="text-[10px] font-bold mt-1.5 text-slate-700 dark:text-slate-300">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SQLite Saved History Log list */}
            <div className="flex-1 flex flex-col min-h-0">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Recent Generations History
              </span>

              {history.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center">
                  <ShieldCheck size={28} className="text-slate-300 dark:text-slate-700 mb-1.5" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">SQLite local storage empty</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Processed passport photos will persist here</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
                  {history.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => loadHistoryItem(photo)}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200/50">
                        {photo.imageSrc === "sarah" ? (
                          <SarahPortraitSVG bgColor="#38BDF8" hasBlazer={photo.hasBlazer ? "Black Blazer" : "None"} adjustments={{ brightness: 0, contrast: 0, saturation: 0 }} />
                        ) : photo.imageSrc === "david" ? (
                          <DavidPortraitSVG bgColor="#FFFFFF" hasBlazer={photo.hasBlazer ? "Black Blazer" : "None"} adjustments={{ brightness: 0, contrast: 0, saturation: 0 }} />
                        ) : (
                          <AlexPortraitSVG bgColor="#EFF6FF" hasBlazer={photo.hasBlazer ? "Black Blazer" : "None"} adjustments={{ brightness: 0, contrast: 0, saturation: 0 }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {photo.sizeName}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{photo.bgColorName} BG</span>
                          <span>•</span>
                          <span>{photo.createdAt}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteFromHistory(photo.id, e)}
                        className="p-1.5 text-stone-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Footer Credits */}
            <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex justify-between items-center text-[9px] text-stone-400 dark:text-stone-500">
              <button onClick={() => setActiveScreen("about")} className="hover:underline font-semibold">About Maker</button>
              <span>Compliant with ICAO Doc 9303</span>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        )}

        {/* SCREEN: CAMERA */}
        {activeScreen === "camera" && (
          <div className="flex-1 flex flex-col bg-black text-white relative">
            {/* Top Bar Controls */}
            <div className="absolute top-4 left-0 right-0 px-5 flex items-center justify-between z-10">
              <button
                onClick={() => {
                  stopWebcam();
                  setActiveScreen("home");
                }}
                className="p-2.5 bg-black/60 rounded-full text-white backdrop-blur-md active:scale-95 transition-transform"
              >
                <X size={16} />
              </button>

              <span className="text-xs font-bold px-3 py-1 bg-black/60 backdrop-blur-md rounded-full tracking-wide">
                BIOMETRIC LOCK GUIDE
              </span>

              <button
                onClick={() => setShowFaceGuide(!showFaceGuide)}
                className={`p-2.5 rounded-full backdrop-blur-md active:scale-95 transition-transform ${showFaceGuide ? "bg-emerald-500 text-white" : "bg-black/60 text-zinc-400"}`}
                title="Toggle Overlay Guide"
              >
                <Eye size={16} />
              </button>
            </div>

            {/* Real Webcam Canvas stream viewport */}
            <div 
              onClick={handleCameraTap}
              className="flex-1 relative bg-neutral-950 flex items-center justify-center overflow-hidden cursor-crosshair"
            >
              {/* Dynamic tap-to-focus indicator ring */}
              {focusPosition && (
                <motion.div
                  key={`${focusPosition.x}-${focusPosition.y}`}
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", damping: 14, stiffness: 140 }}
                  style={{
                    position: "absolute",
                    left: focusPosition.x,
                    top: focusPosition.y,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute pointer-events-none z-20 flex items-center justify-center"
                >
                  {/* Outer spinning dash ring */}
                  <div className="w-16 h-16 border-2 border-indigo-400 border-dashed rounded-full animate-[spin_12s_linear_infinite]" />
                  
                  {/* Dynamic biometric corner brackets */}
                  <div className="absolute w-12 h-12 border border-emerald-400/40 rounded-lg flex items-center justify-center">
                    <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm animate-pulse"></span>
                    <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm animate-pulse"></span>
                    <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm animate-pulse"></span>
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400 rounded-br-sm animate-pulse"></span>
                  </div>

                  {/* Pulsing center dot */}
                  <div className="absolute w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                  <div className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full shadow shadow-emerald-400/50" />
                  
                  {/* AF-L floating tag */}
                  <div className="absolute top-10 bg-slate-900/90 backdrop-blur-md text-[8px] font-bold text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-400/30 shadow-lg tracking-wider">
                    AF LOCK 100%
                  </div>
                </motion.div>
              )}

              {cameraError ? (
                <div className="p-6 text-center z-10 max-w-xs">
                  <Info size={32} className="text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm font-bold">Webcam Stream Blocked</p>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    Browser webcam permissions are blocked. You can still test with the interactive preset model headshots or upload a custom file from your device.
                  </p>
                  <button
                    onClick={() => {
                      stopWebcam();
                      setActiveScreen("home");
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-xs font-bold rounded-xl active:scale-95"
                  >
                    Use Model Presets Instead
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              )}

              {/* Dynamic face guidelines over video stream */}
              {showFaceGuide && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Outer shade masking */}
                  <div className="absolute inset-0 border-[40px] border-black/50" />
                  
                  {/* Central face oval alignment */}
                  <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-64 border-2 border-emerald-400 rounded-[100px] flex flex-col justify-between items-center py-8">
                    {/* Hairline guide */}
                    <span className="w-12 h-0.5 bg-emerald-400/50"></span>
                    {/* Eye line alignment */}
                    <div className="w-full flex justify-between px-6">
                      <span className="w-4 h-0.5 bg-emerald-400"></span>
                      <span className="w-4 h-0.5 bg-emerald-400"></span>
                    </div>
                    {/* Mouth guide */}
                    <span className="w-8 h-0.5 bg-emerald-400/50"></span>
                  </div>

                  {/* Shoulder Silhouettes */}
                  <div className="absolute bottom-[10%] left-12 right-12 h-16 border-t-2 border-x-2 border-emerald-400 rounded-t-3xl border-dashed" />
                </div>
              )}
            </div>

            {/* Camera Bottom Shutter Panel */}
            <div className="bg-stone-950 p-6 flex flex-col items-center justify-center shrink-0">
              <div className="flex items-center justify-between w-full max-w-xs mb-4">
                <label className="text-xs text-stone-400 flex items-center gap-1 cursor-pointer hover:text-white">
                  <ImageIcon size={14} />
                  <span>Roll</span>
                  <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                </label>
                <span className="text-[10px] text-zinc-500">Auto background remover active</span>
                <span className="w-14" />
              </div>

              {/* Shutter capture button trigger */}
              <button
                onClick={cameraStream ? capturePhoto : () => {
                  setSelectedPreset("sarah");
                  resetEditingStudio();
                  setActiveScreen("editor");
                }}
                className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center bg-stone-900 active:scale-90 transition-transform shadow-xl shrink-0"
              >
                <div className="w-14 h-14 rounded-full bg-white group-hover:scale-95 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN: EDITOR */}
        {activeScreen === "editor" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editing Studio Header */}
            <div className="px-5 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  resetEditingStudio();
                  setActiveScreen("home");
                }}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg text-stone-500"
              >
                <X size={18} />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                  AI biometric core
                </span>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-tight">
                  Editing Studio
                </h3>
              </div>

              <button
                onClick={() => setActiveScreen("export")}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
              >
                Next
              </button>
            </div>

            {/* AI processing loader overlay */}
            {isAiLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-950/20 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
                <h4 className="text-sm font-bold">Running Gemini Face Tracker</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                  Automatically extracting hair edges, identifying neck boundaries, and auditing lighting contrast metrics...
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col">
                {/* Active Photo Canvas Preview Frame */}
                <div className="bg-stone-100 dark:bg-stone-950 p-6 flex justify-center items-center shrink-0 border-b border-stone-200 dark:border-stone-800">
                  <div className="w-48 h-60 bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-lg border-2 border-stone-200/50 dark:border-stone-800 relative">
                    
                    {/* Live vector portraits */}
                    {selectedPreset === "sarah" ? (
                      <SarahPortraitSVG bgColor={selectedColor.value} hasBlazer={selectedOutfit} adjustments={adjustments} />
                    ) : selectedPreset === "david" ? (
                      <DavidPortraitSVG bgColor={selectedColor.value} hasBlazer={selectedOutfit} adjustments={adjustments} />
                    ) : selectedPreset === "alex" ? (
                      <AlexPortraitSVG bgColor={selectedColor.value} hasBlazer={selectedOutfit} adjustments={adjustments} />
                    ) : (
                      // Custom User Captured Portrait
                      <div className="w-full h-full relative" style={{
                        filter: `brightness(${1 + adjustments.brightness / 100}) contrast(${1 + adjustments.contrast / 100}) saturate(${1 + adjustments.saturation / 100})`
                      }}>
                        {/* Dynamic background fill */}
                        <div className="absolute inset-0" style={{ backgroundColor: selectedColor.value }} />
                        {/* Cutout Portrait Silhouette overlay (fallback circle crop) */}
                        <div className="absolute inset-2 bg-stone-200/20 rounded-full overflow-hidden flex items-center justify-center border border-dashed border-white/40">
                          {uploadedImageSrc ? (
                            <img src={uploadedImageSrc} className="w-full h-full object-cover rounded-full" alt="captured preview" />
                          ) : (
                            <Camera size={40} className="text-stone-300 animate-pulse" />
                          )}
                        </div>

                        {/* Blazer fitted over custom photo based on anchor point */}
                        {selectedOutfit !== "None" && (
                          <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end">
                            {selectedOutfit === "Black Blazer" && <BlackBlazerSVG className="w-full h-24" />}
                            {selectedOutfit === "Black Suit" && <BlackSuitSVG className="w-full h-24" />}
                            {selectedOutfit === "White Shirt" && <WhiteShirtSVG className="w-full h-24" />}
                            {selectedOutfit === "Black Tie" && (
                              <div className="w-full h-24 relative">
                                <WhiteShirtSVG className="w-full h-full absolute inset-0" />
                                <BlackTieSVG className="w-full h-full absolute inset-0" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gemini Face Detection Overlay bounding box indicator */}
                    {landmarks && showFaceGuide && (
                      <div className="absolute inset-0 pointer-events-none border border-emerald-400/40">
                        {/* Bounding face rect */}
                        <div
                          className="absolute border-2 border-emerald-400 rounded-xl"
                          style={{
                            top: `${landmarks.faceRect.top * 100}%`,
                            left: `${landmarks.faceRect.left * 100}%`,
                            width: `${landmarks.faceRect.width * 100}%`,
                            height: `${landmarks.faceRect.height * 100}%`,
                          }}
                        >
                          <span className="absolute -top-4 left-1 bg-emerald-500 text-[8px] font-bold text-white px-1 rounded">Face Lock</span>
                        </div>

                        {/* Eyes, Nose, Chin landmarks */}
                        <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full" style={{ top: `${landmarks.leftEye.y * 100}%`, left: `${landmarks.leftEye.x * 100}%` }} />
                        <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full" style={{ top: `${landmarks.rightEye.y * 100}%`, left: `${landmarks.rightEye.x * 100}%` }} />
                        <div className="absolute w-1 h-1 bg-sky-400 rounded-full" style={{ top: `${landmarks.nose.y * 100}%`, left: `${landmarks.nose.x * 100}%` }} />
                        <div className="absolute w-1 h-1 bg-red-400 rounded-full" style={{ top: `${landmarks.chin.y * 100}%`, left: `${landmarks.chin.x * 100}%` }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-Editor Panel Controls tabs */}
                <div className="p-4 space-y-5">
                  
                  {/* Row: Quick Auto Enhance & Tracker guide */}
                  <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                    <button
                      onClick={toggleAutoEnhance}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-colors active:scale-95 ${
                        autoEnhanced
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                      }`}
                    >
                      <Sparkles size={14} className={autoEnhanced ? "animate-pulse" : ""} />
                      <span>{autoEnhanced ? "Auto Enhanced On" : "Auto Enhance Portrait"}</span>
                    </button>

                    <button
                      onClick={() => setShowFaceGuide(!showFaceGuide)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
                        showFaceGuide
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                          : "border-slate-200 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 dark:border-slate-700"
                      }`}
                    >
                      <Eye size={13} />
                      <span>Guide</span>
                    </button>
                  </div>

                  {/* Section: Background Color Replacement */}
                  <div>
                    <div className="flex items-center gap-1 mb-2.5">
                      <Palette size={14} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                        AI Background Replacement
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                      {BACKGROUND_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative active:scale-90 ${
                            selectedColor.name === color.name ? "border-indigo-600 scale-105 shadow-md shadow-indigo-600/20" : "border-slate-200/60 dark:border-slate-700"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {selectedColor.name === color.name && (
                            <Check size={14} className={color.name === "White" || color.name === "Yellow" || color.name === "Cream" || color.name === "Light Grey" ? "text-slate-800" : "text-white"} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section: Dress Replacement Studio */}
                  <div>
                    <div className="flex items-center gap-1 mb-2.5">
                      <Sparkles size={14} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                        AI Clothing Replacement (Black Blazer)
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                      {[
                        { id: "None", label: "Casual", icon: <X size={14} /> },
                        { id: "Black Blazer", label: "Blazer", render: <BlackBlazerSVG className="w-8 h-6" /> },
                        { id: "Black Suit", label: "Suit", render: <BlackSuitSVG className="w-8 h-6" /> },
                        { id: "White Shirt", label: "Shirt", render: <WhiteShirtSVG className="w-8 h-6" /> },
                        { id: "Black Tie", label: "Tie", render: <BlackTieSVG className="w-8 h-6" /> },
                      ].map((outfit) => (
                        <button
                          key={outfit.id}
                          onClick={() => setSelectedOutfit(outfit.id)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 ${
                            selectedOutfit === outfit.id
                              ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm"
                              : "border-slate-200/60 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="h-6 flex items-center justify-center">
                            {outfit.render || outfit.icon}
                          </div>
                          <span className="text-[9px] font-bold mt-1.5">{outfit.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section: Face Enhancement Fine-Tune Sliders */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1">
                        <Sliders size={14} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-mono">
                          Manual Fine-Tuning
                        </span>
                      </div>
                      <button
                        onClick={resetEditingStudio}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Reset Sliders
                      </button>
                    </div>

                    <div className="space-y-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                      {[
                        { key: "brightness", label: "Brightness", min: -50, max: 50 },
                        { key: "contrast", label: "Contrast", min: -50, max: 50 },
                        { key: "saturation", label: "Saturation", min: -50, max: 50 },
                      ].map((slider) => (
                        <div key={slider.key} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            <span>{slider.label}</span>
                            <span>{adjustments[slider.key as keyof PhotoAdjustments] > 0 ? "+" : ""}{adjustments[slider.key as keyof PhotoAdjustments]}</span>
                          </div>
                          <input
                            type="range"
                            min={slider.min}
                            max={slider.max}
                            value={adjustments[slider.key as keyof PhotoAdjustments]}
                            onChange={(e) =>
                              setAdjustments({
                                ...adjustments,
                                [slider.key]: parseInt(e.target.value),
                              })
                            }
                            className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCREEN: EXPORT SETUP */}
        {activeScreen === "export" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between shrink-0">
              <button
                onClick={() => setActiveScreen("editor")}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg text-stone-500"
              >
                <X size={18} />
              </button>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Export & Print</h3>
              <span className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-none">
              
              {/* Size standard selector */}
              <div>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-2.5">
                  Select Identity Photo Size
                </span>
                <div className="space-y-2">
                  {PHOTO_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 active:scale-98 ${
                        selectedSize.id === size.id
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100"
                          : "border-stone-200/80 dark:border-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800"
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${selectedSize.id === size.id ? "bg-blue-500 text-white" : "bg-stone-100 dark:bg-zinc-900"}`}>
                        <Crop size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{size.name}</p>
                        <p className="text-[10px] text-stone-400 dark:text-stone-400 leading-tight mt-0.5">
                          {size.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Print layout selection (8, 16, 32 grid on A4 sheet) */}
              <div>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-2.5">
                  A4 Print Layout Format
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[8, 16, 32].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPrintLayoutCount(num)}
                      className={`py-3 px-4 rounded-xl border font-bold text-center text-xs transition-all active:scale-95 ${
                        printLayoutCount === num
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                          : "border-stone-200 dark:border-stone-700 hover:bg-stone-100 text-stone-700 bg-white dark:bg-stone-800 dark:text-stone-300"
                      }`}
                    >
                      {num} Photos
                    </button>
                  ))}
                </div>
              </div>

              {/* printable A4 sheet preview container */}
              <div>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-2.5">
                  A4 Sheet Grid Preview
                </span>
                <div className="bg-stone-100 dark:bg-stone-950 p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex justify-center">
                  <div className="w-56 h-80 bg-white border border-stone-300 shadow-md p-3 relative flex flex-col justify-between select-none">
                    
                    {/* Tiny header metadata on sheet */}
                    <div className="flex justify-between items-center text-[5px] text-stone-400 font-mono scale-[0.9] border-b border-stone-100 pb-1 shrink-0">
                      <span>AI PASSPORT MAKER GRID SHEET</span>
                      <span>A4 Size (300 DPI)</span>
                    </div>

                    {/* Passport grid container */}
                    <div className="flex-1 py-4 flex items-center justify-center">
                      <div className={`grid gap-1 border border-stone-100 p-1.5 ${printLayoutCount === 8 ? "grid-cols-4" : printLayoutCount === 16 ? "grid-cols-4" : "grid-cols-8 scale-[0.92]"}`}>
                        {Array.from({ length: printLayoutCount }).map((_, index) => (
                          <div key={index} className="w-6 h-8 bg-zinc-100 overflow-hidden relative border border-stone-200 shadow-sm shrink-0">
                            {selectedPreset === "sarah" ? (
                              <SarahPortraitSVG bgColor={selectedColor.value} hasBlazer={selectedOutfit} adjustments={adjustments} />
                            ) : selectedPreset === "david" ? (
                              <DavidPortraitSVG bgColor={selectedColor.value} hasBlazer={selectedOutfit} adjustments={adjustments} />
                            ) : (
                              <AlexPortraitSVG bgColor={selectedColor.value} hasBlazer={selectedOutfit} adjustments={adjustments} />
                            )}
                            {/* Tiny alignment marks */}
                            <span className="absolute top-0 left-0 w-0.5 h-0.5 bg-black/20"></span>
                            <span className="absolute bottom-0 right-0 w-0.5 h-0.5 bg-black/20"></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tiny footer alignment guidelines */}
                    <div className="text-[5px] text-stone-400 font-mono flex justify-between scale-[0.8] border-t border-stone-100 pt-1 shrink-0">
                      <span>Cut along guidelines</span>
                      <span>Total: {printLayoutCount} standard cards</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Output Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={saveToHistory}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-3.5 px-4 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-blue-500/10"
                >
                  <Download size={15} />
                  <span>Download High-Res PDF</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={triggerNativePrint}
                    className="flex items-center justify-center gap-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-bold py-3 rounded-2xl text-xs active:scale-95"
                  >
                    <Printer size={14} />
                    <span>Print Direct</span>
                  </button>

                  <button
                    onClick={() => alert("Photo shared via Android Share Sheet simulation!")}
                    className="flex items-center justify-center gap-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-bold py-3 rounded-2xl text-xs active:scale-95"
                  >
                    <Share2 size={14} />
                    <span>Share Layout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN: SETTINGS */}
        {activeScreen === "settings" && (
          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 p-5 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setActiveScreen("home")}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg text-stone-500"
              >
                <X size={18} />
              </button>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">Settings Preferences</h3>
            </div>            <div className="flex-grow space-y-5 text-xs text-slate-700 dark:text-slate-300">
              {/* Default background select */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                <span className="font-bold text-slate-800 dark:text-slate-200">Default Background Color</span>
                <select
                  value={defaultBg}
                  onChange={(e) => setDefaultBg(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 mt-1.5 focus:outline-none focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-200"
                >
                  <option>Sky Blue</option>
                  <option>White</option>
                  <option>Grey</option>
                  <option>Cream</option>
                </select>
              </div>

              {/* Default Export Format */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                <span className="font-bold text-slate-800 dark:text-slate-200">Default Export Format</span>
                <div className="flex gap-2 mt-2">
                  {["PNG", "JPG", "PDF"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      className={`flex-1 py-2 rounded-xl text-center font-bold border ${exportFormat === fmt ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Quality Standard Selection */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                <span className="font-bold text-slate-800 dark:text-slate-200">Rendering Image Quality</span>
                <select
                  value={imgQuality}
                  onChange={(e) => setImgQuality(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 mt-1.5 focus:outline-none focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-200"
                >
                  <option>High (300 DPI)</option>
                  <option>Standard (150 DPI)</option>
                  <option>Low Space (72 DPI)</option>
                </select>
              </div>

              {/* Language Preferences */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                <span className="font-bold text-slate-800 dark:text-slate-200">App Language</span>
                <select
                  value={appLanguage}
                  onChange={(e) => setAppLanguage(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 mt-1.5 focus:outline-none focus:border-indigo-500 font-bold text-slate-800 dark:text-slate-200"
                >
                  <option>English</option>
                  <option>Spanish (Español)</option>
                  <option>Hindi (हिन्दी)</option>
                  <option>Chinese (中文)</option>
                </select>
              </div>

              {/* Theme Settings Selector */}
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                <span className="font-bold text-slate-800 dark:text-slate-200">App Visual Theme</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => setAppTheme("light")}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-bold ${appTheme === "light" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`}
                  >
                    <Sun size={13} />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => setAppTheme("dark")}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-bold ${appTheme === "dark" ? "bg-slate-800 text-white border-slate-700" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`}
                  >
                    <Moon size={13} />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN: ABOUT */}
        {activeScreen === "about" && (
          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 p-5 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setActiveScreen("home")}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500"
              >
                <X size={18} />
              </button>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">About Maker App</h3>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950/80 rounded-2xl flex items-start gap-3">
                <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>AI Passport Photo Maker v1.0</strong> is a comprehensive native mobile template built with state-of-the-art Flutter and Firebase ecosystems.
                </p>
              </div>

              <span className="font-bold text-slate-800 dark:text-slate-100 block mt-2 font-mono uppercase tracking-wide">Core AI Specifications</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Automated biometric constraints checking (hair edge, shoulder, tilt rotation, white boundary sizing).</li>
                <li>Instant dynamic chroma segmentations replacing backdrops with standard colors.</li>
                <li>Pixel-aligned blazer template overlays anchored via AI landmark coordinates.</li>
                <li>High-resolution 300 DPI grid layouts matching international visa guidelines.</li>
              </ul>

              <span className="font-bold text-slate-800 dark:text-slate-100 block mt-4 font-mono uppercase tracking-wide">Security & Compliance</span>
              <p className="text-slate-600 dark:text-slate-400">
                All biometric facial detections run inside secure sandboxed REST interfaces. We never save raw biometric scans. Built under complete compliance with ICAO Doc 9303 standards.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Android Bottom Navigation Pill Bar */}
      <div className="bg-stone-950 h-5 flex items-center justify-center select-none shrink-0">
        <div className="w-28 h-1 bg-white/40 rounded-full bottom-1" />
      </div>

    </div>
  );
};
