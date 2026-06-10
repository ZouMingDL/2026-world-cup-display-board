import React from 'react';
import { Smartphone, Signal, Wifi, Battery, MoreHorizontal } from 'lucide-react';

interface WeChatFrameProps {
  children: React.ReactNode;
  navTitle: string;
  onBack?: () => void;
  showBack?: boolean;
}

export default function WeChatFrame({ children, navTitle, onBack, showBack = false }: WeChatFrameProps) {
  // Current 2026 time from metadata: 2026-06-10T02:28:24Z (Format nicely)
  const simulatedTime = "10:28"; 

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-3 sm:p-6 md:p-8 selection:bg-amber-100 antialiased font-sans">
      
      {/* Decorative soccer/sports structural design background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-[10%] -left-[15%] w-[400px] h-[400px] rounded-full border-[1.5px] border-emerald-500/20" />
        <div className="absolute bottom-[5%] -right-[10%] w-[500px] h-[500px] rounded-full border-[1.5px] border-emerald-300/20" />
        <div className="absolute top-[40%] left-[60%] w-[350px].h-[350px] rotate-45 border border-emerald-400/10" />
      </div>

      {/* Main smartphone body simulating a running high-end device */}
      <div className="relative w-full max-w-[425px] h-[866px] bg-[#f8fafc] rounded-[52px] shadow-[0_24px_60px_rgba(0,0,0,0.85)] border-[11px] border-slate-950 flex flex-col overflow-hidden transition-all duration-300 ring-4 ring-slate-800/80">
        
        {/* Notch / Speaker mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-950 rounded-b-2xl z-50 flex items-start justify-center">
          <div className="w-16 h-[4px] bg-slate-800 rounded-full mt-1.5" />
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-3 mt-1" />
        </div>

        {/* WeChat / iOS Status Bar */}
        <div className="w-full h-11 bg-[#101c13] text-white flex items-center justify-between px-7 shrink-0 select-none z-40 text-xs">
          <span className="font-semibold text-slate-250 font-mono tracking-tight">{simulatedTime}</span>
          <div className="flex items-center space-x-1.5 text-slate-200">
            <span className="text-[9px] font-bold py-0.5 px-1 bg-emerald-600/50 rounded-sm text-emerald-200 uppercase scale-90 tracking-widest font-mono">2026 WC</span>
            <div className="flex space-x-0.5 items-end h-2.5">
              <span className="w-[3px] h-1.5 bg-slate-200 rounded-sm" />
              <span className="w-[3px] h-2 bg-slate-200 rounded-sm" />
              <span className="w-[3px] h-2.5 bg-slate-200 rounded-sm" />
              <span className="w-[3px] h-3 bg-slate-200 rounded-sm" />
            </div>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 ml-0.5 opacity-90" />
          </div>
        </div>

        {/* WeChat Mini Program Navbar Action Bar */}
        <div className="w-full h-12 bg-[#142318] text-white flex items-center justify-between px-4 shrink-0 border-b border-[#1b3021] select-none z-40">
          <div className="flex items-center min-w-[70px]">
            {showBack ? (
              <button
                id="wechat_back_btn"
                onClick={onBack}
                className="flex items-center space-x-1 hover:text-amber-400 p-1 rounded-lg transition-colors"
                aria-label="返回"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-[13px] font-medium leading-none">返回</span>
              </button>
            ) : (
              <div className="w-3" />
            )}
          </div>

          {/* Mini program title with subtle logo or badge */}
          <div className="flex flex-col items-center">
            <span className="text-[14px] font-bold tracking-wide text-slate-100 max-w-[180px] truncate">
              {navTitle}
            </span>
            <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">
              微信小程序 · 2026
            </span>
          </div>

          {/* Mock WeChat Capsule Button (胶囊按钮 - standard WeChat UI element) */}
          <div className="flex items-center justify-between bg-black/30 border border-slate-700/60 rounded-full h-7.5 px-2.5 py-1 w-[82px] shrink-0 text-slate-100">
            {/* Clickable Triple Dots Menu */}
            <span className="cursor-pointer hover:text-slate-300">
              <MoreHorizontal className="w-4 h-4" />
            </span>
            {/* Split line */}
            <span className="h-3 w-[1px] bg-slate-700 mx-1.5" />
            {/* Clickable Circle Inner Dot Exit Button */}
            <span className="cursor-pointer hover:text-amber-500 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full border-1.5 border-current flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-current rounded-full" />
              </div>
            </span>
          </div>
        </div>

        {/* Main Content View with Custom Standard Scrollbar */}
        <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col relative" id="wechat_scrollable_container">
          {children}
        </div>

        {/* WeChat / iOS Home Navigation Indicator Indicator (iOS line bar) */}
        <div className="w-full h-5 bg-[#fafafa] flex items-center justify-center shrink-0 z-40 select-none pb-1 pointer-events-none">
          <div className="w-32 h-1 bg-slate-350 rounded-full" />
        </div>

      </div>
    </div>
  );
}
