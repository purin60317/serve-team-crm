import React from 'react';
import { Users, Smartphone, UserCheck, Shield, Info } from 'lucide-react';
import { SummaryStats } from '../types';

interface StatsGridProps {
  stats: SummaryStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      id: 'stat-volunteers',
      title: '總服事夥伴人數',
      value: stats.totalVolunteers.toLocaleString(),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      desc: '目前各分部已登記的服事團隊總夥伴人數',
      progress: null,
    },
    {
      id: 'stat-phone',
      title: '手機驗證綁定率',
      value: `${stats.phoneVerifiedRate.toFixed(1)}%`,
      icon: Smartphone,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      desc: `通過驗證：${stats.phoneVerifiedCount.toLocaleString()} 人`,
      progress: stats.phoneVerifiedRate,
      progressColor: 'bg-emerald-500',
    },
    {
      id: 'stat-builders',
      title: 'Builder 建造者佔比',
      value: `${stats.builderRatio.toFixed(1)}%`,
      icon: Shield,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      desc: `B1: ${stats.b1Count} | B2: ${stats.b2Count} | B3: ${stats.b3Count} 人`,
      progress: stats.builderRatio,
      progressColor: 'bg-amber-500',
    },
    {
      id: 'stat-groups',
      title: '已有小組佔比',
      value: `${stats.hasGroupRate.toFixed(1)}%`,
      icon: UserCheck,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      desc: `已有小組：${stats.hasGroupCount.toLocaleString()} 人`,
      progress: stats.hasGroupRate,
      progressColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              id={card.id}
              className={`p-5 bg-white rounded-2xl border ${card.borderColor} shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500">
                    {card.title}
                  </span>
                  <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-mono text-slate-800 tracking-tight">
                  {card.value}
                </h3>
              </div>

              <div className="mt-4">
                {card.progress !== null && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mb-2 overflow-hidden">
                    <div
                      className={`h-full ${card.progressColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(0, card.progress))}%` }}
                    />
                  </div>
                )}
                <p className="text-xs text-slate-400 font-mono">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Builder definition elegant bar under StatsGrid */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Builder 建造者體系定義</p>
            <p className="text-[10px] text-slate-400">培育網絡中不同階段的核心事工領袖發展指標</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-[11px] w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold font-mono rounded shrink-0">B1</span>
            <span className="text-slate-600 font-medium">目前是正式夥伴、核心夥伴</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 font-bold font-mono rounded shrink-0">B2</span>
            <span className="text-slate-600 font-medium">有服事團隊[活躍]的人滿 12 個月</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 font-bold font-mono rounded shrink-0">B3</span>
            <span className="text-slate-600 font-medium">目前是服事團隊領袖</span>
          </div>
        </div>
      </div>
    </div>
  );
}
