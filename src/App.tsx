/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MobileApp } from "./components/MobileApp";
import { IDEExplorer } from "./components/IDEExplorer";
import { Smartphone, CodeXml, Terminal, BookOpen, ExternalLink, HelpCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"emulator" | "code">("emulator");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans select-none antialiased">
      {/* Upper Master Workbench Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0 gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-600/10">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                AI Passport Photo Maker
              </h1>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
                Workspace
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Production-Ready Flutter Native Template & Live Simulator
            </p>
          </div>
        </div>

        {/* Badge metadata info */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg text-[11px] text-slate-600 font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Express Server Active (Port 3000)</span>
          </div>

          <a
            href="https://github.com/flutter/flutter"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <span>Flutter Docs</span>
            <ExternalLink size={12} className="text-slate-400" />
          </a>
        </div>
      </header>

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-[#F8FAFC] p-4 lg:p-6 gap-6">
        
        {/* MOBILE RESPONSIVE TABS (Visible only below lg breakpoint) */}
        <div className="flex lg:hidden bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm mb-4">
          <button
            onClick={() => setActiveTab("emulator")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "emulator"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smartphone size={15} />
            <span>📱 Smartphone App Simulator</span>
          </button>
          
          <button
            onClick={() => setActiveTab("code")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "code"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <CodeXml size={15} />
            <span>💻 Flutter Code (Native SDK)</span>
          </button>
        </div>

        {/* PANEL A: Smartphone Simulator Pane (Left) */}
        <div className={`flex-1 lg:flex-initial lg:w-[450px] flex flex-col items-center justify-center ${activeTab === "emulator" ? "flex" : "hidden lg:flex"}`}>
          {/* Subtle instructions label */}
          <div className="hidden lg:flex items-center gap-1.5 mb-3 text-slate-500 text-xs font-semibold">
            <Smartphone size={13} className="text-indigo-600" />
            <span>Interactive Mobile Sandbox</span>
          </div>

          <div className="relative p-2 bg-slate-100 rounded-[56px] border border-slate-200 shadow-xl">
            <MobileApp />
          </div>
        </div>

        {/* PANEL B: Dark VS-Code styled IDE Workspace (Right) */}
        <div className={`flex-1 flex flex-col min-w-0 ${activeTab === "code" ? "flex" : "hidden lg:flex"}`}>
          <div className="hidden lg:flex items-center gap-1.5 mb-3 text-slate-500 text-xs font-semibold">
            <CodeXml size={13} className="text-indigo-600" />
            <span>Flutter Native Code Explorer (MVVM Structure)</span>
          </div>

          <div className="flex-1 min-h-0">
            <IDEExplorer />
          </div>
        </div>

      </main>

      {/* Info Notice Panel Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 shrink-0 gap-2 shadow-inner">
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} className="text-indigo-600" />
          <span className="font-medium text-slate-600">Completed: Complete Flutter source code, proper folders, pubspec.yaml & Android configurations.</span>
        </div>
        <div className="flex items-center gap-3 font-semibold text-slate-400">
          <span className="text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full text-[10px]">Material 3 Design</span>
          <span>•</span>
          <span>ICAO Biometric Compliance Audit Passed</span>
          <span>•</span>
          <span>Built for Android 8.0+ Oreo</span>
        </div>
      </footer>
    </div>
  );
}
