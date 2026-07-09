import { MemberRecord } from '../types';

interface TeamSpecification {
  campus: string;
  team: string;
  subTeam: string;
  size: number;
  phoneVerifiedCount: number;
  hasGroupCount: number;
  hasTeamCount: number;
  b1Count: number;
  b2Count: number;
  b3Count: number;
}

// Exact specifications extracted from the report1783573886142 CSV
const specifications: TeamSpecification[] = [
  // === 台中分部 ===
  { campus: '台中分部', team: 'Baptism', subTeam: '', size: 16, phoneVerifiedCount: 12, hasGroupCount: 8, hasTeamCount: 16, b1Count: 10, b2Count: 0, b3Count: 3 },
  { campus: '台中分部', team: 'BELONG', subTeam: '', size: 13, phoneVerifiedCount: 9, hasGroupCount: 4, hasTeamCount: 13, b1Count: 8, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Communications', subTeam: 'Campus Marketing', size: 8, phoneVerifiedCount: 4, hasGroupCount: 1, hasTeamCount: 4, b1Count: 3, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Communications', subTeam: 'Designers', size: 5, phoneVerifiedCount: 4, hasGroupCount: 3, hasTeamCount: 4, b1Count: 2, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Communications', subTeam: 'Photo & Video', size: 13, phoneVerifiedCount: 10, hasGroupCount: 8, hasTeamCount: 10, b1Count: 9, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Empower', subTeam: '', size: 8, phoneVerifiedCount: 7, hasGroupCount: 4, hasTeamCount: 6, b1Count: 5, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Equip', subTeam: '', size: 23, phoneVerifiedCount: 19, hasGroupCount: 15, hasTeamCount: 19, b1Count: 13, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Events', subTeam: 'Events', size: 12, phoneVerifiedCount: 8, hasGroupCount: 5, hasTeamCount: 11, b1Count: 8, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Home Team', subTeam: 'eHQ', size: 13, phoneVerifiedCount: 10, hasGroupCount: 7, hasTeamCount: 11, b1Count: 9, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Home Team', subTeam: 'Greeters', size: 11, phoneVerifiedCount: 8, hasGroupCount: 5, hasTeamCount: 6, b1Count: 5, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Home Team', subTeam: 'Home Team (New in)', size: 16, phoneVerifiedCount: 9, hasGroupCount: 3, hasTeamCount: 4, b1Count: 0, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Home Team', subTeam: 'Hosts', size: 11, phoneVerifiedCount: 7, hasGroupCount: 5, hasTeamCount: 6, b1Count: 6, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Home Team', subTeam: 'Next Step (Frontend)', size: 9, phoneVerifiedCount: 7, hasGroupCount: 4, hasTeamCount: 7, b1Count: 4, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Home Team', subTeam: 'Security', size: 1, phoneVerifiedCount: 1, hasGroupCount: 1, hasTeamCount: 1, b1Count: 0, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Home Team', subTeam: 'Ushers', size: 17, phoneVerifiedCount: 15, hasGroupCount: 12, hasTeamCount: 16, b1Count: 13, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Home Team', subTeam: 'Venue', size: 19, phoneVerifiedCount: 12, hasGroupCount: 8, hasTeamCount: 13, b1Count: 12, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Hope Kids', subTeam: '', size: 35, phoneVerifiedCount: 24, hasGroupCount: 16, hasTeamCount: 25, b1Count: 21, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Next Step (Backend)', subTeam: '', size: 13, phoneVerifiedCount: 11, hasGroupCount: 7, hasTeamCount: 6, b1Count: 5, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Production', subTeam: 'Audio', size: 7, phoneVerifiedCount: 6, hasGroupCount: 4, hasTeamCount: 7, b1Count: 5, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Production', subTeam: 'Camera', size: 14, phoneVerifiedCount: 11, hasGroupCount: 7, hasTeamCount: 13, b1Count: 6, b2Count: 0, b3Count: 3 },
  { campus: '台中分部', team: 'Production', subTeam: 'Lights', size: 9, phoneVerifiedCount: 7, hasGroupCount: 6, hasTeamCount: 6, b1Count: 3, b2Count: 0, b3Count: 3 },
  { campus: '台中分部', team: 'Production', subTeam: 'Production', size: 7, phoneVerifiedCount: 2, hasGroupCount: 2, hasTeamCount: 3, b1Count: 2, b2Count: 0, b3Count: 1 },
  { campus: '台中分部', team: 'Production', subTeam: 'Production Manager', size: 4, phoneVerifiedCount: 3, hasGroupCount: 3, hasTeamCount: 4, b1Count: 2, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Production', subTeam: 'Screen Support', size: 14, phoneVerifiedCount: 9, hasGroupCount: 5, hasTeamCount: 10, b1Count: 6, b2Count: 0, b3Count: 3 },
  { campus: '台中分部', team: 'Production', subTeam: 'Stage Manager', size: 7, phoneVerifiedCount: 4, hasGroupCount: 4, hasTeamCount: 6, b1Count: 2, b2Count: 0, b3Count: 2 },
  { campus: '台中分部', team: 'Worship', subTeam: 'Vocals & Band', size: 15, phoneVerifiedCount: 12, hasGroupCount: 10, hasTeamCount: 14, b1Count: 11, b2Count: 0, b3Count: 2 },

  // === 台北分部 ===
  { campus: '台北分部', team: 'Baptism', subTeam: '', size: 51, phoneVerifiedCount: 31, hasGroupCount: 23, hasTeamCount: 43, b1Count: 18, b2Count: 1, b3Count: 2 },
  { campus: '台北分部', team: 'BELONG', subTeam: '', size: 22, phoneVerifiedCount: 19, hasGroupCount: 18, hasTeamCount: 21, b1Count: 18, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Communications', subTeam: 'Central Marketing', size: 41, phoneVerifiedCount: 24, hasGroupCount: 18, hasTeamCount: 23, b1Count: 26, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Communications', subTeam: 'Copywriters', size: 10, phoneVerifiedCount: 6, hasGroupCount: 4, hasTeamCount: 4, b1Count: 3, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Communications', subTeam: 'Designers', size: 23, phoneVerifiedCount: 13, hasGroupCount: 12, hasTeamCount: 18, b1Count: 14, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Communications', subTeam: 'Photo', size: 36, phoneVerifiedCount: 17, hasGroupCount: 15, hasTeamCount: 23, b1Count: 21, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Communications', subTeam: 'Translation', size: 6, phoneVerifiedCount: 3, hasGroupCount: 3, hasTeamCount: 6, b1Count: 4, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Communications', subTeam: 'Video', size: 29, phoneVerifiedCount: 6, hasGroupCount: 5, hasTeamCount: 8, b1Count: 6, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Empower', subTeam: '', size: 23, phoneVerifiedCount: 14, hasGroupCount: 11, hasTeamCount: 15, b1Count: 12, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Equip', subTeam: '', size: 97, phoneVerifiedCount: 69, hasGroupCount: 56, hasTeamCount: 75, b1Count: 53, b2Count: 0, b3Count: 3 },
  { campus: '台北分部', team: 'Events', subTeam: 'Events', size: 53, phoneVerifiedCount: 23, hasGroupCount: 15, hasTeamCount: 24, b1Count: 23, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Guest Host Team', subTeam: '', size: 17, phoneVerifiedCount: 13, hasGroupCount: 12, hasTeamCount: 17, b1Count: 14, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Home Team', subTeam: '', size: 2, phoneVerifiedCount: 2, hasGroupCount: 1, hasTeamCount: 2, b1Count: 0, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Home Team', subTeam: 'eHQ', size: 82, phoneVerifiedCount: 50, hasGroupCount: 42, hasTeamCount: 62, b1Count: 39, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Home Team', subTeam: 'Greeters', size: 43, phoneVerifiedCount: 28, hasGroupCount: 16, hasTeamCount: 41, b1Count: 34, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Home Team', subTeam: 'Hosts', size: 65, phoneVerifiedCount: 39, hasGroupCount: 29, hasTeamCount: 42, b1Count: 39, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Home Team', subTeam: 'Next Step (Frontend)', size: 61, phoneVerifiedCount: 38, hasGroupCount: 25, hasTeamCount: 43, b1Count: 33, b2Count: 0, b3Count: 4 },
  { campus: '台北分部', team: 'Home Team', subTeam: 'Security', size: 35, phoneVerifiedCount: 19, hasGroupCount: 15, hasTeamCount: 24, b1Count: 20, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Home Team', subTeam: 'Ushers', size: 127, phoneVerifiedCount: 71, hasGroupCount: 48, hasTeamCount: 98, b1Count: 68, b2Count: 0, b3Count: 6 },
  { campus: '台北分部', team: 'Home Team', subTeam: 'Venue', size: 59, phoneVerifiedCount: 33, hasGroupCount: 21, hasTeamCount: 36, b1Count: 28, b2Count: 0, b3Count: 3 },
  { campus: '台北分部', team: 'Home Team (Sat.)', subTeam: '(Sat.) eHQ', size: 6, phoneVerifiedCount: 5, hasGroupCount: 5, hasTeamCount: 6, b1Count: 4, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Home Team (Sat.)', subTeam: '(Sat.) Security', size: 3, phoneVerifiedCount: 2, hasGroupCount: 2, hasTeamCount: 3, b1Count: 2, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Home Team (Sat.)', subTeam: 'Facility Team', size: 9, phoneVerifiedCount: 7, hasGroupCount: 7, hasTeamCount: 9, b1Count: 7, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Home Team (Sat.)', subTeam: 'Welcome Team', size: 26, phoneVerifiedCount: 17, hasGroupCount: 13, hasTeamCount: 20, b1Count: 16, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Hope Kids', subTeam: '', size: 247, phoneVerifiedCount: 120, hasGroupCount: 70, hasTeamCount: 135, b1Count: 110, b2Count: 1, b3Count: 2 },
  { campus: '台北分部', team: 'hope yth', subTeam: '', size: 58, phoneVerifiedCount: 37, hasGroupCount: 22, hasTeamCount: 30, b1Count: 24, b2Count: 0, b3Count: 3 },
  { campus: '台北分部', team: 'Next Step (Backend)', subTeam: '', size: 45, phoneVerifiedCount: 25, hasGroupCount: 17, hasTeamCount: 28, b1Count: 16, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Outreach', subTeam: '', size: 42, phoneVerifiedCount: 21, hasGroupCount: 15, hasTeamCount: 21, b1Count: 16, b2Count: 1, b3Count: 2 },
  { campus: '台北分部', team: 'Prayer Team', subTeam: '', size: 103, phoneVerifiedCount: 62, hasGroupCount: 44, hasTeamCount: 57, b1Count: 44, b2Count: 0, b3Count: 3 },
  { campus: '台北分部', team: 'Production', subTeam: 'Audio', size: 54, phoneVerifiedCount: 26, hasGroupCount: 19, hasTeamCount: 26, b1Count: 26, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Production', subTeam: 'Camera', size: 79, phoneVerifiedCount: 37, hasGroupCount: 44, hasTeamCount: 58, b1Count: 40, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Production', subTeam: 'Lights', size: 25, phoneVerifiedCount: 11, hasGroupCount: 6, hasTeamCount: 10, b1Count: 9, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Production', subTeam: 'Production Manager', size: 7, phoneVerifiedCount: 5, hasGroupCount: 6, hasTeamCount: 7, b1Count: 5, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Production', subTeam: 'Screen Support', size: 39, phoneVerifiedCount: 18, hasGroupCount: 13, hasTeamCount: 21, b1Count: 18, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Production', subTeam: 'Space Design', size: 17, phoneVerifiedCount: 10, hasGroupCount: 8, hasTeamCount: 12, b1Count: 11, b2Count: 0, b3Count: 1 },
  { campus: '台北分部', team: 'Production', subTeam: 'Stage Manager', size: 46, phoneVerifiedCount: 24, hasGroupCount: 25, hasTeamCount: 31, b1Count: 25, b2Count: 0, b3Count: 4 },
  { campus: '台北分部', team: 'Tech Team', subTeam: '', size: 26, phoneVerifiedCount: 16, hasGroupCount: 15, hasTeamCount: 21, b1Count: 17, b2Count: 0, b3Count: 2 },
  { campus: '台北分部', team: 'Worship', subTeam: 'Dance', size: 24, phoneVerifiedCount: 9, hasGroupCount: 7, hasTeamCount: 13, b1Count: 10, b2Count: 0, b3Count: 3 },
  { campus: '台北分部', team: 'Worship', subTeam: 'Vocals & Band', size: 237, phoneVerifiedCount: 92, hasGroupCount: 52, hasTeamCount: 114, b1Count: 82, b2Count: 1, b3Count: 3 },

  // === 線上分部 ===
  { campus: '線上分部', team: 'Communications', subTeam: 'Campus Marketing', size: 22, phoneVerifiedCount: 11, hasGroupCount: 9, hasTeamCount: 10, b1Count: 11, b2Count: 0, b3Count: 1 },
  { campus: '線上分部', team: 'Communications', subTeam: 'Designers', size: 14, phoneVerifiedCount: 10, hasGroupCount: 10, hasTeamCount: 14, b1Count: 9, b2Count: 0, b3Count: 2 },
  { campus: '線上分部', team: 'Empower', subTeam: '', size: 18, phoneVerifiedCount: 11, hasGroupCount: 9, hasTeamCount: 10, b1Count: 7, b2Count: 0, b3Count: 2 },
  { campus: '線上分部', team: 'Equip', subTeam: '', size: 68, phoneVerifiedCount: 27, hasGroupCount: 25, hasTeamCount: 39, b1Count: 24, b2Count: 0, b3Count: 2 },
  { campus: '線上分部', team: 'Events', subTeam: '', size: 20, phoneVerifiedCount: 13, hasGroupCount: 11, hasTeamCount: 15, b1Count: 11, b2Count: 0, b3Count: 3 },
  { campus: '線上分部', team: 'Hope Nation Host', subTeam: '', size: 3, phoneVerifiedCount: 3, hasGroupCount: 2, hasTeamCount: 3, b1Count: 2, b2Count: 0, b3Count: 1 },
  { campus: '線上分部', team: 'Next Step (Backend)', subTeam: '', size: 53, phoneVerifiedCount: 23, hasGroupCount: 23, hasTeamCount: 31, b1Count: 20, b2Count: 0, b3Count: 1 },
  { campus: '線上分部', team: 'Online BELONG', subTeam: '', size: 44, phoneVerifiedCount: 21, hasGroupCount: 13, hasTeamCount: 23, b1Count: 16, b2Count: 0, b3Count: 2 },
  { campus: '線上分部', team: 'Online Host', subTeam: '', size: 1, phoneVerifiedCount: 1, hasGroupCount: 1, hasTeamCount: 1, b1Count: 0, b2Count: 0, b3Count: 1 },
  { campus: '線上分部', team: 'Pre Experience Hosts', subTeam: '', size: 23, phoneVerifiedCount: 14, hasGroupCount: 12, hasTeamCount: 18, b1Count: 13, b2Count: 0, b3Count: 4 },
  { campus: '線上分部', team: 'Production', subTeam: '', size: 10, phoneVerifiedCount: 5, hasGroupCount: 3, hasTeamCount: 4, b1Count: 2, b2Count: 0, b3Count: 1 },
  { campus: '線上分部', team: 'YouTube Host', subTeam: '', size: 38, phoneVerifiedCount: 15, hasGroupCount: 10, hasTeamCount: 16, b1Count: 15, b2Count: 0, b3Count: 2 }
];

/**
 * Programmatically generates the full initial dataset based on specifications.
 * This guarantees 100% aggregate statistic matching with report1783573886142
 * while keeping our code footprint extremely small and elegant.
 */
export function getInitialVolunteers(): MemberRecord[] {
  const volunteers: MemberRecord[] = [];
  let globalIdCounter = 1;

  specifications.forEach((spec) => {
    const size = spec.size;

    // We generate individual rows, distributing the true attributes proportionally
    for (let i = 0; i < size; i++) {
      // Determine if this row has phoneVerified based on remaining count
      const phoneVerified = i < spec.phoneVerifiedCount;
      const hasGroup = i < spec.hasGroupCount;
      const hasTeam = i < spec.hasTeamCount;

      // Distribute builders:
      // b3 are first, then b2, then b1, then none
      const b3 = i < spec.b3Count;
      const b2 = !b3 && i < (spec.b3Count + spec.b2Count);
      const b1 = !b3 && !b2 && i < (spec.b3Count + spec.b2Count + spec.b1Count);

      volunteers.push({
        id: `mem-${globalIdCounter++}`,
        phoneVerified,
        hasGroup,
        hasTeam,
        teamCount: size, // The exact group size calculation
        b1,
        b2,
        b3,
        campus: spec.campus,
        team: spec.team,
        subTeam: spec.subTeam,
        updatedAt: '2026-07-08' // Default date matching current temporal frame
      });
    }
  });

  return volunteers;
}

/**
 * Returns preset activity logs for sync simulation
 */
export function getInitialSyncLogs() {
  return [
    { id: 'log-1', timestamp: '2026-07-08 22:10:45', campus: '台北分部', operator: 'Mavis Lo', action: '資料同步', status: 'success', details: '台北分部 247 筆 Hope Kids 數據同步至總部' },
    { id: 'log-2', timestamp: '2026-07-08 21:45:12', campus: '台中分部', operator: 'Pastor Leo', action: '人員狀態更新', status: 'success', details: '更新 5 筆 Baptism 團隊的 B3 領袖狀態' },
    { id: 'log-3', timestamp: '2026-07-08 18:30:00', campus: '線上分部', operator: 'System Sync', action: '每日自動備份', status: 'success', details: '自動同步線上分部 12 個團隊，共 314 筆服事數據' },
    { id: 'log-4', timestamp: '2026-07-08 14:15:32', campus: '台北分部', operator: 'Worship Captain', action: '新增志工資料', status: 'success', details: '新增 12 筆 Worship (Vocals & Band) 服事團員' }
  ];
}
