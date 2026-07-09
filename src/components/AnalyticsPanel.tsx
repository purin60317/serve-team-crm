import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList
} from 'recharts';
import { Info, TrendingUp, Lightbulb } from 'lucide-react';
import { MemberRecord, SummaryStats, CampusStats } from '../types';

interface AnalyticsPanelProps {
  volunteers: MemberRecord[];
  activeCampus: string;
  activeTeam: string;
}

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function AnalyticsPanel({ volunteers, activeCampus, activeTeam }: AnalyticsPanelProps) {
  // 1. Filtered records based on selection
  const filteredVolunteers = volunteers.filter(v => {
    const matchCampus = activeCampus === 'all' || v.campus === activeCampus;
    const matchTeam = activeTeam === 'all' || v.team === activeTeam;
    return matchCampus && matchTeam;
  });

  const total = filteredVolunteers.length;
  const verified = filteredVolunteers.filter(v => v.phoneVerified).length;
  const inGroup = filteredVolunteers.filter(v => v.hasGroup).length;
  const b1 = filteredVolunteers.filter(v => v.b1).length;
  const b2 = filteredVolunteers.filter(v => v.b2).length;
  const b3 = filteredVolunteers.filter(v => v.b3).length;
  const totalBuilders = b1 + b2 + b3;

  // 2. Prepare Data for Campus Distribution (Pie)
  const campusCounts = volunteers.reduce((acc: Record<string, number>, curr) => {
    acc[curr.campus] = (acc[curr.campus] || 0) + 1;
    return acc;
  }, {});

  const campusData = Object.keys(campusCounts).map(name => ({
    name,
    value: campusCounts[name],
  }));

  const totalCampusValue = campusData.reduce((sum, d) => sum + d.value, 0);

  // 3. Prepare Data for Stacked Builder Levels per Campus (Bar)
  const campuses = Array.from(new Set(volunteers.map(v => v.campus)));
  const builderData = campuses.map(campus => {
    const campusVolunteers = volunteers.filter(v => v.campus === campus);
    const b1Count = campusVolunteers.filter(v => v.b1).length;
    const b2Count = campusVolunteers.filter(v => v.b2).length;
    const b3Count = campusVolunteers.filter(v => v.b3).length;
    const totalB = b1Count + b2Count + b3Count;

    return {
      name: campus,
      'B1 (正式/核心夥伴)': totalB > 0 ? parseFloat(((b1Count / totalB) * 100).toFixed(1)) : 0,
      'B2 (活躍滿12個月)': totalB > 0 ? parseFloat(((b2Count / totalB) * 100).toFixed(1)) : 0,
      'B3 (事工團隊領袖)': totalB > 0 ? parseFloat(((b3Count / totalB) * 100).toFixed(1)) : 0,
      rawB1: b1Count,
      rawB2: b2Count,
      rawB3: b3Count,
      totalB,
    };
  });

  // 4. Prepare Data for KPI Rates (Mobile Verification & Group Ratios) per Campus
  const kpiData = campuses.map(campus => {
    const campusVolunteers = volunteers.filter(v => v.campus === campus);
    const count = campusVolunteers.length;
    const verifiedRate = count > 0 ? (campusVolunteers.filter(v => v.phoneVerified).length / count) * 100 : 0;
    const groupRate = count > 0 ? (campusVolunteers.filter(v => v.hasGroup).length / count) * 100 : 0;
    return {
      name: campus,
      '手機驗證綁定率': parseFloat(verifiedRate.toFixed(1)),
      '已有小組佔比': parseFloat(groupRate.toFixed(1)),
    };
  });

  // 5. Generate Smart Insights based on filtered data
  const generateInsights = () => {
    const insights: string[] = [];
    const phoneRate = total > 0 ? (verified / total) * 100 : 0;
    const groupRate = total > 0 ? (inGroup / total) * 100 : 0;
    const builderRate = total > 0 ? (totalBuilders / total) * 100 : 0;

    const locationStr = activeCampus === 'all' ? '全部分部' : activeCampus;
    const teamStr = activeTeam === 'all' ? '所有事工團隊' : `${activeTeam} 團隊`;

    if (phoneRate < 80) {
      insights.push(
        `【手機驗證偏低】目前 ${locationStr} 的 ${teamStr} 手機驗證綁定率為 ${phoneRate.toFixed(1)}%（低於 80% 安全閥值）。建議分部負責人於近期主日會前會，協助尚未驗證的團員完成綁定，以利同步總部系統通知。`
      );
    } else {
      insights.push(
        `【手機驗證良好】${locationStr} ${teamStr} 的驗證綁定率高達 ${phoneRate.toFixed(1)}%，保持極佳的通訊暢通度，有利於跨分部服事動員。`
      );
    }

    if (groupRate < 30) {
      insights.push(
        `【牧養覆蓋缺口】${teamStr} 有 ${(100 - groupRate).toFixed(1)}% 的夥伴「尚未加入小組（牧養系統）」。目前已加入小組率為 ${groupRate.toFixed(1)}%（低於 30% 基準）。服事與牧養應雙軌並行，請各分部 Empower 領袖協助對接小組長，協助這些核心夥伴落地生根。`
      );
    }

    if (b3 === 0 && total > 5) {
      insights.push(
        `【領導力斷層警訊】${locationStr} 的 ${teamStr} 目前「缺乏 B3 (領袖/隊長)」階層。建議儘速栽培有潛力的 B1/B2 夥伴，授權並輔導其承接隊長職責，避免團隊運作產生決策真空。`
      );
    } else if (b3 > 0 && b1 / b3 > 15) {
      insights.push(
        `【管理跨度過大】${locationStr} ${teamStr} 的「普通夥伴與 B3 領袖比例為 ${(b1 / b3).toFixed(0)}:1」，管理跨度過寬。建議提拔核心的 B1 夥伴升級為 B2，協助分擔日常服事編班與關懷。`
      );
    }

    if (builderRate < 70) {
      insights.push(
        `【事工培力建議】當前 Builder 佔比偏低（僅 ${builderRate.toFixed(1)}%，低於 70% 基準）。建議在下次 Empower 培訓營中，加強核心領袖課程，激發更多普通夥伴升級為一線 Builder。`
      );
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="space-y-6" id="analytics-panel">
      {/* Visual Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Campus Distribution (Pie) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block animate-pulse"></span>
              全體服事夥伴分部佔比
            </h4>
            <span className="text-xs text-slate-400">總體比例</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-[260px]">
            {/* Pie SVG */}
            <div className="w-1/2 h-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {campusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [`${value} 人`, '人數']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Labels next to the Circle */}
            <div className="w-1/2 flex flex-col gap-3 border-l border-slate-100 pl-4 py-2 shrink-0">
              {campusData.map((entry, idx) => {
                const pct = totalCampusValue > 0 ? ((entry.value / totalCampusValue) * 100).toFixed(1) : '0.0';
                return (
                  <div key={entry.name} className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      {entry.name}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-400 pl-3.5 mt-0.5">
                      {entry.value.toLocaleString()}人 <span className="text-indigo-500">({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 2: Stacked Builder Levels (Bar of percentage ratios) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block animate-pulse"></span>
              各分部 Builder 建造者佔比 (%)
            </h4>
            <span className="text-xs text-slate-400">建造者架構</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={builderData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Legend iconSize={9} wrapperStyle={{ fontSize: '10px', fontWeight: 500 }} />
                <Bar dataKey="B1 (正式/核心夥伴)" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]}>
                  <LabelList dataKey="B1 (正式/核心夥伴)" position="inside" formatter={(v: any) => v > 5 ? `${v}%` : ''} style={{ fontSize: '9px', fill: '#fff', fontWeight: 'bold' }} />
                </Bar>
                <Bar dataKey="B2 (活躍滿12個月)" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]}>
                  <LabelList dataKey="B2 (活躍滿12個月)" position="inside" formatter={(v: any) => v > 5 ? `${v}%` : ''} style={{ fontSize: '9px', fill: '#fff', fontWeight: 'bold' }} />
                </Bar>
                <Bar dataKey="B3 (事工團隊領袖)" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="B3 (事工團隊領袖)" position="inside" formatter={(v: any) => v > 5 ? `${v}%` : ''} style={{ fontSize: '9px', fill: '#fff', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Indicators comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Rates comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full inline-block"></span>
              各分部核心指標表現 (%)
            </h4>
            <span className="text-xs text-slate-400">指標分析</span>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend iconSize={9} wrapperStyle={{ fontSize: '10px', fontWeight: 500 }} />
                <Bar dataKey="手機驗證綁定率" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="手機驗證綁定率" position="top" formatter={(v: any) => `${v}%`} style={{ fontSize: '10px', fill: '#4f46e5', fontWeight: 'bold' }} />
                </Bar>
                <Bar dataKey="已有小組佔比" fill="#0d9488" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="已有小組佔比" position="top" formatter={(v: any) => `${v}%`} style={{ fontSize: '10px', fill: '#0d9488', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smart Insights Panel */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Lightbulb className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Empower 領袖決策觀點
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-normal leading-relaxed">
              系統根據您目前在 <span className="font-semibold text-slate-800">{activeCampus === 'all' ? '全部分部' : activeCampus}</span>、
              <span className="font-semibold text-slate-800">{activeTeam === 'all' ? '所有團隊' : `${activeTeam}`}</span> 的動態篩選，提供戰術決策指引：
            </p>

            <div className="space-y-3 overflow-y-auto max-h-[160px] pr-1">
              {insights.map((insight, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl shadow-2xs">
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex items-center gap-1">
            <Info className="h-3 w-3" />
            指標基準：手機驗證綁定率 &gt; 80% | 已有小組佔比 &gt; 30% | Builder 佔比 &gt; 70%
          </div>
        </div>
      </div>
    </div>
  );
}
