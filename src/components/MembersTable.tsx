import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Users, 
  Smartphone, 
  UserCheck, 
  Shield 
} from 'lucide-react';
import { MemberRecord } from '../types';

interface TeamPerformanceTableProps {
  volunteers: MemberRecord[];
  activeCampus: string;
  activeTeam: string;
}

type SortField = 'team' | 'size' | 'phoneVerifiedRate' | 'hasGroupRate' | 'builderRate';
type SortDirection = 'asc' | 'desc';

export default function MembersTable({ 
  volunteers, 
  activeCampus, 
  activeTeam 
}: TeamPerformanceTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('size');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Group and compute indicators per team
  const teamRows = useMemo(() => {
    // 1. Filter by campus
    const campusFiltered = volunteers.filter(v => activeCampus === 'all' || v.campus === activeCampus);
    
    // 2. Group by team
    const teamsMap: Record<string, MemberRecord[]> = {};
    campusFiltered.forEach(v => {
      // If activeTeam is selected, we only show that team (or match query)
      if (activeTeam === 'all' || v.team === activeTeam) {
        if (!teamsMap[v.team]) {
          teamsMap[v.team] = [];
        }
        teamsMap[v.team].push(v);
      }
    });

    // 3. Compute stats for each team
    return Object.entries(teamsMap).map(([teamName, members]) => {
      const size = members.length;
      const phoneVerifiedCount = members.filter(m => m.phoneVerified).length;
      const hasGroupCount = members.filter(m => m.hasGroup).length;
      
      const b1Count = members.filter(m => m.b1).length;
      const b2Count = members.filter(m => m.b2).length;
      const b3Count = members.filter(m => m.b3).length;
      const builderCount = b1Count + b2Count + b3Count;

      return {
        team: teamName,
        campus: activeCampus === 'all' ? '跨分部' : activeCampus,
        size,
        phoneVerifiedCount,
        phoneVerifiedRate: size > 0 ? (phoneVerifiedCount / size) * 100 : 0,
        hasGroupCount,
        hasGroupRate: size > 0 ? (hasGroupCount / size) * 100 : 0,
        b1Count,
        b2Count,
        b3Count,
        builderCount,
        builderRate: size > 0 ? (builderCount / size) * 100 : 0,
      };
    });
  }, [volunteers, activeCampus, activeTeam]);

  // Apply search query & sorting
  const processedRows = useMemo(() => {
    let result = teamRows;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(row => row.team.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        const numA = valA as number;
        const numB = valB as number;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });

    return result;
  }, [teamRows, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for numbers
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 text-slate-400" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1 text-indigo-600" />
      : <ArrowDown className="h-3 w-3 ml-1 text-indigo-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5" id="team-performance-section">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            各分部事工團隊指標表現
            <span className="px-2 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-full font-mono">
              {processedRows.length} 個團隊
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            當前選定分部（{activeCampus === 'all' ? '所有分部' : activeCampus}）下各事工團隊的表現排名。點擊表頭指標欄位可進行即時排序。
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋事工團隊..."
            className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-full font-sans font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors"
                onClick={() => handleSort('team')}
              >
                <div className="flex items-center">
                  事工團隊
                  <SortIcon field="team" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors text-center"
                onClick={() => handleSort('size')}
              >
                <div className="flex items-center justify-center font-mono">
                  夥伴人數
                  <SortIcon field="size" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors text-center"
                onClick={() => handleSort('phoneVerifiedRate')}
              >
                <div className="flex items-center justify-center font-mono">
                  手機驗證綁定率
                  <SortIcon field="phoneVerifiedRate" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors text-center"
                onClick={() => handleSort('hasGroupRate')}
              >
                <div className="flex items-center justify-center font-mono">
                  已有小組佔比
                  <SortIcon field="hasGroupRate" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors text-center"
                onClick={() => handleSort('builderRate')}
              >
                <div className="flex items-center justify-center font-mono">
                  Builder 建造者佔比
                  <SortIcon field="builderRate" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {processedRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  無符合篩選條件的團隊數據
                </td>
              </tr>
            ) : (
              processedRows.map((row) => (
                <tr key={row.team} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {row.team}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-600">
                    {row.size.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">人</span>
                  </td>
                  
                  {/* Phone Verification */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="font-mono font-bold text-indigo-600">
                        {row.phoneVerifiedRate.toFixed(1)}%
                      </span>
                      <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-indigo-500" 
                          style={{ width: `${row.phoneVerifiedRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Group Ratio */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="font-mono font-bold text-indigo-600">
                        {row.hasGroupRate.toFixed(1)}%
                      </span>
                      <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-indigo-500" 
                          style={{ width: `${row.hasGroupRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Builder Ratio */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="font-mono font-bold text-indigo-600">
                        {row.builderRate.toFixed(1)}%
                      </span>
                      <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-indigo-500" 
                          style={{ width: `${row.builderRate}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-normal">
                        B1:{row.b1Count} | B2:{row.b2Count} | B3:{row.b3Count}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
