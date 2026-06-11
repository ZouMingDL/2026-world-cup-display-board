import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  ChevronRight, 
  Sparkles, 
  DollarSign, 
  Flame, 
  Shield, 
  Activity, 
  Award, 
  MapPin, 
  Plus, 
  Trash2, 
  TrendingDown, 
  ArrowLeft,
  Share2,
  PieChart,
  Calendar,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { worldCupData, Player, Team, QualifierNode } from './data/worldCupData';
import { fetchAllMatches, WorldCupMatch } from './scripts/fetchWorldCupData';
import RadarChart from './components/RadarChart';
import WeChatFrame from './components/WeChatFrame';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'teams' | 'rankings' | 'compare' | 'schedule'>('teams');
  
  // Drilldown States
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  
  // Navigation Breadcrumb context (to know where to return when backing out of a Player view)
  const [playerSourceView, setPlayerSourceView] = useState<'team' | 'rankings' | 'compare'>('team');

  // Sub-tab selection inside the Team Detail screen
  const [teamSubTab, setTeamSubTab] = useState<'history' | 'formation' | 'road'>('formation');

  // Global Player List sorting selection
  const [globalSortBy, setGlobalSortBy] = useState<'market_value' | 'commercial_value'>('market_value');

  // Comparison State (Pre-populate with Messi and Mbappe for instant elite display)
  const [comparePlayerIds, setComparePlayerIds] = useState<string[]>(['p_messi', 'p_mbappe']);
  const [isAddingToCompare, setIsAddingToCompare] = useState(false);

  // Schedule States
  const [scheduleMatches, setScheduleMatches] = useState<WorldCupMatch[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'upcoming' | 'finished'>('all');

  // Helper getters
  const selectedTeam = useMemo(() => {
    return worldCupData.teams.find(t => t.id === selectedTeamId) || null;
  }, [selectedTeamId]);

  const selectedPlayer = useMemo(() => {
    return worldCupData.players.find(p => p.id === selectedPlayerId) || null;
  }, [selectedPlayerId]);

  // Sorings and listings
  const sortedTeams = useMemo(() => {
    return [...worldCupData.teams].sort((a, b) => a.strengthRank - b.strengthRank);
  }, []);

  // Team-specific players: sorted with isStar first, then by marketValue descending
  const sortedTeamPlayers = useMemo(() => {
    if (!selectedTeamId) return [];
    const teamPlayers = worldCupData.players.filter(p => p.teamId === selectedTeamId);
    return [...teamPlayers].sort((a, b) => {
      // 1. Star status priority
      if (a.isStar && !b.isStar) return -1;
      if (!a.isStar && b.isStar) return 1;
      // 2. Market value descending
      return b.marketValue - a.marketValue;
    });
  }, [selectedTeamId]);

  // Global players: sorted by marketValue or commercialValue descending
  const sortedGlobalPlayers = useMemo(() => {
    return [...worldCupData.players].sort((a, b) => {
      if (globalSortBy === 'market_value') {
        return b.marketValue - a.marketValue;
      } else {
        return b.commercialValue - a.commercialValue;
      }
    });
  }, [globalSortBy]);

  // Get active players in comparison list
  const comparedPlayers = useMemo(() => {
    return comparePlayerIds
      .map(id => worldCupData.players.find(p => p.id === id))
      .filter((p): p is Player => !!p);
  }, [comparePlayerIds]);

  // Schedule data fetching
  useEffect(() => {
    if (activeTab === 'schedule' && scheduleMatches.length === 0) {
      setScheduleLoading(true);
      setScheduleError(null);
      fetchAllMatches()
        .then(matches => {
          setScheduleMatches(matches);
          setScheduleLoading(false);
        })
        .catch(() => {
          setScheduleError('赛程数据加载失败，请稍后重试');
          setScheduleLoading(false);
        });
    }
  }, [activeTab, scheduleMatches.length]);

  // Format monetary value nicely (万欧元 to Simplified Chinese display e.g. "x.x亿" or "xxxx万")
  const formatCurrency = (val: number) => {
    if (val >= 10000) {
      return `€${(val / 10000).toFixed(2)}亿`;
    }
    return `€${val}万`;
  };

  // Format schedule date to Chinese display
  const formatScheduleDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${d.getMonth() + 1}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
  };

  // Convert UTC time string to China time (UTC+8)
  const formatToChinaTime = (timeStr: string | null): string => {
    if (!timeStr) return '--:--';
    const [h, m] = timeStr.split(':').map(Number);
    const chinaHour = (h + 8) % 24;
    return `${String(chinaHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Get China date key for grouping (UTC date + time, converted to China timezone)
  const getChinaDateKey = (dateStr: string, timeStr: string | null): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const h = timeStr ? parseInt(timeStr.split(':')[0], 10) : 0;
    const chinaHour = h + 8;
    let chinaDay = day;
    let chinaMonth = month;
    let chinaYear = year;
    if (chinaHour >= 24) {
      chinaDay += 1;
      const daysInMonth = new Date(chinaYear, chinaMonth, 0).getDate();
      if (chinaDay > daysInMonth) {
        chinaDay = 1;
        chinaMonth += 1;
        if (chinaMonth > 12) {
          chinaMonth = 1;
          chinaYear += 1;
        }
      }
    }
    return `${chinaYear}-${String(chinaMonth).padStart(2, '0')}-${String(chinaDay).padStart(2, '0')}`;
  };

  // Group schedule by date (using China timezone)
  const groupedSchedule = useMemo(() => {
    const filtered = scheduleMatches.filter(m => {
      if (scheduleFilter === 'upcoming') return m.status === 'NS';
      if (scheduleFilter === 'finished') return m.status === 'FT';
      return true;
    });
    const groups: Record<string, WorldCupMatch[]> = {};
    for (const match of filtered) {
      const dateKey = getChinaDateKey(match.date, match.time);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(match);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [scheduleMatches, scheduleFilter]);

  // Safe navigation handlers
  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setTeamSubTab('formation'); // Default subtab for team inspection
    setSelectedPlayerId(null);
  };

  const handleSelectPlayer = (playerId: string, source: 'team' | 'rankings' | 'compare') => {
    setPlayerSourceView(source);
    setSelectedPlayerId(playerId);
  };

  const handleBack = () => {
    if (selectedPlayerId) {
      setSelectedPlayerId(null);
      // Return to whichever tab/view we came from
    } else if (selectedTeamId) {
      setSelectedTeamId(null);
    }
  };

  // Add/Remove comparison slots
  const handleRemoveComparePlayer = (id: string) => {
    setComparePlayerIds(prev => prev.filter(pId => pId !== id));
  };

  const handleAddComparePlayer = (id: string) => {
    if (comparePlayerIds.includes(id)) return;
    if (comparePlayerIds.length >= 3) {
      alert("能力看板最大支持对比3名球员，请先移除一名成员再添加。");
      return;
    }
    setComparePlayerIds(prev => [...prev, id]);
    setIsAddingToCompare(false);
  };

  // Dynamically determine navigation bar title to show in WeChat frame
  const navTitle = useMemo(() => {
    if (selectedPlayerId && selectedPlayer) {
      return `${selectedPlayer.name}的各项数据展示`;
    }
    if (selectedTeamId && selectedTeam) {
      return `${selectedTeam.name}队况和出线历程`;
    }
    if (activeTab === 'teams') {
      return '世界杯国家队盘点';
    }
    if (activeTab === 'rankings') {
      return '世界杯全局球员大排名';
    }
    if (activeTab === 'compare') {
      return '多员核心指标对拆对比';
    }
    if (activeTab === 'schedule') {
      return '2026世界杯赛程';
    }
    return '2026年世界杯球队与球员数据看板';
  }, [activeTab, selectedTeamId, selectedTeam, selectedPlayerId, selectedPlayer]);

  return (
    <WeChatFrame 
      navTitle={navTitle}
      onBack={handleBack}
      showBack={!!selectedTeamId || !!selectedPlayerId}
    >
      {/* -------------------- VIEW 1: PLAYER DETAIL SHEET -------------------- */}
      {selectedPlayerId && selectedPlayer && (
        <div className="flex-1 flex flex-col bg-slate-900 text-slate-100" id="player_detail_sheet">
          {/* Top Hero Card Profile */}
          <div className="relative bg-gradient-to-b from-[#162e24] via-[#0d1f18] to-slate-900 pt-7 px-4 pb-4 border-b border-emerald-950/40">
            {/* National Crest Watermark */}
            <div className="absolute right-3 top-4 text-emerald-900/10 text-8xl font-black select-none uppercase font-sans">
              {selectedPlayer.teamId}
            </div>

            <div className="flex items-start space-x-4 relative z-10">
              {/* Profile Avatar Frame with Golden Rim if Star */}
              <div className="relative">
                <img
                  src={selectedPlayer.avatarUrl}
                  alt={selectedPlayer.name}
                  referrerPolicy="no-referrer"
                  className={`w-20 h-20 rounded-2xl object-cover shadow-lg border-2 ${
                    selectedPlayer.isStar ? 'border-amber-400 ring-4 ring-amber-500/10' : 'border-slate-700'
                  }`}
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white font-mono font-bold text-xs px-2 py-0.5 rounded-full shadow-md border border-slate-900">
                  #{selectedPlayer.shirtNumber}
                </span>
              </div>

              {/* Player Bio text info header */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-50 tracking-tight truncate">{selectedPlayer.name}</h3>
                  {selectedPlayer.isStar && (
                    <span className="inline-flex items-center space-x-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-sm scale-95 shrink-0">
                      <Flame className="w-2.5 h-2.5 fill-current" />
                      <span>明星特权</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono tracking-wider">{selectedPlayer.englishName}</p>

                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-md font-bold tracking-wide">
                    {selectedPlayer.positionName}
                  </span>
                  <span className="text-[11px] text-slate-350">{selectedPlayer.club}</span>
                </div>

                <div className="flex items-center space-x-3 mt-2.5 pt-2 border-t border-slate-800/60 text-slate-300">
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-400 block font-light">年龄</span>
                    <span className="font-semibold font-mono text-slate-100">{selectedPlayer.age}</span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-800" />
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-400 block font-light">所属国家队</span>
                    <span className="font-semibold text-emerald-400">{selectedPlayer.teamName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial & Metric Values Indicators Column */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-center">
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5">市场身价评估</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {formatCurrency(selectedPlayer.marketValue)}
                </span>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-0.5">商业价值指数</span>
                <span className="text-sm font-bold text-indigo-400 font-mono">
                  {selectedPlayer.commercialValue} <span className="text-[9px] font-light text-slate-400">/ 100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Ability Radar Plot Panel */}
          <div className="bg-[#111c16] mx-4 my-3 p-4 rounded-3xl border border-emerald-950/50 shadow-inner flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest self-start pl-1 mb-2 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
              <span>核心能力六维看板</span>
            </h4>
            <div className="w-full h-64 flex items-center justify-center relative">
              <RadarChart players={[selectedPlayer]} />
            </div>
          </div>

          {/* Core Technical Stats Summary */}
          <div className="flex-1 bg-slate-900 px-4 pb-6">
            <div className="bg-slate-955 border border-slate-800/60 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-350 tracking-wider uppercase mb-3 flex items-center space-x-1.5 border-b border-slate-800/60 pb-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>2026年世界杯周期技术统计 (场均表现)</span>
              </h4>

              <div id="tech_stats_grid" className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">出场次数</span>
                  <span className="text-lg font-bold font-mono text-slate-100">{selectedPlayer.matchStats.appearances}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">综合评分 (OVR)</span>
                  <span className="text-lg font-bold font-mono text-amber-400">{selectedPlayer.matchStats.rating.toFixed(2)}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">进球总数 (GOA)</span>
                  <span className="text-lg font-bold font-mono text-rose-500">{selectedPlayer.matchStats.goals}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">助攻总数 (AST)</span>
                  <span className="text-lg font-bold font-mono text-indigo-400">{selectedPlayer.matchStats.assists}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">场均关键传球 (KEY)</span>
                  <span className="text-lg font-bold font-mono text-teal-400">{selectedPlayer.matchStats.keyPasses}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">场均防拦截 (INT)</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{selectedPlayer.matchStats.interceptions}</span>
                </div>
                {selectedPlayer.position === 'GK' ? (
                  <div className="bg-slate-900/60 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block mb-0.5">零封场次 (CS)</span>
                    <span className="text-lg font-bold font-mono text-yellow-400">
                      {selectedPlayer.matchStats.cleanSheets ?? Math.round(selectedPlayer.matchStats.appearances * 0.45)} 场
                    </span>
                  </div>
                ) : (
                  <div className="bg-slate-900/60 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block mb-0.5">场均抢断数 (TKL)</span>
                    <span className="text-lg font-bold font-mono text-emerald-300">
                      {(selectedPlayer.matchStats.tackles ?? (selectedPlayer.ability.defending * 0.05 + 0.5)).toFixed(1)} 次
                    </span>
                  </div>
                )}
                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block mb-0.5">传球成功率 (PAS%)</span>
                  <span className="text-lg font-bold font-mono text-blue-400">
                    {selectedPlayer.matchStats.passSuccess ?? (80 + Math.round(selectedPlayer.ability.passing * 0.16))}%
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl col-span-2">
                  <span className="text-[10px] text-slate-400 block mb-0.5">场均跑动距离 (DST)</span>
                  <span className="text-lg font-bold font-mono text-violet-400">
                    {(selectedPlayer.matchStats.distance ?? (8.5 + (selectedPlayer.ability.physical + selectedPlayer.ability.pace) / 85)).toFixed(2)} km
                  </span>
                </div>
              </div>
            </div>

            {/* Recent 5 matches rating trends */}
            <div className="mt-4 bg-slate-955 border border-slate-800/60 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-350 tracking-wider uppercase mb-3 flex items-center space-x-1.5 border-b border-slate-800/60 pb-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>近期5场关键世界杯赛事表现评分走势图</span>
              </h4>

              <div className="pt-2">
                <div className="flex justify-between text-[9px] text-slate-400 mb-2.5 px-1 font-mono">
                  <span>第1场</span>
                  <span>第2场</span>
                  <span>第3场</span>
                  <span>第4场</span>
                  <span>第5场 (最新)</span>
                </div>

                {/* Sparkline svg container */}
                <div className="relative h-24 bg-slate-950/40 rounded-xl p-2.5 border border-slate-800/20 flex items-center justify-center">
                  {(() => {
                    const ratings = selectedPlayer.matchStats.recentRatings ?? [
                      Number((selectedPlayer.matchStats.rating - 0.4).toFixed(2)),
                      Number((selectedPlayer.matchStats.rating + 0.3).toFixed(2)),
                      Number((selectedPlayer.matchStats.rating - 0.2).toFixed(2)),
                      Number((selectedPlayer.matchStats.rating + 0.5).toFixed(2)),
                      Number((selectedPlayer.matchStats.rating).toFixed(2))
                    ];
                    
                    // Find min and max for scaling
                    const minRating = 5.0; // Fixed floor for display stability
                    const maxRating = 10.0;
                    
                    const width = 300;
                    const height = 60;
                    const paddingLeft = 15;
                    const paddingRight = 15;
                    const paddingTop = 15;
                    const paddingBottom = 10;
                    
                    const points = ratings.map((val, i) => {
                      const x = paddingLeft + (i * (width - paddingLeft - paddingRight) / 4);
                      const y = height - paddingBottom - ((val - minRating) / (maxRating - minRating)) * (height - paddingTop - paddingBottom);
                      return { x, y, val };
                    });
                    
                    const pathData = points.reduce((acc, p, i) => 
                      i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, ''
                    );

                    return (
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"/>
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2"/>
                        
                        {/* Area under curve */}
                        <path
                          d={`${pathData} L ${points[points.length-1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`}
                          fill="url(#ratingGrad)"
                        />
                        
                        {/* Line */}
                        <path
                          d={pathData}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* Intersecting dots and labels */}
                        {points.map((p, i) => (
                          <g key={i} className="group cursor-pointer">
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="3.5"
                              fill="#f59e0b"
                              stroke="#0f172a"
                              strokeWidth="1.5"
                            />
                            {/* Score badge label */}
                            <text
                              x={p.x}
                              y={p.y - 7}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="8"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {p.val}
                            </text>
                          </g>
                        ))}
                      </svg>
                    );
                  })()}
                </div>
                
                <div className="flex justify-between items-center mt-2.5 px-0.5">
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    <span className="text-[10px] text-slate-400">基准线点常设评测：及格线7.50分</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">走势优异</span>
                </div>
              </div>
            </div>

            {/* Quick action: Add this player directly to Comparison dashboard */}
            <div className="mt-4">
              <button
                id="add_to_comp_from_sheet"
                onClick={() => {
                  if (comparePlayerIds.includes(selectedPlayer.id)) {
                    // Already in. Let's redirect to check.
                    setActiveTab('compare');
                    setSelectedPlayerId(null);
                  } else {
                    if (comparePlayerIds.length >= 3) {
                      alert("对比上限为3名球员。请先在[对比]页面移除部分球员后再试。");
                      return;
                    }
                    handleAddComparePlayer(selectedPlayer.id);
                    setActiveTab('compare');
                    setSelectedPlayerId(null);
                  }
                }}
                className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center space-x-1.5 ${
                  comparePlayerIds.includes(selectedPlayer.id)
                    ? 'bg-indigo-650 hover:bg-slate-800 text-slate-100 border border-indigo-500/20'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 hover:brightness-110'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>
                  {comparePlayerIds.includes(selectedPlayer.id) ? '已在对比序列 · 点击进入比对面板' : '将该球员加入多员对比看板'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- VIEW 2: SINGLE TEAM DETAILS SHEET -------------------- */}
      {selectedTeamId && selectedTeam && !selectedPlayerId && (
        <div className="flex-1 flex flex-col" id="team_detail_sheet">
          {/* Header Team Profile with visual gradient */}
          <div className="bg-gradient-to-b from-[#14261c] to-[#0a140f] text-slate-100 p-4 shrink-0 shadow-md">
            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 bg-gradient-to-tr from-emerald-950 to-slate-900 rounded-full flex items-center justify-center shrink-0 shadow-inner ring-2 ring-emerald-500/30 overflow-hidden">
                <img 
                  src={selectedTeam.logoUrl} 
                  alt={selectedTeam.name} 
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 object-cover rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-white shrink-0 tracking-tight">{selectedTeam.name}国家队</h3>
                  <span className="text-[10px] bg-emerald-600/50 text-emerald-250 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider scale-95">
                    {selectedTeam.region}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">最佳成绩: {selectedTeam.bestRecord}</p>
              </div>
              
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-widest">实力排名</span>
                <span className="text-2xl font-black text-amber-500 font-mono tracking-tighter">
                  NO.{selectedTeam.strengthRank}
                </span>
              </div>
            </div>

            {/* Team Sub tabs */}
            <div className="flex bg-[#1d3326] rounded-xl p-1 mt-4 border border-[#264432]">
              <button
                id="subtab_formation"
                onClick={() => setTeamSubTab('formation')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                  teamSubTab === 'formation'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-250'
                }`}
              >
                主力战术阵型
              </button>
              <button
                id="subtab_history"
                onClick={() => setTeamSubTab('history')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                  teamSubTab === 'history'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-250'
                }`}
              >
                世界杯历史战绩
              </button>
              <button
                id="subtab_road"
                onClick={() => setTeamSubTab('road')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                  teamSubTab === 'road'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-250'
                }`}
              >
                晋级出线之路
              </button>
            </div>
          </div>

          {/* Sub Tab View Container */}
          <div className="p-4 bg-slate-50 flex-1">
            {/* subtab A: FORMATION FIELD GRAPH */}
            {teamSubTab === 'formation' && (
              <div id="formation_view" className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>首发战术排布 ({selectedTeam.formation.name})</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 bg-slate-350 px-2 py-0.5 rounded font-mono">
                    首发 11 人阵容
                  </span>
                </div>

                {/* Simulated Green Pitch Field */}
                <div className="relative w-full aspect-[5/6] bg-[#224d2d] rounded-2xl shadow-lg border-4 border-slate-900 overflow-hidden select-none">
                  {/* Outer Pitch Markings */}
                  <div className="absolute inset-2 border-1.5 border-dashed border-white/20 rounded-lg pointer-events-none" />
                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-1.5 border-white/20 pointer-events-none" />
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 pointer-events-none" />
                  {/* Goal Area Top */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 border-b border-x border-white/20 pointer-events-none" />
                  {/* Goal Area Bottom */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-10 border-t border-x border-white/20 pointer-events-none" />

                  {/* Pitch grass pattern stripes */}
                  <div className="absolute inset-0 flex flex-col pointer-events-none">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`flex-1 w-full ${idx % 2 === 0 ? 'bg-black/5' : 'bg-transparent'}`} 
                      />
                    ))}
                  </div>

                  {/* Render player node pins on coordinate grid */}
                  {selectedTeam.formation.positions.map((fPlayer, idx) => {
                    // Match with actual loaded player data if available, to pull their ID for direct routing
                    const matchedDbPlayer = worldCupData.players.find(
                      p => p.name === fPlayer.playerName && p.teamId === selectedTeam.id
                    );

                    return (
                      <button
                        key={idx}
                        id={`formation-pin-${fPlayer.positionId}`}
                        onClick={() => {
                          if (matchedDbPlayer) {
                            handleSelectPlayer(matchedDbPlayer.id, 'team');
                          } else {
                            alert(`${fPlayer.playerName} 详细数据正在录入中`);
                          }
                        }}
                        style={{
                          left: `${fPlayer.coord.x}%`,
                          top: `${fPlayer.coord.y}%`,
                        }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-all z-10"
                      >
                        {/* Jersey Pin Dot */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 shadow-md transition-all ${
                          matchedDbPlayer?.isStar 
                            ? 'bg-amber-400 text-slate-900 border-amber-250 ring-2 ring-amber-400/30' 
                            : 'bg-emerald-500 text-white border-emerald-100'
                        } group-hover:scale-110 group-hover:shadow-emerald-500/50`}>
                          {fPlayer.role.substring(0, 1)}
                        </div>
                        {/* Position Role Label tag */}
                        <div className="bg-slate-900/90 text-[8px] text-emerald-300 font-bold px-1.5 py-[0.5px] rounded-full mt-0.5 shadow scale-90 whitespace-nowrap">
                          {fPlayer.role}
                        </div>
                        {/* Player name label box */}
                        <div className="bg-white text-slate-800 text-[9px] font-black px-1.5 py-0.5 rounded shadow mt-0.5 border border-slate-200/60 whitespace-nowrap group-hover:bg-amber-50 group-hover:text-emerald-800">
                          {fPlayer.playerName.split('·')[1] || fPlayer.playerName}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-yellow-50 text-yellow-800 text-[10px] p-2.5 rounded-xl border border-yellow-100 flex items-start space-x-1.5 leading-relaxed">
                  <span className="font-bold">💡 交互指引:</span>
                  <span>点击上述球场上的核心首发成员姓名，可直接跳转查看该成员的高精六维雷达指标及详细统计大表。</span>
                </div>
              </div>
            )}

            {/* subtab B: DETAILED HISTORIC RECORD */}
            {teamSubTab === 'history' && (
              <div id="history_view" className="flex flex-col space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>世界杯总战绩明细</span>
                </h4>

                {/* Visual scorecard grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <span className="text-[10px] text-slate-400 block mb-0.5">参赛总届数</span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {selectedTeam.historyStats.appearances} <span className="text-xs font-normal text-slate-500">次</span>
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <span className="text-[10px] text-slate-400 block mb-0.5">历史胜率</span>
                    <span className="text-xl font-bold font-mono text-emerald-600">
                      {((selectedTeam.historyStats.wins / selectedTeam.historyStats.matchesPlayed) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <span className="text-[10px] text-slate-400 block mb-0.5">总场次</span>
                    <span className="text-lg font-bold font-mono text-slate-700">
                      {selectedTeam.historyStats.matchesPlayed} 场
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex justify-between text-[9px] text-slate-400 border-b pb-1 mb-1">
                      <span>胜</span>
                      <span>平</span>
                      <span>负</span>
                    </div>
                    <div className="flex justify-between font-mono font-bold text-slate-800">
                      <span className="text-rose-500">{selectedTeam.historyStats.wins}</span>
                      <span className="text-slate-400">{selectedTeam.historyStats.draws}</span>
                      <span className="text-slate-600">{selectedTeam.historyStats.losses}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#101c13] text-slate-100 p-4 rounded-2xl border border-[#23452f] shadow">
                  <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold font-mono block">荣膺殿堂纪录</span>
                  <p className="text-sm font-bold mt-1 text-slate-200">{selectedTeam.bestRecord}</p>
                </div>
              </div>
            )}

            {/* subtab C: QUALIFIER PATH */}
            {teamSubTab === 'road' && (
              <div id="road_view" className="flex flex-col space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2026年世界杯世预赛出线节点时间线</span>
                </h4>

                {/* Vertical Timeline */}
                <div className="relative pl-4 space-y-5 border-l-2 border-slate-200 ml-1.5 pt-2">
                  {selectedTeam.qualifierRoad.map((node, nIdx) => (
                    <div key={nIdx} className="relative">
                      {/* Circle Dot */}
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20" />
                      
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-150 relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">{node.stage}</span>
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            {node.opponent} <span className="font-mono font-black ml-1">{node.score}</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-normal font-sans pt-0.5">{node.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* National Team Individual squad Roster - SCANDAL / STAR FIRST VALUE DESC */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3.5 border-b pb-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>国家出战大名单 ({sortedTeamPlayers.length}位)</span>
                </h4>
                <span className="text-[9px] text-slate-400 font-light italic">明星置顶 / 身价降序排序</span>
              </div>

              {/* Grid Player list */}
              <div className="space-y-2.5">
                {sortedTeamPlayers.map((player) => (
                  <div
                    key={player.id}
                    id={`squad-player-row-${player.id}`}
                    onClick={() => handleSelectPlayer(player.id, 'team')}
                    className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 hover:border-amber-400/80 hover:shadow-xs cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      {/* Avatar container inside roster */}
                      <div className="relative shrink-0">
                        <img
                          src={player.avatarUrl}
                          alt={player.name}
                          referrerPolicy="no-referrer"
                          className={`w-10 h-10 object-cover rounded-xl border ${
                            player.isStar ? 'border-amber-400 ring-2 ring-amber-400/10' : 'border-slate-200'
                          }`}
                        />
                        <span className="absolute -top-1 -right-1.5 bg-slate-800 text-white text-[8px] font-bold px-1.5 py-[0.1px] rounded-full">
                          #{player.shirtNumber}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-slate-800 text-xs truncate max-w-[100px]">{player.name}</span>
                          {player.isStar && (
                            <span className="bg-amber-400/95 text-slate-900 text-[8px] font-black px-1.5 py-[0.1px] rounded-sm shrink-0 uppercase scale-90 tracking-tighter">
                              Star
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono tracking-wide">{player.club} · {player.positionName}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {/* Value displays */}
                      <span className="text-xs font-bold text-slate-800 font-mono block">
                        {formatCurrency(player.marketValue)}
                      </span>
                      <span className="text-[9px] text-indigo-500 font-mono font-medium block">
                        商业值: {player.commercialValue}分
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- VIEW 3: MAIN NAVIGATION TABS -------------------- */}
      {!selectedTeamId && !selectedPlayerId && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
          
          {/* 1. TEAMS LIST TAB */}
          {activeTab === 'teams' && (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              
              {/* Header Info Dashboard */}
              <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white p-4.5 rounded-3xl shadow-md border-b border-white/5 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
                
                <h3 className="text-[15px] font-black tracking-wide flex items-center space-x-1.5">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>2026美加墨世界杯实力评估</span>
                </h3>
                <p className="text-[11px] text-emerald-100 mt-1 leading-relaxed">
                  系统为您整理了参赛强队的历史夺冠记录、主力实战阵型坐标、以及队内巨星的身价及商业实力评估。点击下方国家查看球队大名单及详细晋级历程：
                </p>
              </div>

              {/* System info label */}
              <div className="flex items-center justify-between border-b pb-2 mb-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">参赛国家队实力榜</span>
                <span className="text-[10px] text-slate-400 font-mono">已收录核心强队</span>
              </div>

              {/* Grid list of countries */}
              <div className="space-y-3">
                {sortedTeams.map((team) => (
                  <div
                    key={team.id}
                    id={`team-block-${team.id}`}
                    onClick={() => handleSelectTeam(team.id)}
                    className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      {/* Flag box */}
                      <div className="w-11 h-11 bg-slate-500/10 rounded-full flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-inner">
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </div>

                      {/* Info lines */}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800 text-sm tracking-tight">{team.name}</span>
                          <span className="text-[8px] font-bold bg-slate-100 text-slate-400 uppercase tracking-widest px-1 py-[1px] rounded">
                            {team.region}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[190px]">
                          🏆 {team.bestRecord}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 shrink-0">
                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest leading-none">实力档次</span>
                        <span className="text-base font-black text-emerald-600 font-mono">
                          NO.{team.strengthRank}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. GLOBAL PLAYERS LIST / SORT TAB */}
          {activeTab === 'rankings' && (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto" id="players_rankings_tab">
              
              {/* Filter Sort Header Selector */}
              <div className="flex flex-col space-y-3.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">全局球员数据总排行（倒序排列）</span>
                
                {/* Visual select button strip */}
                <div className="flex space-x-2 bg-slate-100 rounded-xl p-1 border">
                  <button
                    id="sortBy_market"
                    onClick={() => setGlobalSortBy('market_value')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 ${
                      globalSortBy === 'market_value'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>市场身价倒序</span>
                  </button>
                  <button
                    id="sortBy_commercial"
                    onClick={() => setGlobalSortBy('commercial_value')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 ${
                      globalSortBy === 'commercial_value'
                        ? 'bg-[#18314F] text-white shadow'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>商业价值倒序</span>
                  </button>
                </div>
              </div>

              {/* Roster table */}
              <div className="space-y-2.5">
                {sortedGlobalPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    id={`rank-player-row-${player.id}`}
                    onClick={() => handleSelectPlayer(player.id, 'rankings')}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      {/* Ranking Badge Ring */}
                      <span className={`w-6 h-6 rounded-full font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                        index === 0 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs' 
                          : index === 1 
                          ? 'bg-slate-200 text-slate-700 border' 
                          : index === 2 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {index + 1}
                      </span>

                      {/* Avatar */}
                      <img
                        src={player.avatarUrl}
                        alt={player.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-xl border border-slate-200 shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{player.name}</span>
                          <span className="bg-emerald-50 text-emerald-800 text-[8px] font-bold px-1.5 rounded-sm shrink-0">
                            {player.teamName}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono tracking-wide">{player.club} · {player.positionName}</span>
                      </div>
                    </div>

                    {/* Score detail column */}
                    <div className="text-right shrink-0">
                      {globalSortBy === 'market_value' ? (
                        <>
                          <span className="text-sm font-black text-slate-800 font-mono block leading-none">
                            {formatCurrency(player.marketValue)}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                            商业值: {player.commercialValue}分
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-black text-indigo-650 font-mono block leading-none">
                            {player.commercialValue} <span className="text-[10px] font-normal text-slate-400">分</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                            身价: {formatCurrency(player.marketValue)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 3. COMPARISON BOARD TAB */}
          {activeTab === 'compare' && (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto" id="compare_tab">
              
              {/* Introduction Banner */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center space-x-1">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>核心能力多维比重分析</span>
                </span>
                <p className="text-[10.5px] text-slate-500 leading-normal font-sans">
                  对比板支持同时将 <span className="text-amber-600 font-bold">2-3位任意球员</span> 进行重叠雷达对比、直观排布。通过下方卡片进行快速添加或剔除成员：
                </p>
                
                {/* Active comparative player slots */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[0, 1, 2].map((slotIndex) => {
                    const currentSlotPlayer = comparedPlayers[slotIndex];
                    return (
                      <div
                        key={slotIndex}
                        className={`h-[72px] rounded-xl border flex flex-col items-center justify-center p-1.5 relative transition-all ${
                          currentSlotPlayer
                            ? 'bg-slate-55 border-slate-250'
                            : 'bg-dashed border-slate-250 text-slate-350 cursor-pointer hover:border-emerald-500 hover:text-emerald-500'
                        }`}
                        onClick={() => {
                          if (!currentSlotPlayer) {
                            setIsAddingToCompare(true);
                          }
                        }}
                      >
                        {currentSlotPlayer ? (
                          <>
                            {/* Avatar */}
                            <img
                              src={currentSlotPlayer.avatarUrl}
                              alt={currentSlotPlayer.name}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 object-cover rounded-full border border-white"
                            />
                            <span className="text-[9px] text-slate-800 font-black truncate max-w-full text-center mt-1">
                              {currentSlotPlayer.name.split('·')[1] || currentSlotPlayer.name}
                            </span>
                            {/* Remove button x */}
                            <button
                              id={`remove-slot-${currentSlotPlayer.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveComparePlayer(currentSlotPlayer.id);
                              }}
                              className="absolute -top-1 -right-1 bg-slate-800 text-white rounded-full p-0.5 hover:bg-red-500 active:scale-90 transition-all border border-white"
                              title="移除"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 mb-0.5" />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">待添加</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OVERLAPPED RADAR CONTAINER */}
              {comparedPlayers.length > 0 ? (
                <div className="bg-[#121c17] p-4.5 rounded-3xl border border-emerald-950/40 flex flex-col items-center select-none shadow-inner" id="compare-radar-block">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest self-start pl-1 mb-2">
                    📊 重合度对比雷达
                  </span>
                  
                  <div className="w-full h-64 flex items-center justify-center relative">
                    <RadarChart players={comparedPlayers} />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400">
                  <p className="text-xs">暂无选定的球员。请点击“待添加”卡片或去国家队名单中加选球员。</p>
                </div>
              )}

              {/* DETAILED SIDE-BY-SIDE VALUES GRID TABLE */}
              {comparedPlayers.length >= 2 && (
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3" id="comparative_detail_table">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b pb-1.5 flex items-center space-x-1.5">
                    <PieChart className="w-4 h-4 text-indigo-650" />
                    <span>核心指标横向细项对比</span>
                  </h4>

                  <div className="text-[10.5px] space-y-2.5">
                    
                    {/* Position and team row */}
                    <div className="grid grid-cols-4 gap-1 text-center py-1 border-b">
                      <span className="text-slate-400 text-left font-medium">基本信息</span>
                      {comparedPlayers.map(p => (
                        <div key={p.id} className="font-bold text-slate-800 text-[10px] truncate">
                          {p.teamName} · {p.positionName.split('/')[0]}
                        </div>
                      ))}
                      {/* Buffer empty cell if only 2 players */}
                      {comparedPlayers.length === 2 && <div className="text-slate-300 font-mono">—</div>}
                    </div>

                    {/* Age row */}
                    <div className="grid grid-cols-4 gap-1 text-center py-1 border-b">
                      <span className="text-slate-400 text-left font-medium">年龄</span>
                      {comparedPlayers.map((p, idx) => {
                        // Find lowest age (youngest) to highligt
                        const lowestAge = Math.min(...comparedPlayers.map(o => o.age));
                        return (
                          <div key={p.id} className={`font-mono text-[10.5px] ${p.age === lowestAge ? 'text-emerald-600 font-black' : 'text-slate-700'}`}>
                            {p.age}岁
                          </div>
                        );
                      })}
                      {comparedPlayers.length === 2 && <div className="text-slate-350 font-mono">—</div>}
                    </div>

                    {/* Market valuation comparative row */}
                    <div className="grid grid-cols-4 gap-1 text-center py-1 border-b">
                      <span className="text-slate-400 text-left font-medium">评估身价</span>
                      {comparedPlayers.map(p => {
                        const highestVal = Math.max(...comparedPlayers.map(o => o.marketValue));
                        return (
                          <div key={p.id} className={`font-mono text-[10.5px] font-bold ${p.marketValue === highestVal ? 'text-amber-600 font-black' : 'text-slate-700'}`}>
                            {formatCurrency(p.marketValue)}
                          </div>
                        );
                      })}
                      {comparedPlayers.length === 2 && <div className="text-slate-350 font-mono">—</div>}
                    </div>

                    {/* Commercial values rating comparative row */}
                    <div className="grid grid-cols-4 gap-1 text-center py-1 border-b">
                      <span className="text-slate-400 text-left font-medium">商业价值分</span>
                      {comparedPlayers.map(p => {
                        const highestCom = Math.max(...comparedPlayers.map(o => o.commercialValue));
                        return (
                          <div key={p.id} className={`font-mono text-[10.5px] font-bold ${p.commercialValue === highestCom ? 'text-indigo-650 font-black' : 'text-slate-700'}`}>
                            {p.commercialValue}分
                          </div>
                        );
                      })}
                      {comparedPlayers.length === 2 && <div className="text-slate-350 font-mono">—</div>}
                    </div>

                    {/* Goals tally row */}
                    <div className="grid grid-cols-4 gap-1 text-center py-1 border-b">
                      <span className="text-slate-400 text-left font-medium">世预赛进球</span>
                      {comparedPlayers.map(p => {
                        const highestGoals = Math.max(...comparedPlayers.map(o => o.matchStats.goals));
                        return (
                          <div key={p.id} className={`font-mono text-[10.5px] font-bold ${p.matchStats.goals === highestGoals && highestGoals > 0 ? 'text-rose-500 font-black' : 'text-slate-600'}`}>
                            {p.matchStats.goals}
                          </div>
                        );
                      })}
                      {comparedPlayers.length === 2 && <div className="text-slate-350 font-mono">—</div>}
                    </div>

                    {/* Assists tally row */}
                    <div className="grid grid-cols-4 gap-1 text-center py-1 border-b">
                      <span className="text-slate-400 text-left font-medium">前场助攻</span>
                      {comparedPlayers.map(p => {
                        const highestAssists = Math.max(...comparedPlayers.map(o => o.matchStats.assists));
                        return (
                          <div key={p.id} className={`font-mono text-[10.5px] font-bold ${p.matchStats.assists === highestAssists && highestAssists > 0 ? 'text-indigo-500 font-black' : 'text-slate-600'}`}>
                            {p.matchStats.assists}
                          </div>
                        );
                      })}
                      {comparedPlayers.length === 2 && <div className="text-slate-350 font-mono">—</div>}
                    </div>

                    {/* General performance Match rating */}
                    <div className="grid grid-cols-4 gap-1 text-center py-1 border-b">
                      <span className="text-slate-400 text-left font-medium">场均综合分</span>
                      {comparedPlayers.map(p => {
                        const highestRating = Math.max(...comparedPlayers.map(o => o.matchStats.rating));
                        return (
                          <div key={p.id} className={`font-mono text-[10.5px] font-bold ${p.matchStats.rating === highestRating ? 'text-amber-500 font-black' : 'text-slate-700'}`}>
                            {p.matchStats.rating.toFixed(2)}
                          </div>
                        );
                      })}
                      {comparedPlayers.length === 2 && <div className="text-slate-350 font-mono">—</div>}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Quick-add Selector Modal Window */}
          {isAddingToCompare && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end z-50 transition-all duration-300">
              <div className="bg-white w-full rounded-t-[32px] max-h-[80%] overflow-y-auto flex flex-col p-4.5 space-y-3.5 shadow-2xl relative">
                {/* Drag bar decoration */}
                <div className="w-12 h-1.5 bg-slate-300 rounded-full self-center" />
                
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-800">
                    选择加入对比的2026年球员 ({worldCupData.players.length}项)
                  </h4>
                  <button
                    id="close_selector_modal"
                    onClick={() => setIsAddingToCompare(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xs"
                  >
                    取消
                  </button>
                </div>

                <div className="space-y-2 overflow-y-auto pr-1">
                  {worldCupData.players.map((p) => {
                    const isAlreadySelected = comparePlayerIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        id={`select-p-list-${p.id}`}
                        onClick={() => {
                          if (isAlreadySelected) {
                            handleRemoveComparePlayer(p.id);
                          } else {
                            handleAddComparePlayer(p.id);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isAlreadySelected 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs' 
                            : 'bg-slate-50 border-slate-200/80 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          {/* Image */}
                          <img
                            src={p.avatarUrl}
                            alt={p.name}
                            className="w-8 h-8 object-cover rounded-lg border"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-slate-800 truncate block leading-tight">
                              {p.name}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-mono">
                              {p.teamName} · {p.positionName} · #{p.shirtNumber}
                            </span>
                          </div>
                        </div>

                        {/* Right check/state mark */}
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold font-mono block">
                            {formatCurrency(p.marketValue)}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-tight ${
                            isAlreadySelected ? 'text-emerald-600' : 'text-slate-400'
                          }`}>
                            {isAlreadySelected ? '✓ 已选中' : '+ 加比'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden" id="schedule_tab">
              {/* Filter bar */}
              <div className="flex items-center gap-2 p-3 bg-white border-b border-slate-200 shrink-0">
                {[
                  { key: 'all' as const, label: '全部' },
                  { key: 'upcoming' as const, label: '未开始' },
                  { key: 'finished' as const, label: '已结束' },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setScheduleFilter(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      scheduleFilter === f.key
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
                <span className="ml-auto text-[9px] text-slate-400">* 北京时间</span>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto">
                {scheduleLoading && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3" />
                    <span className="text-xs text-slate-400">正在加载赛程数据...</span>
                  </div>
                )}

                {scheduleError && (
                  <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl">!</span>
                    </div>
                    <span className="text-sm text-slate-600 text-center">{scheduleError}</span>
                    <button
                      onClick={() => {
                        setScheduleLoading(true);
                        setScheduleError(null);
                        fetchAllMatches()
                          .then(matches => {
                            setScheduleMatches(matches);
                            setScheduleLoading(false);
                          })
                          .catch(() => {
                            setScheduleError('赛程数据加载失败，请稍后重试');
                            setScheduleLoading(false);
                          });
                      }}
                      className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      重新加载
                    </button>
                  </div>
                )}

                {!scheduleLoading && !scheduleError && groupedSchedule.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Calendar className="w-10 h-10 text-slate-300 mb-2" />
                    <span className="text-sm text-slate-400">暂无赛程数据</span>
                  </div>
                )}

                {!scheduleLoading && !scheduleError && groupedSchedule.map(([date, matches]) => (
                  <div key={date}>
                    {/* Date group header */}
                    <div className="sticky top-0 bg-slate-100/95 backdrop-blur-sm px-4 py-2 text-xs font-bold text-slate-500 border-b border-slate-200/50 z-10">
                      {formatScheduleDate(date)} · {matches.length}场比赛
                    </div>
                    {/* Match cards */}
                    <div className="p-3 space-y-2.5">
                      {matches.map(match => (
                        <div
                          key={match.id}
                          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs"
                        >
                          {/* Status badge */}
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center space-x-1.5">
                              {match.round && (
                                <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                  第{match.round}轮
                                </span>
                              )}
                              {match.country && (
                                <span className="text-[9px] text-slate-400 flex items-center">
                                  <MapPin className="w-2.5 h-2.5 mr-0.5" />
                                  {match.country}
                                </span>
                              )}
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              match.status === 'FT'
                                ? 'bg-emerald-50 text-emerald-700'
                                : match.status === 'NS'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-orange-50 text-orange-600'
                            }`}>
                              {match.status === 'FT' ? '已结束' : match.status === 'NS' ? '未开始' : match.status}
                            </span>
                          </div>

                          {/* Teams row */}
                          <div className="flex items-center justify-between">
                            {/* Home team */}
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <img
                                src={match.homeTeamBadge}
                                alt={match.homeTeam}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 object-contain rounded bg-slate-50"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              <span className="text-sm font-bold text-slate-800 truncate">{match.homeTeam}</span>
                            </div>

                            {/* Score / VS */}
                            <div className="mx-3 flex flex-col items-center shrink-0">
                              {match.status === 'FT' && match.homeScore != null && match.awayScore != null ? (
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-lg font-black text-slate-900 font-mono">{match.homeScore}</span>
                                  <span className="text-xs text-slate-400 font-bold">:</span>
                                  <span className="text-lg font-black text-slate-900 font-mono">{match.awayScore}</span>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">VS</span>
                              )}
                              <span className="text-[9px] text-slate-400 mt-0.5">
                                {formatToChinaTime(match.time)}
                              </span>
                            </div>

                            {/* Away team */}
                            <div className="flex items-center space-x-2 flex-1 min-w-0 justify-end">
                              <span className="text-sm font-bold text-slate-800 truncate text-right">{match.awayTeam}</span>
                              <img
                                src={match.awayTeamBadge}
                                alt={match.awayTeam}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 object-contain rounded bg-slate-50"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          </div>

                          {/* Venue */}
                          {match.venue && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center text-[9px] text-slate-400">
                              <MapPin className="w-2.5 h-2.5 mr-1 shrink-0" />
                              <span className="truncate">{match.venue}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- MOCK WECHAT TAB BAR BOTTOM PANEL -------------------- */}
          <div className="bg-[#ffffff] border-t border-slate-200/80 p-1 shrink-0 grid grid-cols-4 select-none text-center">
            
            {/* TAB button 1 */}
            <button
              id="tab-btn-teams"
              onClick={() => {
                setActiveTab('teams');
                setSelectedTeamId(null);
                setSelectedPlayerId(null);
              }}
              className={`flex flex-col items-center justify-center py-2 transition-all cursor-pointer ${
                activeTab === 'teams' ? 'text-emerald-650 font-bold scale-102' : 'text-slate-450 hover:text-slate-600'
              }`}
            >
              <Trophy className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-wide">球队数据</span>
            </button>

            {/* TAB button 2 */}
            <button
              id="tab-btn-rankings"
              onClick={() => {
                setActiveTab('rankings');
                setSelectedTeamId(null);
                setSelectedPlayerId(null);
              }}
              className={`flex flex-col items-center justify-center py-2 transition-all cursor-pointer ${
                activeTab === 'rankings' ? 'text-emerald-650 font-bold scale-102' : 'text-slate-450 hover:text-slate-600'
              }`}
            >
              <TrendingUp className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-wide">全球排名</span>
            </button>

            {/* TAB button 3 */}
            <button
              id="tab-btn-compare"
              onClick={() => {
                setActiveTab('compare');
                setSelectedTeamId(null);
                setSelectedPlayerId(null);
              }}
              className={`flex flex-col items-center justify-center py-2 transition-all cursor-pointer ${
                activeTab === 'compare' ? 'text-emerald-650 font-bold scale-102' : 'text-slate-450 hover:text-slate-600'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-wide">球员对拆</span>
            </button>

            {/* TAB button 4 */}
            <button
              id="tab-btn-schedule"
              onClick={() => {
                setActiveTab('schedule');
                setSelectedTeamId(null);
                setSelectedPlayerId(null);
              }}
              className={`flex flex-col items-center justify-center py-2 transition-all cursor-pointer ${
                activeTab === 'schedule' ? 'text-emerald-650 font-bold scale-102' : 'text-slate-450 hover:text-slate-600'
              }`}
            >
              <Calendar className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-wide">赛程</span>
            </button>

          </div>

        </div>
      )}
    </WeChatFrame>
  );
}
