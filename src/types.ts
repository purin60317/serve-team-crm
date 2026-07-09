export interface MemberRecord {
  id: string;
  phoneVerified: boolean; // 會眾資料: 手機驗證通過
  hasGroup: boolean;      // 會眾資料: 已有小組
  hasTeam: boolean;       // 會眾資料: 已有服事團隊
  teamCount: number;      // 服事團隊資料: 團隊人數計算 (會動態更新)
  b1: boolean;            // 會眾資料: 會眾身份[服事] B1 人數
  b2: boolean;            // 會眾資料: 會眾身份[服事] B2 人數
  b3: boolean;            // 會眾資料: 會眾身份[服事] B3 人數
  campus: string;         // 團隊所屬Campus
  team: string;           // 團隊(英文)
  subTeam: string;        // 子團隊(英文)
  updatedAt?: string;     // 更新時間
}

export interface SummaryStats {
  totalVolunteers: number;
  phoneVerifiedCount: number;
  phoneVerifiedRate: number;
  hasGroupCount: number;
  hasGroupRate: number;
  hasTeamCount: number;
  hasTeamRate: number;
  b1Count: number;
  b2Count: number;
  b3Count: number;
  totalBuildersCount: number;
  builderRatio: number; // Percentage of volunteers who are builders (B1+B2+B3)
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  campus: string;
  operator: string;
  action: string;
  status: 'success' | 'pending' | 'failed';
  details: string;
}

export interface CampusStats {
  campus: string;
  volunteerCount: number;
  phoneVerifiedRate: number;
  hasGroupRate: number;
  b1Count: number;
  b2Count: number;
  b3Count: number;
}
